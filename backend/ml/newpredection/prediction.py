import random
from typing import Dict, List, Union

def predict_traffic(location: str, timeframe: str) -> Dict[str, Union[float, List[str]]]:
    """
    Predict traffic conditions for a given location and timeframe.
    Currently using mock data for demonstration.
    """
    # Mock predictions based on location
    prediction_data = {
        "downtown": {
            "prediction": 85.0,
            "confidence": 0.85,
            "recommendations": [
                "Use public transportation during peak hours",
                "Consider alternate routes through side streets",
                "Implement smart traffic signal timing"
            ]
        },
        "suburbs": {
            "prediction": 60.0,
            "confidence": 0.90,
            "recommendations": [
                "Schedule travel outside rush hours",
                "Use park-and-ride facilities",
                "Consider carpooling options"
            ]
        },
        "industrial-area": {
            "prediction": 75.0,
            "confidence": 0.80,
            "recommendations": [
                "Plan deliveries during off-peak hours",
                "Use designated truck routes",
                "Monitor real-time traffic updates"
            ]
        },
        "residential-area": {
            "prediction": 45.0,
            "confidence": 0.95,
            "recommendations": [
                "Use neighborhood shortcuts wisely",
                "Avoid school zones during peak times",
                "Consider bicycle for short trips"
            ]
        }
    }

    # If location not found, generate random prediction
    if location not in prediction_data:
        return {
            "prediction": random.uniform(40.0, 90.0),
            "confidence": random.uniform(0.7, 0.9),
            "recommendations": [
                "Monitor traffic conditions in real-time",
                "Plan alternate routes",
                "Allow extra time for travel"
            ]
        }

    return prediction_data[location]
