from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from bson.objectid import ObjectId
import sys
import os

# Add the parent directory to sys.path so Python can find the module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now you can import from change_detection
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

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017")
db = client["land_analysis"]
analysis_collection = db["analysis_history"]
regions_collection = db["available_regions"]

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
    output_image: str
    analysis: dict
    created_at: str

# API Endpoints Request
class PredefinedRegionRequest(BaseModel):
    id: str = Field(alias="_id")  # This allows accepting _id in JSON but using id in code
    folder: str
    before_image_year: int
    after_image_year: int
    
    class Config:
        populate_by_name = True  # Allows both _id and id to be used
        allow_population_by_field_name = True  # For backward compatibility

# API Endpoints Response
class AnalysisHistoryResponse(BaseModel):
    user_id: str
    input_type: str
    before_image_year: int
    after_image_year: int
    output_image: str
    analysis: dict
    created_at: str

class RegionResponse(BaseModel):
    id: str = Field(alias="_id")  # Changed type to str and use alias
    name: str
    folder: str
    sample_url: str
    
    class Config:
        allow_population_by_field_name = True  # Allows both _id and id to be used


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
        regions_collection.insert_one(region.dict())
        return {"message": "Region added successfully"}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Route: Analyze Predefined Region
@app.post("/analysis/predefined_region")
async def analyze_predefined_region(request: PredefinedRegionRequest):
    try:
        # Convert string ID to ObjectId
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
        
        # Create results directory if it doesn't exist
        results_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'results')
        os.makedirs(results_dir, exist_ok=True)
        
        # Generate visualization
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img', f"{region['folder']}_{timestamp}.jpg")
        # Create img directory if it doesn't exist
        os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img'), exist_ok=True)
        
        vis_path, change_map_path = detector.generate_change_visualization(results, output_path)
        
        print(f"Change detection complete for {region['name']}")
        print(f"Visualization saved to: {vis_path}")
        print(f"Change map saved to: {change_map_path}")

        # Add Cloudinary here & delete the image from the server
        
        # Add results to the response
        region["results"] = {
            "visualization_path": vis_path,
            "change_map_path": change_map_path,
            "change_percentages": results['change_percentages']
        }
        
        # Return proper response
        return {
            "message": "Analysis started successfully",
            "region": region
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    

# ✅ Route: Analyze User Uploaded Region
# @app.post("/analysis/user_uploaded_region")
# async def analyze_user_uploaded_region():
    

# ✅ Route: Fetch User Analysis History
@app.get("/history/{user_id}", response_model=List[AnalysisHistoryResponse])
async def get_user_history(user_id: str):
    try:
        return user_id

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

