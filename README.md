# EuroSAT Satellite Image Change Detection

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
├── models/
├── results/
├── change_detection.py
├── data_preprocessing.py
├── model_architecture.py
├── train_model.py
```

## Requirements
- Python 3.8+
- TensorFlow
- Numpy
- Matplotlib
- OpenCV

