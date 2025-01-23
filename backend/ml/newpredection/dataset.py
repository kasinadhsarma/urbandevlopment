# dataset.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import logging

logging.basicConfig(level=logging.INFO)

def load_data(file_path):
    """
    Load the dataset from a CSV file.
    """
    try:
        data = pd.read_csv(file_path)
        logging.info("Data loaded successfully.")
        return data
    except Exception as e:
        logging.error(f"Error loading data: {e}")
        raise

def preprocess_data(data, target_column, scale_features=False):
    """
    Preprocess the dataset: handle missing values, encode categorical variables, etc.
    """
    try:
        # Fill missing values
        data.fillna(method='ffill', inplace=True)
        
        # Convert categorical variables to numerical
        data = pd.get_dummies(data, drop_first=True)
        
        # Separate features and target
        X = data.drop(target_column, axis=1)
        y = data[target_column]
        
        # Feature scaling (optional)
        if scale_features:
            scaler = StandardScaler()
            X = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
            logging.info("Features scaled.")
        
        logging.info("Data preprocessing completed.")
        return X, y
    except Exception as e:
        logging.error(f"Error preprocessing data: {e}")
        raise

def split_data(X, y, test_size=0.2, random_state=42):
    """
    Split the dataset into training and testing sets.
    """
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
        logging.info("Data split into training and testing sets.")
        return X_train, X_test, y_train, y_test
    except Exception as e:
        logging.error(f"Error splitting data: {e}")
        raise