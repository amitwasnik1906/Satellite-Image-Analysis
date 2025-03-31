# Satellite Image Change Detection for Land Transformation

## Project Overview
Detect and analyze land cover changes using the EuroSAT dataset with deep learning.

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/amitwasnik1906/mini-project-2.git
cd mini-project-2
```

### 2. Create Virtual Environment
```bash
python -m venv venv
.\venv\Scripts\activate 
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download EuroSAT Dataset
- Download from: https://github.com/phelber/EuroSAT
- Place dataset in `./dataset/EuroSAT/` -- EuroSAT folder contains all the labeled sample images

### 5. Prepare Dataset, Initialize model and Train the Model
```bash
python train_model.py
```

### 6. Detect Changes
```bash
python change_detection.py
```

## Project Structure
```
eurosat-change-detection/
├── dataset/
│   └── EuroSAT/
│       └── AnnualCrop/
│       └── Forest/
│       └── etc/
├── images/ 
├── models/
├── results/
├── change_detection.py
├── data_preprocessing.py
├── model_architecture.py
├── train_model.py
```

## Images Folder
The `images/` folder contains test images captured at different time frames. These images are used for change detection analysis, allowing the model to identify and highlight changes between temporal satellite imagery. Each pair of images represents the same geographical location captured at different points in time, enabling the detection of land use changes, deforestation, urban development, and other environmental transformations.

## Dataset Folder
The `dataset/` folder contains the EuroSAT dataset, which consists of 27,000 labeled satellite images across 10 classes (AnnualCrop, Forest, HerbaceousVegetation, Highway, Industrial, Pasture, PermanentCrop, Residential, River, SeaLake). These Sentinel-2 satellite images are sized at 64x64 pixels with 13 spectral bands and cover various land use patterns across Europe. This dataset serves as the foundation for training our land cover classification model.

## Models Folder
The `models/` folder stores the trained machine learning models. After running `train_model.py`, the trained CNN model is saved here for later use in change detection. This folder may contain multiple model versions, checkpoints, and model metadata files that track training history and performance metrics.

## Results Folder
The `results/` folder contains the output from the change detection process. When you run `change_detection.py`, the system analyzes pairs of temporal satellite images and generates visualization outputs showing:
- Original before/after images
- Probability heatmaps highlighting areas of change
- Binary change masks
- Overlaid change detection results

These results help in quantifying and visualizing land cover changes between different time periods.


## Requirements
- Python 3.8+
- TensorFlow
- Numpy
- Matplotlib
- OpenCV



