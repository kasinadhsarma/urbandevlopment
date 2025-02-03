import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import matplotlib.pyplot as plt
import seaborn as sns

def create_synthetic_traffic_data(num_samples=1000):
    """Create synthetic traffic data for model training"""
    np.random.seed(42)
    
    # Generate features
    time_of_day = np.random.randint(0, 24, num_samples)  # Hours 0-23
    day_of_week = np.random.randint(1, 8, num_samples)   # Days 1-7
    vehicle_count = np.random.normal(loc=300, scale=100, size=num_samples).astype(int)
    vehicle_count = np.clip(vehicle_count, 0, 1000)
    
    weather_condition = np.random.randint(1, 5, num_samples)  # 1:Clear, 2:Rain, 3:Snow, 4:Fog
    road_type = np.random.randint(1, 5, num_samples)         # 1:Highway, 2:Main Street, 3:Residential, 4:Downtown
    
    # Create base congestion level
    congestion_level = np.zeros(num_samples)
    
    # Time-based patterns
    peak_hours = (time_of_day >= 7) & (time_of_day <= 9) | (time_of_day >= 16) & (time_of_day <= 18)
    congestion_level += 0.3 * peak_hours
    
    # Day of week patterns (weekdays vs weekends)
    weekdays = (day_of_week >= 1) & (day_of_week <= 5)
    congestion_level += 0.2 * weekdays
    
    # Vehicle count impact
    congestion_level += 0.3 * (vehicle_count / 1000)
    
    # Weather impact
    weather_impact = {
        1: 0,      # Clear
        2: 0.15,   # Rain
        3: 0.3,    # Snow
        4: 0.2     # Fog
    }
    for weather, impact in weather_impact.items():
        congestion_level += impact * (weather_condition == weather)
    
    # Road type impact
    road_impact = {
        1: 0.1,    # Highway
        2: 0.2,    # Main Street
        3: 0.15,   # Residential
        4: 0.25    # Downtown
    }
    for road, impact in road_impact.items():
        congestion_level += impact * (road_type == road)
    
    # Normalize congestion level to 0-1 range
    congestion_level = np.clip(congestion_level, 0, 1)
    
    # Add random noise
    noise = np.random.normal(0, 0.05, num_samples)
    congestion_level = np.clip(congestion_level + noise, 0, 1)
    
    # Create DataFrame
    df = pd.DataFrame({
        'time_of_day': time_of_day,
        'day_of_week': day_of_week,
        'vehicle_count': vehicle_count,
        'weather_condition': weather_condition,
        'road_type': road_type,
        'congestion_level': congestion_level
    })
    
    return df

def evaluate_model_accuracy(data_path='traffic_data.csv'):
    """
    Evaluate traffic prediction model accuracy using various metrics
    """
    # Load data
    df = pd.read_csv(data_path)
    
    # Split features and target
    X = df.drop('congestion_level', axis=1)
    y = df['congestion_level']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    metrics = {
        'MSE': mean_squared_error(y_test, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
        'MAE': mean_absolute_error(y_test, y_pred),
        'R2': r2_score(y_test, y_pred)
    }
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    # Generate plots
    plt.figure(figsize=(12, 6))
    
    # Actual vs Predicted
    plt.subplot(1, 2, 1)
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Congestion Level')
    plt.ylabel('Predicted Congestion Level')
    plt.title('Actual vs Predicted Values')
    
    # Feature Importance
    plt.subplot(1, 2, 2)
    sns.barplot(x='importance', y='feature', data=feature_importance)
    plt.title('Feature Importance')
    
    plt.tight_layout()
    plt.savefig('model_accuracy.png')
    
    return metrics, feature_importance, model

def predict_traffic(model, time_of_day, day_of_week, vehicle_count, weather_condition, road_type):
    """
    Make traffic predictions using the trained model
    """
    input_data = pd.DataFrame({
        'time_of_day': [time_of_day],
        'day_of_week': [day_of_week],
        'vehicle_count': [vehicle_count],
        'weather_condition': [weather_condition],
        'road_type': [road_type]
    })
    
    prediction = model.predict(input_data)[0]
    return prediction

if __name__ == "__main__":
    # Generate dataset
    print("Generating synthetic traffic data...")
    traffic_data = create_synthetic_traffic_data()
    
    # Save to CSV
    output_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')
    traffic_data.to_csv(output_path, index=False)
    print(f"Dataset created and saved to {output_path}")
    
    # Evaluate model
    print("\nEvaluating model accuracy...")
    metrics, importance, model = evaluate_model_accuracy(output_path)
    
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")
    
    print("\nFeature Importance:")
    print(importance)
    
    # Example prediction
    print("\nExample Prediction:")
    prediction = predict_traffic(
        model,
        time_of_day=8,        # 8 AM
        day_of_week=2,        # Tuesday
        vehicle_count=400,    # 400 vehicles
        weather_condition=1,  # Clear weather
        road_type=2          # Main Street
    )
    print(f"Predicted congestion level: {prediction:.2f}")