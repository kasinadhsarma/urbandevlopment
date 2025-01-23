import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import MinMaxScaler

class SustainabilityAnalyzer:
    def __init__(self, data_path='sustainability_data.csv'):
        self.data_path = data_path
        self.metrics_ranges = {
            'emissions': (0, 100),      # CO2 emissions in g/km
            'energy': (0, 100),         # Energy efficiency score
            'green_infra': (0, 100),    # Green infrastructure coverage
            'public_transport': (0, 100),# Public transport usage percentage
            'walking_cycling': (0, 100)  # Walking and cycling facilities score
        }
        self.thresholds = {
            'emissions': 0.6,
            'energy': 0.7,
            'green_infra': 0.65,
            'public_transport': 0.5,
            'walking_cycling': 0.6
        }
        self.scaler = MinMaxScaler()
        self.historical_data = self._load_historical_data()
        
    def _load_historical_data(self):
        """Load historical sustainability data"""
        try:
            if os.path.exists(self.data_path):
                return pd.read_csv(self.data_path)
            return pd.DataFrame(columns=['timestamp'] + list(self.metrics_ranges.keys()))
        except Exception as e:
            print(f"Warning: Could not load historical data: {e}")
            return pd.DataFrame(columns=['timestamp'] + list(self.metrics_ranges.keys()))

    def calculate_metrics(self):
        """Calculate sustainability metrics based on current data"""
        try:
            # Load latest metrics from sensors or data source
            raw_metrics = self._get_current_metrics()
            
            # Store metrics in historical data
            self._store_metrics(raw_metrics)
            
            # Normalize metrics considering historical context
            normalized_metrics = self._normalize_metrics(raw_metrics)
            
            return {
                'emissions_score': normalized_metrics['emissions'],
                'energy_efficiency': normalized_metrics['energy'],
                'green_infrastructure': normalized_metrics['green_infra'],
                'public_transport_usage': normalized_metrics['public_transport'],
                'walking_cycling_score': normalized_metrics['walking_cycling'],
                'trend_analysis': self._analyze_trends()
            }
        except Exception as e:
            raise Exception(f"Error calculating sustainability metrics: {str(e)}")

    def get_recommendations(self):
        """Generate sustainability recommendations based on current metrics"""
        metrics = self.calculate_metrics()
        recommendations = []

        # Emissions recommendations
        if metrics['emissions_score'] < 0.6:
            recommendations.append({
                'category': 'Emissions',
                'score': metrics['emissions_score'],
                'suggestions': [
                    'Implement low emission zones',
                    'Promote electric vehicle adoption',
                    'Optimize traffic signal timing to reduce idling'
                ]
            })

        # Energy efficiency recommendations
        if metrics['energy_efficiency'] < 0.7:
            recommendations.append({
                'category': 'Energy',
                'score': metrics['energy_efficiency'],
                'suggestions': [
                    'Upgrade to LED street lighting',
                    'Install smart energy management systems',
                    'Implement energy-efficient traffic signals'
                ]
            })

        # Green infrastructure recommendations
        if metrics['green_infrastructure'] < 0.65:
            recommendations.append({
                'category': 'Green Infrastructure',
                'score': metrics['green_infrastructure'],
                'suggestions': [
                    'Increase urban green spaces',
                    'Implement green corridors',
                    'Develop urban forests and parks'
                ]
            })

        # Public transport recommendations
        if metrics['public_transport_usage'] < 0.5:
            recommendations.append({
                'category': 'Public Transport',
                'score': metrics['public_transport_usage'],
                'suggestions': [
                    'Expand bus and rail networks',
                    'Improve service frequency',
                    'Implement integrated ticketing systems'
                ]
            })

        # Walking and cycling recommendations
        if metrics['walking_cycling_score'] < 0.6:
            recommendations.append({
                'category': 'Active Transport',
                'score': metrics['walking_cycling_score'],
                'suggestions': [
                    'Expand dedicated cycling lanes',
                    'Improve pedestrian infrastructure',
                    'Create car-free zones in city centers'
                ]
            })

        return recommendations

    def _get_current_metrics(self):
        """Get current metrics from sensors or data sources"""
        try:
            # TODO: Replace with actual sensor data or API calls
            raw_metrics = {
                'emissions': np.random.uniform(20, 80),  # Temporary random data
                'energy': np.random.uniform(40, 90),
                'green_infra': np.random.uniform(30, 70),
                'public_transport': np.random.uniform(20, 60),
                'walking_cycling': np.random.uniform(30, 80)
            }
            return raw_metrics
        except Exception as e:
            raise Exception(f"Error getting current metrics: {str(e)}")

    def _store_metrics(self, metrics):
        """Store metrics in historical data"""
        try:
            new_row = pd.DataFrame({
                'timestamp': [pd.Timestamp.now()],
                **{k: [v] for k, v in metrics.items()}
            })
            self.historical_data = pd.concat([self.historical_data, new_row], ignore_index=True)
            self.historical_data.to_csv(self.data_path, index=False)
        except Exception as e:
            print(f"Warning: Could not store metrics: {e}")

    def _normalize_metrics(self, metrics):
        """Normalize metrics to 0-1 range using historical context"""
        normalized = {}
        for key, value in metrics.items():
            if not self.historical_data.empty:
                # Use historical min/max if available
                min_val = min(self.historical_data[key].min(), self.metrics_ranges[key][0])
                max_val = max(self.historical_data[key].max(), self.metrics_ranges[key][1])
            else:
                min_val, max_val = self.metrics_ranges[key]
            
            normalized[key] = (value - min_val) / (max_val - min_val)
            normalized[key] = max(0, min(1, normalized[key]))  # Clip to 0-1
        return normalized

    def _analyze_trends(self):
        """Analyze trends in sustainability metrics"""
        if len(self.historical_data) < 2:
            return {}
        
        trends = {}
        recent_data = self.historical_data.tail(30)  # Last 30 records
        
        for metric in self.metrics_ranges.keys():
            if metric in recent_data.columns:
                trend = np.polyfit(range(len(recent_data)), recent_data[metric], 1)[0]
                trends[metric] = {
                    'direction': 'improving' if trend > 0 else 'declining',
                    'rate': abs(trend)
                }
        
        return trends
