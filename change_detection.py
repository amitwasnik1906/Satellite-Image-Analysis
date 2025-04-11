import numpy as np
import cv2
import matplotlib.pyplot as plt
import tensorflow as tf
import os
from tensorflow.keras.preprocessing.image import img_to_array
from matplotlib.colors import LinearSegmentedColormap
import gc
import datetime 

class HighResolutionChangeDetector:
    def __init__(self, model_path):
        """
        Initialize Change Detector
        
        Args:
            model_path (str): Path to trained model
        """
        self.model = tf.keras.models.load_model(model_path)
        self.classes = [
            'AnnualCrop', 'Forest', 'HerbaceousVegetation', 
            'Industrial', 'Pasture', 'PermanentCrop', 
            'Residential', 'SeaLake'
        ]
        # Define class colors for visualization (RGB format)
        self.class_colors = {
            'AnnualCrop': [255, 255, 0],       # Yellow
            'Forest': [0, 128, 0],             # Green
            'HerbaceousVegetation': [144, 238, 144],  # Light Green
            'Industrial': [255, 0, 0],         # Red
            'Pasture': [173, 216, 230],        # Light Blue
            'PermanentCrop': [255, 165, 0],    # Orange
            'Residential': [255, 0, 255],      # Magenta
            'SeaLake': [0, 191, 255]           # Deep Sky Blue
        }

    def _sliding_window(self, image, window_size, stride):
        """
        Generate sliding windows from an image
        
        Args:
            image (numpy.ndarray): Input image
            window_size (tuple): Size of sliding window (width, height)
            stride (int): Step size for sliding window
            
        Yields:
            tuple: (x, y, window)
        """
        for y in range(0, image.shape[0] - window_size[1] + 1, stride):
            for x in range(0, image.shape[1] - window_size[0] + 1, stride):
                yield (x, y, image[y:y + window_size[1], x:x + window_size[0]])

    def preprocess_large_image(self, image_path, window_size=(64, 64), stride=32):
        """
        Preprocess large image using sliding window approach
        
        Args:
            image_path (str): Path to large image
            window_size (tuple): Size of sliding window
            stride (int): Step size for sliding window
            
        Returns:
            tuple: (windows, positions, original_image, image_shape)
        """
        # Load image
        original_image = cv2.imread(image_path)
        original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
        image_shape = original_image.shape
        
        # Generate windows
        windows = []
        positions = []
        
        for x, y, window in self._sliding_window(original_image, window_size, stride):
            # Preprocess window
            processed_window = cv2.resize(window, window_size)
            processed_window = processed_window / 255.0
            
            windows.append(processed_window)
            positions.append((x, y))
        
        return np.array(windows), positions, original_image, image_shape

    def predict_large_image(self, image_path, window_size=(64, 64), stride=32):
        """
        Predict classes for a large image using sliding window
        
        Args:
            image_path (str): Path to large image
            window_size (tuple): Size of sliding window
            stride (int): Step size for sliding window
            
        Returns:
            tuple: (class_map, confidence_map, original_image, image_shape)
        """
        # Preprocess image
        windows, positions, original_image, image_shape = self.preprocess_large_image(
            image_path, window_size, stride
        )
        
        # Predict in batches to avoid memory issues
        batch_size = 128
        predictions = []
        
        for i in range(0, len(windows), batch_size):
            batch = windows[i:i+batch_size]
            batch_preds = self.model.predict(np.array(batch), verbose=0)
            predictions.extend(batch_preds)
            
            # Clean up to free memory
            del batch
            gc.collect()
        
        # Create class and confidence maps
        class_map = np.zeros((image_shape[0], image_shape[1]), dtype=np.uint8)
        confidence_map = np.zeros((image_shape[0], image_shape[1]), dtype=np.float32)
        
        for (x, y), pred in zip(positions, predictions):
            class_idx = np.argmax(pred)
            confidence = pred[class_idx]
            
            # Fill the corresponding region in the maps
            end_y = min(y + window_size[1], image_shape[0])
            end_x = min(x + window_size[0], image_shape[1])
            
            # Only update if the new confidence is higher
            region_confidence = confidence_map[y:end_y, x:end_x]
            update_mask = (region_confidence < confidence) | (region_confidence == 0)
            
            # Apply updates only where needed
            confidence_map[y:end_y, x:end_x][update_mask] = confidence
            class_map[y:end_y, x:end_x][update_mask] = class_idx
        
        # Free memory
        del windows, predictions
        gc.collect()
        
        return class_map, confidence_map, original_image, image_shape

    def detect_changes(self, image1_path, image2_path, window_size=(64, 64), stride=32):
        """
        Detect changes between two large satellite images
        
        Args:
            image1_path (str): Path to first image
            image2_path (str): Path to second image
            window_size (tuple): Size of sliding window
            stride (int): Step size for sliding window
            
        Returns:
            dict: Change detection results
        """
        print("Processing first image...")
        class_map1, confidence_map1, image1, shape1 = self.predict_large_image(
            image1_path, window_size, stride
        )
        
        print("Processing second image...")
        class_map2, confidence_map2, image2, shape2 = self.predict_large_image(
            image2_path, window_size, stride
        )
        
        # Make sure images have the same shape
        if shape1 != shape2:
            # Resize second image to match first
            image2 = cv2.resize(image2, (shape1[1], shape1[0]))
            class_map2 = cv2.resize(class_map2, (shape1[1], shape1[0]), interpolation=cv2.INTER_NEAREST)
            confidence_map2 = cv2.resize(confidence_map2, (shape1[1], shape1[0]), interpolation=cv2.INTER_LINEAR)
        
        # Create change map
        change_map = (class_map1 != class_map2).astype(np.uint8) * 255
        
        # Use morphological operations to clean up the change map
        kernel = np.ones((5, 5), np.uint8)
        change_map = cv2.morphologyEx(change_map, cv2.MORPH_OPEN, kernel)
        change_map = cv2.morphologyEx(change_map, cv2.MORPH_CLOSE, kernel)
        
        # Calculate class distribution in both images
        class_distribution1 = [np.sum(class_map1 == i) / class_map1.size for i in range(len(self.classes))]
        class_distribution2 = [np.sum(class_map2 == i) / class_map2.size for i in range(len(self.classes))]
        
        # Calculate change percentages
        change_percentages = []
        for i in range(len(self.classes)):
            change = class_distribution2[i] - class_distribution1[i]
            change_percentages.append({
                "class": self.classes[i],
                "change": change * 100,  # Convert to percentage
                "initial": class_distribution1[i] * 100,
                "final": class_distribution2[i] * 100
            })
        
        return {
            'image1': image1,
            'image2': image2,
            'class_map1': class_map1,
            'class_map2': class_map2,
            'confidence_map1': confidence_map1,
            'confidence_map2': confidence_map2,
            'change_map': change_map,
            'class_distribution1': class_distribution1,
            'class_distribution2': class_distribution2,
            'change_percentages': change_percentages
        }

    def generate_change_visualization(self, results, output_path):
        # Create color-coded class maps
        class_map1_rgb = np.zeros((results['class_map1'].shape[0], results['class_map1'].shape[1], 3), dtype=np.uint8)
        class_map2_rgb = np.zeros((results['class_map2'].shape[0], results['class_map2'].shape[1], 3), dtype=np.uint8)
        
        for i, class_name in enumerate(self.classes):
            class_map1_rgb[results['class_map1'] == i] = self.class_colors[class_name]
            class_map2_rgb[results['class_map2'] == i] = self.class_colors[class_name]
        
        # Create change highlight overlay (using red for all changes)
        change_overlay = np.zeros_like(results['image2'])
        change_overlay[results['change_map'] > 0] = [255, 0, 0]  # Red for changes
        
        # Combine with second image
        alpha = 0.5
        change_highlighted = cv2.addWeighted(results['image2'], 1, change_overlay, alpha, 0)
        
        # Generate visualization
        plt.figure(figsize=(20, 15))
        
        # Original images
        plt.subplot(2, 2, 1)
        plt.title('Initial Image', fontsize=12)
        plt.imshow(results['image1'])
        plt.axis('off')
        
        plt.subplot(2, 2, 2)
        plt.title('Recent Image', fontsize=12)
        plt.imshow(results['image2'])
        plt.axis('off')
        
        # Classification results
        plt.subplot(2, 2, 3)
        plt.title('Land Use Classification - Initial', fontsize=12)
        plt.imshow(class_map1_rgb)
        plt.axis('off')
        
        # Create a legend for classes
        legend_elements = []
        for class_name, color in self.class_colors.items():
            color_normalized = [c/255 for c in color]
            legend_elements.append(plt.Line2D([0], [0], marker='s', color='w', 
                                markerfacecolor=color_normalized, markersize=10, label=class_name))
        
        plt.legend(handles=legend_elements, loc='lower right', fontsize=8)
        
        # Change detection results
        plt.subplot(2, 2, 4)
        plt.title('Land Use Changes with Percentages', fontsize=12)
        plt.imshow(change_highlighted)
        plt.axis('off')
        
        # Add change percentages in small text in the right corner
        ax = plt.gca()
        text_box = ""
        for change_data in sorted(results['change_percentages'], key=lambda x: x['class']):
            sign = "+" if change_data['change'] > 0 else ""
            text_box += f"{change_data['class']}: {sign}{change_data['change']:.1f}%\n"
        
        # Place text box in the right corner
        props = dict(boxstyle='round', facecolor='white', alpha=0.7)
        ax.text(0.95, 0.05, text_box, transform=ax.transAxes, fontsize=8,
                verticalalignment='bottom', horizontalalignment='right',
                bbox=props)
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()

        # Create a specialized visualization highlighting deforestation, urbanization, and water body changes
        plt.figure(figsize=(15, 10))
        
        # Create a new axis for the image
        ax = plt.gca()
        plt.title('Critical Environmental Changes', fontsize=16)
        
        # Create a mask for each critical change type
        deforestation_mask = np.zeros_like(results['change_map'], dtype=bool)
        urbanization_mask = np.zeros_like(results['change_map'], dtype=bool)
        water_change_mask = np.zeros_like(results['change_map'], dtype=bool)
        
        # Identify the class indices for forest, urban, and water classes
        forest_indices = [i for i, class_name in enumerate(self.classes) if 'forest' in class_name.lower()]
        urban_indices = [i for i, class_name in enumerate(self.classes) if 'urban' in class_name.lower() or 'residential' in class_name.lower() or 'industrial' in class_name.lower()]
        water_indices = [i for i, class_name in enumerate(self.classes) if 'water' in class_name.lower() or 'river' in class_name.lower() or 'lake' in class_name.lower()]
        
        # Detect deforestation (forest to non-forest)
        for i in forest_indices:
            for j in range(len(self.classes)):
                if i != j and j not in forest_indices:
                    deforestation_mask |= (results['class_map1'] == i) & (results['class_map2'] == j)
        
        # Detect urbanization (non-urban to urban)
        for i in range(len(self.classes)):
            for j in urban_indices:
                if i != j and i not in urban_indices:
                    urbanization_mask |= (results['class_map1'] == i) & (results['class_map2'] == j)
        
        # Detect water body changes (water to non-water or non-water to water)
        for i in range(len(self.classes)):
            for j in range(len(self.classes)):
                if (i in water_indices and j not in water_indices) or (i not in water_indices and j in water_indices):
                    water_change_mask |= (results['class_map1'] == i) & (results['class_map2'] == j)
        
        # Create a combined RGB image to highlight different change types
        critical_changes = np.zeros((*results['change_map'].shape, 3), dtype=np.uint8)
        critical_changes[deforestation_mask] = [255, 150, 150]  # Lighter red for deforestation
        critical_changes[urbanization_mask] = [200, 150, 255]  # Light purple for urbanization
        critical_changes[water_change_mask] = [150, 150, 255]  # Lighter blue for water changes
        
        # Overlay on the second image with transparency
        alpha = 0.5  # Reduced alpha for lighter overlay
        overlay = results['image2'].copy()
        mask = deforestation_mask | urbanization_mask | water_change_mask
        overlay[mask] = cv2.addWeighted(results['image2'][mask], 1-alpha, critical_changes[mask], alpha, 0)
        
        # Display the image
        plt.imshow(overlay)
        plt.axis('off')
        
        # Create legend
        legend_elements = [
            plt.Line2D([0], [0], marker='s', color='w', markerfacecolor=(1, 0.59, 0.59), markersize=10, label='Deforestation'),
            plt.Line2D([0], [0], marker='s', color='w', markerfacecolor=(0.78, 0.59, 1), markersize=10, label='Urbanization'),
            plt.Line2D([0], [0], marker='s', color='w', markerfacecolor=(0.59, 0.59, 1), markersize=10, label='Water Body Changes')
        ]
        plt.legend(handles=legend_elements, loc='lower right', fontsize=10)
        
        # Add statistics in a text box
        stats_text = (
            f"Deforestation: {np.sum(deforestation_mask) / deforestation_mask.size * 100:.2f}%\n"
            f"Urbanization: {np.sum(urbanization_mask) / urbanization_mask.size * 100:.2f}%\n"
            f"Water Changes: {np.sum(water_change_mask) / water_change_mask.size * 100:.2f}%"
        )
        
        props = dict(boxstyle='round', facecolor='white', alpha=0.7)
        ax.text(0.05, 0.05, stats_text, transform=ax.transAxes, fontsize=10,
                verticalalignment='bottom', horizontalalignment='left',
                bbox=props)
        
        # Save the critical changes map
        critical_map_path = os.path.splitext(output_path)[0] + "_critical_changes.jpg"
        plt.savefig(critical_map_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        # Calculate critical change percentages
        deforestation_percent = np.sum(deforestation_mask) / deforestation_mask.size * 100
        urbanization_percent = np.sum(urbanization_mask) / urbanization_mask.size * 100
        water_change_percent = np.sum(water_change_mask) / water_change_mask.size * 100
        
        # Add critical changes to the results
        critical_changes = {
            "deforestation": deforestation_percent,
            "urbanization": urbanization_percent,
            "water_changes": water_change_percent
        }
        
        return output_path, critical_map_path, critical_changes

def main():
    """
    Main execution function
    """
    # Make sure directories exist
    os.makedirs('./models', exist_ok=True)
    os.makedirs('./results', exist_ok=True)
    
    # Check if model exists, if not, train it
    model_path = './models/change_detection.keras'
    if not os.path.exists(model_path):
        print("Model not found. Please run train_model.py first.")
        return
    
    # Initialize detector
    detector = HighResolutionChangeDetector(model_path)
    
    # Get input paths
    image1_path = './images/sangli/2014.jpg'
    image2_path = './images/sangli/2024.jpg'
    
    # Detect changes
    print("Detecting changes between images...")
    results = detector.detect_changes(
        image1_path, 
        image2_path,
        window_size=(64, 64),
        stride=32
    )
    
    # Generate visualization
    print("Generating change visualization...")
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f'./results/change_detection_result_{timestamp}.jpg'
    
    vis_path, change_map_path, critical_changes = detector.generate_change_visualization(results, output_path)
    
    print(f"Change detection complete!")
    print(f"Full visualization saved to: {vis_path}")
    print(f"Change map saved to: {change_map_path}")
    
    # Summary of changes
    print("\nSummary of changes:")
    for change in results['change_percentages']:
        sign = "+" if change['change'] > 0 else ""
        print(f"- {change['class']}: {sign}{change['change']:.1f}% (from {change['initial']:.1f}% to {change['final']:.1f}%)")
    
    # Summary of critical changes
    print("\nCritical changes detected:")
    print(f"- Deforestation: {critical_changes['deforestation']:.2f}%")
    print(f"- Urbanization: {critical_changes['urbanization']:.2f}%")
    print(f"- Water changes: {critical_changes['water_changes']:.2f}%")

if __name__ == '__main__':
    main()