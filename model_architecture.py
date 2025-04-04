import tensorflow as tf
from tensorflow.keras import layers, models, optimizers

class EuroSATChangeDetectionModel:
    def __init__(self, input_shape=(64, 64, 3), num_classes=8):
        """
        Initialize Change Detection Model
        
        Args:
            input_shape (tuple): Input image dimensions
            num_classes (int): Number of land cover classes (updated to 8)
        """
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = self.build_model()

    def build_model(self):
        """
        Build Convolutional Neural Network for Change Detection
        
        Returns:
            tf.keras.Model: Compiled neural network
        """
        model = models.Sequential([
            # First Convolutional Block
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=self.input_shape),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),

            # Second Convolutional Block
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),

            # Third Convolutional Block
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),

            # Flatten and Dense Layers
            layers.Flatten(),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),

            # Output Layer
            layers.Dense(self.num_classes, activation='softmax')
        ])

        # Compile Model
        model.compile(
            optimizer=optimizers.Adam(learning_rate=1e-4),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        return model

    def train(self, train_generator, validation_generator, epochs=50):
        """
        Train the change detection model
        
        Args:
            train_generator (ImageDataGenerator): Training data generator
            validation_generator (ImageDataGenerator): Validation data generator
            epochs (int): Number of training epochs
        
        Returns:
            History of model training
        """
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss', 
            patience=25, 
            restore_best_weights=True
        )

        reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', 
            factor=0.2, 
            patience=5
        )

        history = self.model.fit(
            train_generator,
            validation_data=validation_generator,
            epochs=epochs,
            callbacks=[early_stopping, reduce_lr]
        )

        return history

    def save_model(self, filepath='./models/change_detection.keras'):
        """
        Save trained model weights
        
        Args:
            filepath (str): Path to save model
        """
        self.model.save(filepath)

    def load_model(self, filepath='./models/change_detection.keras'):
        """
        Load pre-trained model weights
        
        Args:
            filepath (str): Path to load model
        """
        self.model = tf.keras.models.load_model(filepath)