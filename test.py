import os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
from data_preprocessing import EuroSATDataProcessor
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

def evaluate_model_accuracy(
    model_path='./models/change_detection.keras',
    test_data_path='./dataset/split/test',
    img_size=(64, 64)
):
    """
    Evaluate the trained model on test data
    
    Args:
        model_path (str): Path to the trained model
        test_data_path (str): Path to test data
        img_size (tuple): Image dimensions
    
    Returns:
        dict: Evaluation metrics
    """
    # Make sure directories exist
    os.makedirs('./evaluation_results', exist_ok=True)
    
    # Load the trained model
    print(f"Loading model from {model_path}...")
    model = load_model(model_path)
    
    # Initialize data processor
    data_processor = EuroSATDataProcessor(dataset_path=None, img_size=img_size)
    
    # Load test data
    print(f"Loading test data from {test_data_path}...")
    X_test, y_test = data_processor.load_and_preprocess_data(test_data_path)
    
    # Evaluate model
    print("Evaluating model on test data...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=1)
    
    # Get predictions
    y_pred = model.predict(X_test)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true_classes = np.argmax(y_test, axis=1)
    
    # Calculate class-wise performance
    class_report = classification_report(
        y_true_classes, 
        y_pred_classes, 
        target_names=data_processor.classes,
        output_dict=True
    )
    
    # Create confusion matrix
    cm = confusion_matrix(y_true_classes, y_pred_classes)
    
    # Plot confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(
        cm, 
        annot=True, 
        fmt='d', 
        cmap='Blues',
        xticklabels=data_processor.classes,
        yticklabels=data_processor.classes
    )
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('./evaluation_results/confusion_matrix.png', dpi=300)
    
    # Plot class-wise metrics
    plt.figure(figsize=(12, 6))
    
    # Extract precision, recall and f1-score for each class
    classes = data_processor.classes
    precision = [class_report[cls]['precision'] for cls in classes]
    recall = [class_report[cls]['recall'] for cls in classes]
    f1_score = [class_report[cls]['f1-score'] for cls in classes]
    
    x = np.arange(len(classes))
    width = 0.25
    
    plt.bar(x - width, precision, width, label='Precision')
    plt.bar(x, recall, width, label='Recall')
    plt.bar(x + width, f1_score, width, label='F1-Score')
    
    plt.xlabel('Classes')
    plt.ylabel('Score')
    plt.title('Class-wise Performance Metrics')
    plt.xticks(x, classes, rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.savefig('./evaluation_results/class_performance.png', dpi=300)
    
    # Analyze examples with highest confidence and lowest confidence
    confidence_scores = np.max(y_pred, axis=1)
    
    # Sort by confidence
    sorted_indices = np.argsort(confidence_scores)
    lowest_conf_indices = sorted_indices[:5]  # 5 lowest confidence predictions
    highest_conf_indices = sorted_indices[-5:]  # 5 highest confidence predictions
    
    # Create a visualization of these examples
    plt.figure(figsize=(15, 8))
    
    # Plot lowest confidence examples
    for i, idx in enumerate(lowest_conf_indices):
        plt.subplot(2, 5, i+1)
        plt.imshow(X_test[idx])
        true_class = classes[y_true_classes[idx]]
        pred_class = classes[y_pred_classes[idx]]
        conf = confidence_scores[idx]
        plt.title(f"True: {true_class}\nPred: {pred_class}\nConf: {conf:.2f}", fontsize=8)
        plt.axis('off')
    
    # Plot highest confidence examples
    for i, idx in enumerate(highest_conf_indices):
        plt.subplot(2, 5, i+6)
        plt.imshow(X_test[idx])
        true_class = classes[y_true_classes[idx]]
        pred_class = classes[y_pred_classes[idx]]
        conf = confidence_scores[idx]
        plt.title(f"True: {true_class}\nPred: {pred_class}\nConf: {conf:.2f}", fontsize=8)
        plt.axis('off')
    
    plt.suptitle('Lowest (top) and Highest (bottom) Confidence Predictions')
    plt.tight_layout()
    plt.savefig('./evaluation_results/confidence_examples.png', dpi=300)
    
    # Save evaluation results to text file
    with open('./evaluation_results/evaluation_summary.txt', 'w') as f:
        f.write(f"Model Evaluation Results\n")
        f.write(f"======================\n\n")
        f.write(f"Test Accuracy: {test_accuracy:.4f}\n")
        f.write(f"Test Loss: {test_loss:.4f}\n\n")
        f.write(f"Classification Report:\n")
        f.write(f"--------------------\n")
        f.write(classification_report(y_true_classes, y_pred_classes, target_names=classes))
        
        # Add class distribution
        f.write(f"\nClass Distribution in Test Set:\n")
        for i, cls in enumerate(classes):
            count = np.sum(y_true_classes == i)
            percentage = count / len(y_true_classes) * 100
            f.write(f"{cls}: {count} ({percentage:.2f}%)\n")
    
    # Print summary
    print(f"\nEvaluation complete!")
    print(f"Test Accuracy: {test_accuracy:.4f}")
    print(f"Test Loss: {test_loss:.4f}")
    print(f"\nDetailed results saved in ./evaluation_results/")
    
    # Return metrics
    return {
        'accuracy': test_accuracy,
        'loss': test_loss,
        'classification_report': class_report,
        'confusion_matrix': cm
    }

def main():
    """
    Main execution function
    """
    # Check if model exists
    model_path = './models/change_detection.keras'
    test_data_path = './dataset/split/test'
    
    if not os.path.exists(model_path):
        print("Model not found. Please run train_model.py first.")
        return
    
    if not os.path.exists(test_data_path):
        print("Test data not found. Please run train_model.py first to split the dataset.")
        return
    
    # Evaluate model accuracy
    metrics = evaluate_model_accuracy(
        model_path=model_path,
        test_data_path=test_data_path
    )
    
    # Calculate per-class accuracy from confusion matrix
    cm = metrics['confusion_matrix']
    per_class_accuracy = np.diag(cm) / np.sum(cm, axis=1)
    
    # Print per-class accuracy
    print("\nPer-class accuracy:")
    data_processor = EuroSATDataProcessor(dataset_path=None)
    for i, cls in enumerate(data_processor.classes):
        print(f"{cls}: {per_class_accuracy[i]:.4f}")

if __name__ == '__main__':
    main()