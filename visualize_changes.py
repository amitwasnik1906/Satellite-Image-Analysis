import matplotlib.pyplot as plt
import numpy as np
import cv2

def visualize_satellite_changes(image1_path, image2_path, change_results):
    """
    Comprehensive visualization of satellite image changes
    
    Args:
        image1_path (str): Path to first satellite image
        image2_path (str): Path to second satellite image
        change_results (dict): Change detection results
    """
    # Load images
    img1 = cv2.imread(image1_path)
    img2 = cv2.imread(image2_path)
    
    # Convert BGR to RGB
    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
    
    # Create figure with multiple subplots
    plt.figure(figsize=(15, 10))
    
    # Original Images
    plt.subplot(2, 2, 1)
    plt.title(f'Image 1: {change_results["initial_class"]}')
    plt.imshow(img1)
    plt.axis('off')
    
    plt.subplot(2, 2, 2)
    plt.title(f'Image 2: {change_results["final_class"]}')
    plt.imshow(img2)
    plt.axis('off')
    
    # Confidence Bar Plot
    plt.subplot(2, 2, 3)
    plt.title('Initial Image Class Confidence')
    classes = change_results['classes']
    confidences = change_results['initial_confidences']
    plt.bar(classes, confidences)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    plt.subplot(2, 2, 4)
    plt.title('Final Image Class Confidence')
    confidences = change_results['final_confidences']
    plt.bar(classes, confidences)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    # Save visualization
    plt.savefig('./results/change_visualization.png', bbox_inches='tight')
    plt.close()

def main():
    # Example usage
    change_results = {
        'initial_class': 'Forest',
        'final_class': 'Highway',
        'change_detected': True,
        'classes': ['AnnualCrop', 'Forest', 'Highway', 'Industrial', 'Pasture'],
        'initial_confidences': [0.1, 0.7, 0.05, 0.1, 0.05],
        'final_confidences': [0.05, 0.1, 0.7, 0.1, 0.05]
    }
    
    visualize_satellite_changes(
        './dataset/image1.jpg', 
        './dataset/image2.jpg', 
        change_results
    )

if __name__ == '__main__':
    main()