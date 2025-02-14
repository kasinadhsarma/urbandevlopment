from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import pickle
import pandas as pd
from ml.newpredection.prediction import predict_traffic
from ml.urban_analysis.layout import analyze_urban_area
from ml.trafficanalysis.trafficanalysis import TrafficAnalyzer
from ml.sustainablitycheck.check import SustainabilityAnalyzer

app = FastAPI()

# Initialize analyzers
traffic_analyzer = TrafficAnalyzer()
sustainability_analyzer = SustainabilityAnalyzer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Traffic Prediction Models
class TrafficPredictionRequest(BaseModel):
    location: str
    timeframe: str

class TrafficPredictionResponse(BaseModel):
    prediction: float
    confidence: float
    recommendations: List[str]

@app.post("/api/predict-traffic", response_model=TrafficPredictionResponse)
async def predict_traffic_route(request: TrafficPredictionRequest):
    try:
        prediction_result = predict_traffic(request.location, request.timeframe)
        return TrafficPredictionResponse(
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            recommendations=prediction_result["recommendations"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Traffic Analysis Models
class TrafficAnalysisRequest(BaseModel):
    time_of_day: int
    day_of_week: int
    vehicle_count: int
    weather_condition: int
    road_type: int

class TrafficAnalysisResponse(BaseModel):
    congestion_level: float
    feature_importance: Dict[str, float]
    congestion_category: str
    hourly_distribution: Dict[int, float]
    historical_accuracy: Dict[str, float]

@app.post("/api/analyze-traffic", response_model=TrafficAnalysisResponse)
async def analyze_traffic_route(request: TrafficAnalysisRequest):
    try:
        features = {
            'time_of_day': request.time_of_day,
            'day_of_week': request.day_of_week,
            'vehicle_count': request.vehicle_count,
            'weather_condition': request.weather_condition,
            'road_type': request.road_type
        }
        result = traffic_analyzer.predict_congestion(features)
        return TrafficAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Sustainability Models
class TrendData(BaseModel):
    direction: str
    rate: float

class SustainabilityMetrics(BaseModel):
    emissions_score: float
    energy_efficiency: float
    green_infrastructure: float
    public_transport_usage: float
    walking_cycling_score: float
    trend_analysis: Dict[str, TrendData]

@app.get("/api/sustainability-metrics", response_model=SustainabilityMetrics)
async def get_sustainability_metrics():
    try:
        metrics = sustainability_analyzer.calculate_metrics()
        return SustainabilityMetrics(**metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SustainabilityRecommendation(BaseModel):
    category: str
    score: float
    suggestions: List[str]

@app.get("/api/sustainability-recommendations", response_model=List[SustainabilityRecommendation])
async def get_sustainability_recommendations():
    try:
        recommendations = sustainability_analyzer.get_recommendations()
        return [SustainabilityRecommendation(**rec) for rec in recommendations]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW: Define model for area distribution
class AreaDistribution(BaseModel):
    category: str
    percentage: float

# Urban Analysis Models
class UrbanAnalysisRequest(BaseModel):
    area: str
    include_suggestions: bool = True

# Updated response model using AreaDistribution
class UrbanAnalysisResponse(BaseModel):
    congestion_score: float
    green_space_ratio: float
    public_transport_coverage: float
    optimization_suggestions: Optional[List[str]]
    hourly_distribution: Dict[int, float]
    historical_data: Dict[str, float]
    area_distribution: List[AreaDistribution]

@app.post("/api/analyze-urban-area", response_model=UrbanAnalysisResponse)
async def analyze_urban_area_route(request: UrbanAnalysisRequest):
    try:
        analysis_result = analyze_urban_area(request.area)
        hourly_data = traffic_analyzer.get_hourly_distribution()
        historical_data = traffic_analyzer.get_historical_accuracy()
        # Placeholder area distribution data
        area_distribution = [
            {"category": "Residential", "percentage": 40},
            {"category": "Commercial", "percentage": 35},
            {"category": "Industrial", "percentage": 25}
        ]
        return {
            "congestion_score": analysis_result["congestion_score"],
            "green_space_ratio": analysis_result["green_space_ratio"],
            "public_transport_coverage": analysis_result["public_transport_coverage"],
            "optimization_suggestions": analysis_result.get("suggestions") if request.include_suggestions else [],
            "hourly_distribution": hourly_data,
            "historical_data": historical_data,
            "area_distribution": area_distribution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New Endpoints
class HourlyDistributionResponse(BaseModel):
    hour: int
    traffic_volume: float

@app.get("/api/hourly-distribution", response_model=List[HourlyDistributionResponse])
async def get_hourly_distribution():
    try:
        # Assuming we have a function to get hourly distribution
        hourly_data = traffic_analyzer.get_hourly_distribution()
        return [HourlyDistributionResponse(hour=hour, traffic_volume=volume) for hour, volume in hourly_data.items()]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class HistoricalAccuracyResponse(BaseModel):
    timestamp: str
    accuracy: float

@app.get("/api/historical-accuracy", response_model=List[HistoricalAccuracyResponse])
async def get_historical_accuracy():
    try:
        # Add logging to debug the issue
        historical_data = traffic_analyzer.get_historical_accuracy()
        print(f"Historical data: {historical_data}")  # Debug print
        
        # Convert the data to the response model
        response_data = []
        for timestamp, accuracy in historical_data.items():
            try:
                response_data.append(HistoricalAccuracyResponse(
                    timestamp=str(timestamp),  # Ensure timestamp is string
                    accuracy=float(accuracy)   # Ensure accuracy is float
                ))
            except Exception as conversion_error:
                print(f"Error converting data for timestamp {timestamp}: {conversion_error}")
                continue
                
        return response_data
    except Exception as e:
        print(f"Error in get_historical_accuracy endpoint: {str(e)}")  # Debug print
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
