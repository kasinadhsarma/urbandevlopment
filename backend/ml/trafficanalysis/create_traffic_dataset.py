import pandas as pd
import numpy as np
import os

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

if __name__ == "__main__":
    # Generate dataset
    traffic_data = create_synthetic_traffic_data()
    
    # Save to CSV
    output_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')
    traffic_data.to_csv(output_path, index=False)
    print(f"Dataset created and saved to {output_path}")
