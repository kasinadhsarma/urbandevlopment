# Backend Technical Documentation

## Overview

The backend of the Urban Development project is built using FastAPI, a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints. The backend handles various functionalities such as traffic prediction, traffic analysis, sustainability metrics, and urban analysis.

## Architecture

The backend architecture consists of the following main components:

1. **API Endpoints**: Defined using FastAPI to handle requests and responses.
2. **Data Processing**: Scripts and modules for data loading, preprocessing, and analysis.
3. **Machine Learning Models**: Trained models for traffic prediction, traffic analysis, and sustainability metrics.

## API Endpoints

### Traffic Prediction

- **Endpoint**: `/api/predict-traffic`
- **Method**: POST
- **Request Model**: `TrafficPredictionRequest`
- **Response Model**: `TrafficPredictionResponse`
- **Description**: Predicts traffic conditions for a given location and timeframe.
- **Implementation**: Uses the `predict_traffic` function from the `ml.newpredection.prediction` module.

### Traffic Analysis

- **Endpoint**: `/api/analyze-traffic`
- **Method**: POST
- **Request Model**: `TrafficAnalysisRequest`
- **Response Model**: `TrafficAnalysisResponse`
- **Description**: Analyzes traffic congestion based on various features.
- **Implementation**: Uses the `TrafficAnalyzer` class from the `ml.trafficanalysis.trafficanalysis` module.

### Sustainability Metrics

- **Endpoint**: `/api/sustainability-metrics`
- **Method**: GET
- **Response Model**: `SustainabilityMetrics`
- **Description**: Provides sustainability metrics.
- **Implementation**: Uses the `SustainabilityAnalyzer` class from the `ml.sustainablitycheck.check` module.

### Sustainability Recommendations

- **Endpoint**: `/api/sustainability-recommendations`
- **Method**: GET
- **Response Model**: `List[SustainabilityRecommendation]`
- **Description**: Provides sustainability recommendations.
- **Implementation**: Uses the `SustainabilityAnalyzer` class from the `ml.sustainablitycheck.check` module.

### Urban Analysis

- **Endpoint**: `/api/analyze-urban-area`
- **Method**: POST
- **Request Model**: `UrbanAnalysisRequest`
- **Response Model**: `UrbanAnalysisResponse`
- **Description**: Analyzes urban areas for congestion, green space, and public transport coverage.
- **Implementation**: Uses the `analyze_urban_area` function from the `ml.urban_analysis.layout` module and the `TrafficAnalyzer` class from the `ml.trafficanalysis.trafficanalysis` module.

### Hourly Distribution

- **Endpoint**: `/api/hourly-distribution`
- **Method**: GET
- **Response Model**: `List[HourlyDistributionResponse]`
- **Description**: Provides hourly traffic distribution.
- **Implementation**: Uses the `TrafficAnalyzer` class from the `ml.trafficanalysis.trafficanalysis` module.

### Historical Accuracy

- **Endpoint**: `/api/historical-accuracy`
- **Method**: GET
- **Response Model**: `List[HistoricalAccuracyResponse]`
- **Description**: Provides historical accuracy data.
- **Implementation**: Uses the `TrafficAnalyzer` class from the `ml.trafficanalysis.trafficanalysis` module.

## Data Processing

The backend includes various scripts and modules for data loading, preprocessing, and analysis. These scripts are located in the `backend/ml` directory and are organized into subdirectories based on their functionality.

### Traffic Data Processing

- **Module**: `backend/ml/newpredection/dataset.py`
- **Description**: Handles loading, preprocessing, and splitting of traffic data.
- **Functions**:
  - `load_data(file_path)`: Loads the dataset from a CSV file.
  - `preprocess_data(data, target_column, scale_features=False)`: Preprocesses the dataset by handling missing values, encoding categorical variables, and optionally scaling features.
  - `split_data(X, y, test_size=0.2, random_state=42)`: Splits the dataset into training and testing sets.

### Sustainability Data Processing

- **Module**: `backend/ml/sustainablitycheck/check.py`
- **Description**: Analyzes sustainability metrics and provides recommendations.
- **Classes**:
  - `SustainabilityAnalyzer`: Analyzes sustainability metrics and provides recommendations.
    - `calculate_metrics()`: Calculates sustainability metrics based on current data.
    - `get_recommendations()`: Generates sustainability recommendations based on current metrics.
    - `_get_current_metrics()`: Gets current metrics from sensors or data sources.
    - `_store_metrics(metrics)`: Stores metrics in historical data.
    - `_normalize_metrics(metrics)`: Normalizes metrics to 0-1 range using historical context.
    - `_analyze_trends()`: Analyzes trends in sustainability metrics.

### Urban Data Processing

- **Module**: `backend/ml/urban_analysis/layout.py`
- **Description**: Analyzes urban areas and provides metrics and suggestions.
- **Functions**:
  - `analyze_urban_area(area)`: Analyzes urban area and returns metrics and suggestions.

## Machine Learning Models

The backend includes various machine learning models for traffic prediction, traffic analysis, and sustainability metrics. These models are trained using scripts located in the `backend/ml` directory.

### Traffic Prediction Model

- **Module**: `backend/ml/newpredection/train.py`
- **Description**: Trains the traffic prediction model using XGBoost.
- **Functions**:
  - `train_model(X_train, y_train)`: Trains an XGBoost Regressor model with hyperparameter tuning.
  - `evaluate_model(model, X_test, y_test)`: Evaluates the model using Mean Absolute Error (MAE).
  - `save_model(model, file_path)`: Saves the trained model to a file.
  - `main()`: Main function to load data, preprocess data, split data, train the model, evaluate the model, and save the model.

### Traffic Analysis Model

- **Module**: `backend/ml/trafficanalysis/train_traffic_model.py`
- **Description**: Trains the traffic analysis model using RandomForestRegressor.
- **Functions**:
  - `train_model()`: Trains the traffic congestion prediction model.
    - Loads and preprocesses data.
    - Splits data into training and testing sets.
    - Scales features.
    - Trains the model.
    - Evaluates the model.
    - Saves the model and scaler.

### Sustainability Model

- **Module**: `backend/ml/sustainablitycheck/train_sustainability_model.py`
- **Description**: Trains the sustainability model using RandomForestRegressor.
- **Functions**:
  - `train_model()`: Trains the sustainability model.
    - Loads and preprocesses data.
    - Splits data into training and testing sets.
    - Trains the model.
    - Evaluates the model.
    - Saves the model.

### Urban Analysis Model

- **Module**: `backend/ml/urban_analysis/train_urban_model.py`
- **Description**: Trains the urban analysis model using RandomForestClassifier.
- **Functions**:
  - `train_model()`: Trains the urban analysis model.
    - Loads and preprocesses data.
    - Splits data into training and testing sets.
    - Trains the model.
    - Evaluates the model.
    - Saves the model.
