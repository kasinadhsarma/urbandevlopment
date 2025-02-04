import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class TrafficAnalyzer:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()  # Initialize scaler
        self.model_path = os.path.join(os.path.dirname(__file__), 'traffic_congestion_model.pkl')
        self.scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
        self.load_model()

    def load_model(self):
        """Load the trained model and scaler if they exist"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                print(f"Loading model from {self.model_path}")  # Debug print
                self.model = joblib.load(self.model_path)
                print(f"Loading scaler from {self.scaler_path}")  # Debug print
                self.scaler = joblib.load(self.scaler_path)
            else:
                print("Model or scaler file not found. Using new StandardScaler.")  # Debug print
        except Exception as e:
            print(f"Error loading model or scaler: {str(e)}")  # Debug print

    def train(self, data_path):
        """Train the traffic analysis model"""
        # Load and preprocess data
        df = pd.read_csv(data_path)

        # Assuming columns: time_of_day, day_of_week, vehicle_count, weather_condition, road_type
        X = df[['time_of_day', 'day_of_week', 'vehicle_count', 'weather_condition', 'road_type']]
        y = df['congestion_level']

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)

        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)

        # Save model
        joblib.dump(self.model, self.model_path)

        # Test accuracy
        X_test_scaled = self.scaler.transform(X_test)
        score = self.model.score(X_test_scaled, y_test)
        return score

    def predict_congestion(self, features):
        """
        Predict traffic congestion level
        features: dict containing time_of_day, day_of_week, vehicle_count, weather_condition, road_type
        """
        if self.model is None:
            raise Exception("Model not trained or loaded")

        # Convert features to DataFrame
        df = pd.DataFrame([features])

        # Scale features
        scaled_features = self.scaler.transform(df)

        # Predict
        prediction = self.model.predict(scaled_features)[0]

        # Get feature importance
        feature_importance = dict(zip(df.columns, self.model.feature_importances_))

        return {
            'congestion_level': float(prediction),
            'feature_importance': feature_importance,
            'congestion_category': self._get_congestion_category(prediction),
            'hourly_distribution': self.get_hourly_distribution()
        }

    def _get_congestion_category(self, prediction):
        """Convert numerical prediction to category"""
        if prediction < 0.3:
            return "Low"
        elif prediction < 0.6:
            return "Moderate"
        else:
            return "High"

    def analyze_trends(self, data_path=None):
        """Analyze traffic patterns and trends"""
        if data_path is None:
            data_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')

    def get_hourly_distribution(self):
        """Get hourly traffic distribution"""
        data_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Traffic data file not found at: {data_path}")

        df = pd.read_csv(data_path)
        hourly_data = df.groupby('time_of_day')['vehicle_count'].mean().to_dict()
        return hourly_data

    def get_historical_accuracy(self):
        """Get historical accuracy of traffic predictions"""
        data_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Traffic data file not found at: {data_path}")

        df = pd.read_csv(data_path)

        # Create timestamp from time_of_day and day_of_week
        days = {1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun'}
        df['timestamp'] = df.apply(lambda row: f"{days[int(row['day_of_week'])]} {int(row['time_of_day']):02d}:00", axis=1)

        # Calculate baseline prediction (mean congestion level per timestamp)
        historical_means = df.groupby('timestamp')['congestion_level'].mean()

        # Calculate accuracy per timestamp
        accuracy_data = {}
        for timestamp in historical_means.index:
            group_data = df[df['timestamp'] == timestamp]
            true_values = group_data['congestion_level']
            predicted_value = historical_means[timestamp]

            # Calculate accuracy as 1 - MAE (normalized)
            mae = np.mean(np.abs(true_values - predicted_value))
            accuracy = 1 - min(mae, 1)  # Ensure accuracy is between 0 and 1
            accuracy_data[timestamp] = float(accuracy)  # Ensure JSON serializable

        return accuracy_data
