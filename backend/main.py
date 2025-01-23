from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import pickle
import pandas as pd
from ml.newpredection.prediction import predict_traffic
from ml.urban_analysis.layout import analyze_urban_area
from ml.trafficanalysis.trafficanalysis import TrafficAnalyzer

app = FastAPI()

# Initialize traffic analyzer
traffic_analyzer = TrafficAnalyzer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

class TrafficTrendsResponse(BaseModel):
    time_based_patterns: Dict[str, float]
    daily_patterns: Dict[str, float]
    weather_impact: Dict[str, float]
    road_type_analysis: Dict[str, float]

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

@app.get("/api/traffic-trends", response_model=TrafficTrendsResponse)
async def get_traffic_trends():
    try:
        # Use default path in analyze_trends method
        trends = traffic_analyzer.analyze_trends()
        
        # Map numeric keys to strings for better display
        weather_map = {1: "Clear", 2: "Rain", 3: "Snow", 4: "Fog"}
        road_map = {1: "Highway", 2: "Main Street", 3: "Residential", 4: "Downtown"}
        
        formatted_trends = {
            'time_based_patterns': trends['time_based_patterns'],
            'daily_patterns': trends['daily_patterns'],
            'weather_impact': {weather_map.get(k, k): v for k, v in trends['weather_impact'].items()},
            'road_type_analysis': {road_map.get(k, k): v for k, v in trends['road_type_analysis'].items()}
        }
        
        return TrafficTrendsResponse(**formatted_trends)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail="Traffic data file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Urban Analysis Models
class UrbanAnalysisRequest(BaseModel):
    area: str
    include_suggestions: bool = True

class UrbanAnalysisResponse(BaseModel):
    congestion_score: float
    green_space_ratio: float
    public_transport_coverage: float
    optimization_suggestions: Optional[List[str]]

@app.post("/api/analyze-urban-area", response_model=UrbanAnalysisResponse)
async def analyze_urban_area_route(request: UrbanAnalysisRequest):
    try:
        analysis_result = analyze_urban_area(request.area)
        return UrbanAnalysisResponse(
            congestion_score=analysis_result["congestion_score"],
            green_space_ratio=analysis_result["green_space_ratio"],
            public_transport_coverage=analysis_result["public_transport_coverage"],
            optimization_suggestions=analysis_result.get("suggestions") if request.include_suggestions else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
