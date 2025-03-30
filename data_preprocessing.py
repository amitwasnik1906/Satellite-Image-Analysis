import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Add this before importing tensorflow
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical
import splitfolders
import cv2

class EuroSATDataProcessor:
    def __init__(self, dataset_path, img_size=(64, 64), test_split=0.2):
        """
        Initialize EuroSAT dataset processor
        
        Args:
            dataset_path (str): Path to EuroSAT dataset
            img_size (tuple): Resize image dimensions
            test_split (float): Percentage of data for testing
        """
        self.dataset_path = dataset_path
        self.img_size = img_size
        self.test_split = test_split
        self.classes = [
            'AnnualCrop', 'Forest', 'HerbaceousVegetation', 
            'Industrial', 'Pasture', 'PermanentCrop', 
            'Residential', 'SeaLake'
        ]

    def split_dataset(self, output_path='./dataset/split'):
        """
        Split dataset into train, validation, and test sets
        """
        splitfolders.ratio(
            self.dataset_path, 
            output=output_path, 
            seed=42, 
            ratio=(0.7, 0.2, 0.1)
        )

    def load_and_preprocess_data(self, data_path):
        """
        Load and preprocess satellite images
        
        Returns:
            tuple: (images, labels)
        """
        images = []
        labels = []

        for class_idx, class_name in enumerate(self.classes):
            class_path = os.path.join(data_path, class_name)
            
            for img_name in os.listdir(class_path):
                img_path = os.path.join(class_path, img_name)
                
                # Read image
                img = cv2.imread(img_path)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                
                # Resize and normalize
                img = cv2.resize(img, self.img_size)
                img = img / 255.0  # Normalize to [0,1]
                
                images.append(img)
                labels.append(class_idx)

        return (
            np.array(images), 
            to_categorical(np.array(labels), num_classes=len(self.classes))
        )

    def create_data_generators(self, train_path, val_path):
        """
        Create data generators with augmentation
        
        Returns:
            tuple: (train_generator, validation_generator)
        """
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True
        )

        validation_datagen = ImageDataGenerator(rescale=1./255)

        train_generator = train_datagen.flow_from_directory(
            train_path,
            target_size=self.img_size,
            batch_size=32,
            class_mode='categorical'
        )

        validation_generator = validation_datagen.flow_from_directory(
            val_path,
            target_size=self.img_size,
            batch_size=32,
            class_mode='categorical'
        )

        return train_generator, validation_generator