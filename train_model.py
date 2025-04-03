import os
import tensorflow as tf
from data_preprocessing import EuroSATDataProcessor
from model_architecture import EuroSATChangeDetectionModel
import matplotlib.pyplot as plt

def train_eurosat_model(dataset_path='./dataset/EuroSAT', 
                        split_path='./dataset/split', 
                        model_save_path='./models/change_detection.keras'):
    """
    Complete training pipeline for EuroSAT change detection model
    
    Args:
        dataset_path (str): Path to original dataset
        split_path (str): Path to split dataset
        model_save_path (str): Path to save trained model
    """
    # Initialize data processor
    data_processor = EuroSATDataProcessor(dataset_path)
    
    # Split dataset
    data_processor.split_dataset(split_path)
    
    # Create data generators
    train_generator, validation_generator = data_processor.create_data_generators(
        os.path.join(split_path, 'train'), 
        os.path.join(split_path, 'val')
    )
    
    # Initialize model with 8 classes instead of 10
    change_detection_model = EuroSATChangeDetectionModel(num_classes=8)
    
    # Train model
    history = change_detection_model.train(
        train_generator, 
        validation_generator, 
        epochs=50
    )
    
    # Save model
    change_detection_model.save_model(model_save_path)
    
    # Plot training history
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.title('Training Accuracy')
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.title('Training Loss')
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('./results/training_history.png')
    plt.close()

if __name__ == '__main__':
    train_eurosat_model()