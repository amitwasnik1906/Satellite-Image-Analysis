import numpy as np
import cv2
import matplotlib.pyplot as plt
import tensorflow as tf

class ChangeDetector:
    def __init__(self, model_path):
        """
        Initialize Change Detector
        
        Args:
            model_path (str): Path to trained model
        """
        self.model = tf.keras.models.load_model(model_path)
        self.classes = [
            'AnnualCrop', 'Forest', 'HerbaceousVegetation', 
            'Highway', 'Industrial', 'Pasture', 
            'PermanentCrop', 'Residential', 'River', 'SeaLake'
        ]

    def preprocess_image(self, image_path, target_size=(64, 64)):
        """
        Preprocess single image for prediction
        
        Args:
            image_path (str): Path to image
            target_size (tuple): Resize dimensions
        
        Returns:
            numpy.ndarray: Preprocessed image
        """
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, target_size)
        img = img / 255.0
        return np.expand_dims(img, axis=0)

    def detect_changes(self, image1_path, image2_path):
        """
        Detect changes between two satellite images
        
        Args:
            image1_path (str): Path to first image
            image2_path (str): Path to second image
        
        Returns:
            dict: Change detection results
        """
        # Preprocess images
        img1 = self.preprocess_image(image1_path)
        img2 = self.preprocess_image(image2_path)

        # Predict classes
        pred1 = self.model.predict(img1)
        pred2 = self.model.predict(img2)

        # Get top predictions
        class1 = self.classes[np.argmax(pred1)]
        class2 = self.classes[np.argmax(pred2)]

        # Change detection
        change_detected = class1 != class2

        return {
            'initial_class': class1,
            'final_class': class2,
            'change_detected': change_detected,
            'initial_confidences': pred1[0],
            'final_confidences': pred2[0]
        }

    def visualize_changes(self, image1_path, image2_path, results):
        """
        Visualize changes between images
        
        Args:
            image1_path (str): Path to first image
            image2_path (str): Path to second image
            results (dict): Change detection results
        """
        plt.figure(figsize=(15, 5))

        # Original Images
        plt.subplot(131)
        img1 = cv2.imread(image1_path)
        img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
        plt.title(f'Image 1: {results["initial_class"]}')
        plt.imshow(img1)

        plt.subplot(132)
        img2 = cv2.imread(image2_path)
        img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
        plt.title(f'Image 2: {results["final_class"]}')
        plt.imshow(img2)

        # Change Detection Plot
        plt.subplot(133)
        plt.title('Change Detection Confidence')
        classes = self.classes
        confidences1 = results['initial_confidences']
        confidences2 = results['final_confidences']
        
        plt.bar(classes, confidences1, alpha=0.5, label='Image 1')
        plt.bar(classes, confidences2, alpha=0.5, label='Image 2')
        plt.xticks(rotation=45, ha='right')
        plt.legend()

        plt.tight_layout()
        plt.show()

# Main Execution Script
def main():
    # Paths to your images
    image1_path = './dataset/wce/2013.jpg'
    image2_path = './dataset/wce/2025.jpg'

    # Initialize Change Detector
    detector = ChangeDetector('./models/eurosat_change_detection.h5')

    # Detect Changes
    results = detector.detect_changes(image1_path, image2_path)
    print("Change Detection Results:", results)

    # Visualize Changes
    detector.visualize_changes(image1_path, image2_path, results)

if __name__ == '__main__':
    main()