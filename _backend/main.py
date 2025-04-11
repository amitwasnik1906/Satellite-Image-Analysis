from fastapi import FastAPI, HTTPException, Depends, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from bson.objectid import ObjectId
import sys
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api

load_dotenv()
# Load environment variables from .env file

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import from change_detection
from change_detection import HighResolutionChangeDetector

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection - Use environment variable
mongodb_url = os.getenv("MONGODB_URL")
client = MongoClient(mongodb_url)
db = client["land_analysis"]
analysis_collection = db["analysis_history"]
regions_collection = db["available_regions"]

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Models
class RegionModel(BaseModel):
    name: str
    folder: str
    sample_url: str

class AnalysisHistoryModel(BaseModel):
    user_id: str
    input_type: str = "user_uploaded" or "predefined_region"  # Enum type
    before_image_year: int
    after_image_year: int
    cloud_vis_url: str
    cloud_change_map_url: str
    analysis: dict
    created_at: datetime = Field(default_factory=datetime.now)

# API Endpoints Request
class PredefinedRegionRequest(BaseModel):
    id: str = Field(alias="_id")  # This allows accepting _id in JSON but using id in code
    folder: str
    before_image_year: int
    after_image_year: int
    
    class Config:
        populate_by_name = True  # Allows both _id and id to be used
        allow_population_by_field_name = True  # For backward compatibility

class UserUploadedRegionRequest(BaseModel):
    before_image_year: int
    after_image_year: int
    
    


# API Endpoints Response
class AnalysisHistoryResponse(BaseModel):
    id: str = Field(alias="_id") 
    user_id: str
    input_type: str
    before_image_year: int
    after_image_year: int
    cloud_vis_url: str
    cloud_change_map_url: str
    analysis: dict
    created_at: datetime

class RegionResponse(BaseModel):
    id: str = Field(alias="_id")  # Changed type to str and use alias
    name: str
    folder: str
    sample_url: str
    
    class Config:
        allow_population_by_field_name = True  # Allows both _id and id to be used


# function for upload image to cloudinary
def upload_to_cloudinary(image_path, folder="land_analysis"):
    """
    Upload an image to Cloudinary and return the URL.
    
    Args:
        image_path (str): Path to the image file
        folder (str): Cloudinary folder to upload to
        
    Returns:
        str: URL of the uploaded image
    """
    try:
        # Check if Cloudinary configuration is set
        if not cloudinary.config().cloud_name:
            # Configure Cloudinary if not already done
            cloudinary.config(
                cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
                api_key=os.getenv("CLOUDINARY_API_KEY"),
                api_secret=os.getenv("CLOUDINARY_API_SECRET"),
                secure=True
            )
            
        
        # Upload the image
        upload_result = cloudinary.uploader.upload(
            image_path,
            folder=folder,
            resource_type="image"
        )
        
        # Return the URL
        return upload_result["secure_url"]
    
    except Exception as e:
        print(f"Error uploading to Cloudinary: {str(e)}")
        raise e


# ✅ Route: Home
@app.get("/")
async def home():
    return {"message": "Welcome to the Change Detection API"}


# ✅ Route: Get Available Regions
@app.get("/available-regions", response_model=List[RegionResponse])
async def get_available_regions():
    regions = list(regions_collection.find())
    
    # Convert ObjectId to string for each document
    for region in regions:
        region["_id"] = str(region["_id"])
    
    return regions


# ✅ Route: Add Available Region
@app.post("/available-regions", status_code=201)
async def add_available_region(region: RegionModel):
    try:
        # Check if region already exists
        existing_region = regions_collection.find_one({"name": region.name})
        if existing_region:
            raise HTTPException(status_code=400, detail="Region with this name already exists")
        
        # Insert new region
        regions_collection.insert_one(region.model_dump())
        return {"message": "Region added successfully"}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Route: Analyze Predefined Region
