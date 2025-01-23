# prediction.py
import logging
import pandas as pd
import joblib

logging.basicConfig(level=logging.INFO)

def load_model(file_path):
    """
    Load a trained model from a file.
    """
    try:
        model = joblib.load(file_path)
        logging.info("Model loaded successfully.")
        return model
    except Exception as e:
        logging.error(f"Error loading model: {e}")
        raise

def predict_traffic(model, input_data):
    """
    Predict traffic flow using the trained model.
    """
    try:
        # Ensure input data has the same columns as the training data
        missing_cols = set(model.feature_names_in_) - set(input_data.columns)
        for col in missing_cols:
            input_data[col] = 0
        input_data = input_data[model.feature_names_in_]
        
        # Make prediction
        prediction = model.predict(input_data)
        logging.info(f"Prediction: {prediction[0]}")
        return prediction[0]
    except Exception as e:
        logging.error(f"Error making prediction: {e}")
        raise

def main():
    try:
        # Step 1: Load the model
        logging.info("Loading the model...")
        model = load_model('traffic_prediction_model.pkl')
        
        # Step 2: Prepare input data for prediction
        logging.info("Preparing input data...")
        example_data = pd.DataFrame({
            'hour': [8],
            'day_of_week': [1],
            'weather_condition_rain': [0],
            'weather_condition_snow': [0]
        })
        
        # Step 3: Make prediction
        logging.info("Making prediction...")
        predicted_traffic = predict_traffic(model, example_data)
        logging.info(f"Predicted Traffic Flow: {predicted_traffic}")
    except Exception as e:
        logging.error(f"Error in prediction pipeline: {e}")

if __name__ == "__main__":
    main()