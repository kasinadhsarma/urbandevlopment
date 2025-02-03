from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Union
import pickle
import pandas as pd
from ml.newpredection.prediction import predict_traffic
from ml.urban_analysis.layout import analyze_urban_area
from ml.trafficanalysis.trafficanalysis import TrafficAnalyzer
from ml.sustainablitycheck.check import SustainabilityAnalyzer
from dashboard_metrics import DashboardMetrics

app = FastAPI()
dashboard_metrics = DashboardMetrics()

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
    historical_data: List[Dict[str, Union[str, float]]]
    forecast_data: List[Dict[str, Union[str, float]]]
    impact_factors: Dict[str, float]

@app.post("/api/predict-traffic", response_model=TrafficPredictionResponse)
async def predict_traffic_route(request: TrafficPredictionRequest):
    try:
        prediction_result = predict_traffic(request.location, request.timeframe)
        return TrafficPredictionResponse(
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            recommendations=prediction_result["recommendations"],
            historical_data=prediction_result["historical_data"],
            forecast_data=prediction_result["forecast_data"],
            impact_factors=prediction_result["impact_factors"]
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

class AnalysisDetails(BaseModel):
    historical_trend: List[Dict[str, Union[str, float]]]
    hourly_pattern: List[Dict[str, Union[str, float]]]
    zone_impacts: Dict[str, float]
    risk_factors: Dict[str, float]

class TrafficAnalysisResponse(BaseModel):
    congestion_level: float
    feature_importance: Dict[str, float]
    congestion_category: str
    analysis_details: AnalysisDetails
    recommendations: List[str]

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

# Dashboard Overview Metrics
class DashboardMetricsResponse(BaseModel):
    traffic_metrics: Dict
    sustainability_metrics: Dict
    prediction_metrics: Dict
    urban_metrics: Dict

@app.get("/api/dashboard-metrics", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics():
    try:
        metrics = dashboard_metrics.get_dashboard_metrics()
        return DashboardMetricsResponse(**metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