@app.post("/analysis/predefined_region/{user_id}")
async def analyze_predefined_region(request: PredefinedRegionRequest, user_id: str):
    try:
        # Convert string ID to ObjectId
        print(user_id)
        obj_instance = ObjectId(request.id)
        
        # Find the region
        region = regions_collection.find_one({"_id": obj_instance})
        if not region:
            raise HTTPException(status_code=404, detail="Region not found")
        
        # Convert ObjectId to string for serialization
        region["_id"] = str(region["_id"])

        # Initialize the change detector
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'change_detection.keras')
        
        # Check if model file exists
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail=f"Model file not found at: {model_path}")
            
        detector = HighResolutionChangeDetector(model_path)
        
        # Construct image paths based on region data and request parameters
        before_image_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                        'images', request.folder, f"{request.before_image_year}.jpg")
        after_image_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                       'images', request.folder, f"{request.after_image_year}.jpg")

        # Check if image paths exist
        if not os.path.exists(before_image_path):
            raise HTTPException(status_code=404, detail=f"Before image not found: {before_image_path}")
        
        if not os.path.exists(after_image_path):
            raise HTTPException(status_code=404, detail=f"After image not found: {after_image_path}")
        
        # Detect changes between the images
        print(f"Detecting changes for region: {region['name']}")
        results = detector.detect_changes(
            before_image_path,
            after_image_path,
            window_size=(64, 64),
            stride=32
        )
        
        # Create img directory if it doesn't exist
        img_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
        os.makedirs(img_dir, exist_ok=True)
        
        # Generate visualization
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img', f"{region['folder']}_{timestamp}.jpg")
        # Create img directory if it doesn't exist
        os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img'), exist_ok=True)
        
        vis_path, change_map_path, critical_changes = detector.generate_change_visualization(results, output_path)
        
        print(f"Change detection complete for {region['name']}")
        print(f"Visualization saved to: {vis_path}")
        print(f"Change map saved to: {change_map_path}")


        # Upload visualization to Cloudinary
        cloud_vis_url = upload_to_cloudinary(vis_path)
        cloud_change_map_url = upload_to_cloudinary(change_map_path)
        print("Images uploaded to Cloudinary")

        # Delete local files after upload
        os.remove(vis_path)
        os.remove(change_map_path)
        print("Images removed from server")

        # Create a new analysis history record
        analysis_record = AnalysisHistoryModel(
            user_id= user_id,  # Using user_id 1 as specified
            input_type="predefined_region",
            before_image_year=request.before_image_year,
            after_image_year=request.after_image_year,
            cloud_vis_url=cloud_vis_url,
            cloud_change_map_url=cloud_change_map_url,
            analysis={
                "change_percentages": results['change_percentages'],
                "critical_changes": critical_changes
            }
        )
        
        # Insert the record into MongoDB
        analysis_collection.insert_one(analysis_record.model_dump())

        # Return proper response
        return {
            "message": "Analysis started successfully",
            "analysis": analysis_record
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    

# ✅ Route: Analyze User Uploaded Region
@app.post("/analysis/user_uploaded_region/{user_id}")
async def analyze_user_uploaded_region(
    user_id: str,
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
    before_image_year: int = Form(...),
    after_image_year: int = Form(...)
):
    try:
        # Create temporary directory for uploaded files if it doesn't exist
        temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save uploaded files to temporary location
        before_image_path = os.path.join(temp_dir, f"before_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
        after_image_path = os.path.join(temp_dir, f"after_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
        
        with open(before_image_path, "wb") as f:
            f.write(before_image.file.read())
        
        with open(after_image_path, "wb") as f:
            f.write(after_image.file.read())
        
        # Initialize the change detector
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'change_detection.keras')
        
        # Check if model file exists
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail=f"Model file not found at: {model_path}")
            
        detector = HighResolutionChangeDetector(model_path)
        
        # Detect changes between the images
        print(f"Detecting changes for user uploaded images")
        results = detector.detect_changes(
            before_image_path,
            after_image_path,
            window_size=(64, 64),
            stride=32
        )
        
        # Create img directory if it doesn't exist
        img_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
        os.makedirs(img_dir, exist_ok=True)
        
        # Generate visualization
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(img_dir, f"user_{user_id}_{timestamp}.jpg")
        
        vis_path, change_map_path, critical_changes = detector.generate_change_visualization(results, output_path)
        
        print("Change detection complete for user uploaded images")
        print(f"Visualization saved to: {vis_path}")
        print(f"Change map saved to: {change_map_path}")

        # Upload visualization to Cloudinary
        cloud_vis_url = upload_to_cloudinary(vis_path)
        cloud_change_map_url = upload_to_cloudinary(change_map_path)
        print("Images uploaded to Cloudinary")

        # Create a new analysis history record
        analysis_record = AnalysisHistoryModel(
            user_id=user_id,
            input_type="user_uploaded",
            before_image_year=before_image_year,
            after_image_year=after_image_year,
            cloud_vis_url=cloud_vis_url,
            cloud_change_map_url=cloud_change_map_url,
            analysis={
                "change_percentages": results['change_percentages'],
                "critical_changes": critical_changes
            }
        )
        
        # Insert the record into MongoDB
        analysis_collection.insert_one(analysis_record.model_dump())
        
        # Clean up temporary files
        for file_path in [before_image_path, after_image_path, vis_path, change_map_path]:
            if os.path.exists(file_path):
                os.remove(file_path)
        print("Temporary files cleaned up")
        
        return {
            "message": "Analysis completed successfully",
            "analysis": analysis_collection
        }
    
    except Exception as e:
        # Clean up any temporary files in case of error
        temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp')
        if os.path.exists(temp_dir):
            for filename in os.listdir(temp_dir):
                if filename.startswith(f"before_{user_id}_") or filename.startswith(f"after_{user_id}_"):
                    os.remove(os.path.join(temp_dir, filename))
        
        raise HTTPException(status_code=500, detail=str(e))
    

# ✅ Route: Fetch User Analysis History
@app.get("/history/{user_id}", response_model=List[AnalysisHistoryResponse])
async def get_user_history(user_id: str):
    try:
        # Find all analysis records for the given user_id
        history_records = list(analysis_collection.find({"user_id": user_id}))
        
        # Format the results to match the response model
        formatted_records = []
        for record in history_records:
            record["_id"] = str(record["_id"])
            
            # Create a properly formatted record that matches AnalysisHistoryResponse
            formatted_record = {
                "_id": record["_id"],  # Using _id as alias for id
                "user_id": record["user_id"],
                "input_type": record["input_type"],
                "before_image_year": record["before_image_year"],
                "after_image_year": record["after_image_year"],
                "cloud_vis_url": record["cloud_vis_url"],
                "cloud_change_map_url": record["cloud_change_map_url"],
                "analysis": record["analysis"],
                "created_at": record["created_at"]
            }
            formatted_records.append(formatted_record)
        
        return formatted_records

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

