# train.py
import logging
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_absolute_error
import xgboost as xgb
import joblib
from dataset import load_data, preprocess_data, split_data

logging.basicConfig(level=logging.INFO)

def train_model(X_train, y_train):
    """
    Train an XGBoost Regressor model with hyperparameter tuning.
    """
    try:
        # Define the model
        model = xgb.XGBRegressor(random_state=42)

        # Hyperparameter grid
        param_grid = {
            'n_estimators': [50, 100, 200],
            'max_depth': [3, 5, 7],
            'learning_rate': [0.01, 0.1, 0.2],
            'subsample': [0.8, 1.0],
            'colsample_bytree': [0.8, 1.0]
        }

        # Grid search for hyperparameter tuning
        grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=3, scoring='neg_mean_absolute_error', n_jobs=-1)
        grid_search.fit(X_train, y_train)

        # Best model
        best_model = grid_search.best_estimator_
        logging.info(f"Best parameters: {grid_search.best_params_}")
        return best_model
    except Exception as e:
        logging.error(f"Error training model: {e}")
        raise

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the model using Mean Absolute Error (MAE).
    """
    try:
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        logging.info(f"Mean Absolute Error: {mae}")
        return mae
    except Exception as e:
        logging.error(f"Error evaluating model: {e}")
        raise

def save_model(model, file_path):
    """
    Save the trained model to a file.
    """
    try:
        joblib.dump(model, file_path)
        logging.info(f"Model saved to {file_path}")
    except Exception as e:
        logging.error(f"Error saving model: {e}")
        raise

def main():
    try:
        # Step 1: Load and preprocess data
        file_path = 'traffic_data.csv'
        logging.info("Loading data...")
        data = load_data(file_path)
        
        logging.info("Preprocessing data...")
        X, y = preprocess_data(data, target_column='traffic_flow', scale_features=True)
        
        # Step 2: Split data
        logging.info("Splitting data into training and testing sets...")
        X_train, X_test, y_train, y_test = split_data(X, y)
        
        # Step 3: Train the model
        logging.info("Training the model...")
        model = train_model(X_train, y_train)
        
        # Step 4: Evaluate the model
        logging.info("Evaluating the model...")
        mae = evaluate_model(model, X_test, y_test)
        
        # Step 5: Save the model
        logging.info("Saving the model...")
        save_model(model, 'traffic_prediction_model.pkl')
        
        logging.info("Training pipeline completed successfully.")
    except Exception as e:
        logging.error(f"Error in training pipeline: {e}")

if __name__ == "__main__":
    main()