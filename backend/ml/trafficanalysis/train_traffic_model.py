import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib
from create_traffic_dataset import create_synthetic_traffic_data

def train_model():
    """Train the traffic congestion prediction model"""
    # First generate synthetic data if it doesn't exist
    data_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')
    if not os.path.exists(data_path):
        print("Generating synthetic traffic data...")
        df = create_synthetic_traffic_data()
        df.to_csv(data_path, index=False)
    else:
        print("Loading existing traffic data...")
        df = pd.read_csv(data_path)

    print("Data shape:", df.shape)
    
    # Prepare features and target
    X = df[['time_of_day', 'day_of_week', 'vehicle_count', 'weather_condition', 'road_type']]
    y = df['congestion_level']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    print(f"Train R² score: {train_score:.4f}")
    print(f"Test R² score: {test_score:.4f}")
    
    # Feature importance
    feature_importance = dict(zip(X.columns, model.feature_importances_))
    print("\nFeature Importance:")
    for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
        print(f"{feature}: {importance:.4f}")
    
    # Save model and scaler
    model_path = os.path.join(os.path.dirname(__file__), 'traffic_congestion_model.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"\nModel saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")

if __name__ == "__main__":
    train_model()
