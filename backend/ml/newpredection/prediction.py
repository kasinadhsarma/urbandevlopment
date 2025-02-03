import random
from typing import Dict, List, Union
from datetime import datetime, timedelta

def generate_historical_data(days: int = 7) -> List[Dict[str, Union[str, float]]]:
    """Generate mock historical traffic data"""
    data = []
    base = datetime.now()
    for i in range(days):
        date = base - timedelta(days=i)
        data.append({
            "timestamp": date.strftime("%Y-%m-%d"),
            "value": random.uniform(40.0, 90.0)
        })
    return data

def generate_forecast_data() -> List[Dict[str, Union[str, float]]]:
    """Generate mock forecast data"""
    timeframes = ["1h", "2h", "4h", "8h"]
    return [
        {
            "timeframe": tf,
            "prediction": random.uniform(40.0, 90.0)
        }
        for tf in timeframes
    ]

def get_impact_factors() -> Dict[str, float]:
    """Generate impact factors for prediction"""
    return {
        "weather": random.uniform(0.6, 0.9),
        "events": random.uniform(0.5, 0.8),
        "time_of_day": random.uniform(0.7, 0.95),
        "day_of_week": random.uniform(0.6, 0.85)
    }

def predict_traffic(location: str, timeframe: str) -> Dict[str, Union[float, float, List[str], List[Dict], Dict[str, float]]]:
    """
    Predict traffic conditions for a given location and timeframe.
    Returns enhanced prediction data including historical data and forecasts.
    """
    try:
        # Base predictions based on location
        base_predictions = {
            "downtown": {
                "prediction": 85.0,
                "confidence": 0.85,
                "recommendations": [
                    "Use public transportation during peak hours",
                    "Consider alternate routes through side streets",
                    "Implement smart traffic signal timing",
                    "Monitor real-time parking availability"
                ]
            },
            "suburbs": {
                "prediction": 60.0,
                "confidence": 0.90,
                "recommendations": [
                    "Schedule travel outside rush hours",
                    "Use park-and-ride facilities",
                    "Consider carpooling options",
                    "Check traffic updates before departure"
                ]
            },
            "industrial-area": {
                "prediction": 75.0,
                "confidence": 0.80,
                "recommendations": [
                    "Plan deliveries during off-peak hours",
                    "Use designated truck routes",
                    "Monitor real-time traffic updates",
                    "Coordinate with other businesses for delivery timing"
                ]
            },
            "residential-area": {
                "prediction": 45.0,
                "confidence": 0.95,
                "recommendations": [
                    "Use neighborhood shortcuts wisely",
                    "Avoid school zones during peak times",
                    "Consider bicycle for short trips",
                    "Plan around local event schedules"
                ]
            }
        }

        # Get base prediction or generate random if location not found
        base_data = base_predictions.get(location, {
            "prediction": random.uniform(40.0, 90.0),
            "confidence": random.uniform(0.7, 0.9),
            "recommendations": [
                "Monitor traffic conditions in real-time",
                "Plan alternate routes",
                "Allow extra time for travel",
                "Check local event schedules"
            ]
        })

        # Enhance prediction with additional data
        return {
            "prediction": base_data["prediction"],
            "confidence": base_data["confidence"],
            "recommendations": base_data["recommendations"],
            "historical_data": generate_historical_data(),
            "forecast_data": generate_forecast_data(),
            "impact_factors": get_impact_factors()
        }

    except Exception as e:
        # Log the error (in a real system, use proper logging)
        print(f"Error in traffic prediction: {str(e)}")
        # Return a structured error response
        return {
            "prediction": 0.0,
            "confidence": 0.0,
            "recommendations": ["Unable to generate prediction. Please try again."],
            "historical_data": [],
            "forecast_data": [],
            "impact_factors": {},
            "error": str(e)
        }
