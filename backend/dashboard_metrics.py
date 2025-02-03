from datetime import datetime, timedelta
import random

class DashboardMetrics:
    @staticmethod
    def generate_time_series(days=7):
        data = []
        base = datetime.now()
        for i in range(days):
            date = base - timedelta(days=i)
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "traffic_flow": random.randint(40, 90),
                "congestion": random.randint(30, 85),
                "public_transport": random.randint(50, 95)
            })
        return data

    @staticmethod
    def get_dashboard_metrics():
        return {
            "traffic_metrics": {
                "current_flow": random.randint(60, 90),
                "peak_hours": [
                    {"hour": "08:00", "level": 85},
                    {"hour": "12:00", "level": 65},
                    {"hour": "17:00", "level": 90},
                    {"hour": "20:00", "level": 70}
                ],
                "area_statistics": {
                    "downtown": {"flow": 85, "congestion": 75},
                    "residential": {"flow": 60, "congestion": 45},
                    "industrial": {"flow": 70, "congestion": 65},
                    "suburban": {"flow": 50, "congestion": 35}
                }
            },
            "sustainability_metrics": {
                "green_coverage": random.randint(25, 35),
                "emissions_reduction": random.randint(15, 25),
                "energy_efficiency": random.randint(70, 85),
                "trends": DashboardMetrics.generate_time_series()
            },
            "prediction_metrics": {
                "historical_accuracy": random.randint(85, 95),
                "current_confidence": random.randint(80, 90),
                "forecast_trends": [
                    {"timeframe": "1h", "prediction": random.randint(60, 90)},
                    {"timeframe": "3h", "prediction": random.randint(55, 85)},
                    {"timeframe": "6h", "prediction": random.randint(50, 80)}
                ]
            },
            "urban_metrics": {
                "density": {
                    "residential": random.randint(60, 80),
                    "commercial": random.randint(70, 90),
                    "industrial": random.randint(40, 60)
                },
                "infrastructure": {
                    "roads": random.randint(70, 85),
                    "public_transport": random.randint(65, 80),
                    "green_spaces": random.randint(30, 45)
                },
                "zone_activity": DashboardMetrics.generate_time_series(5)
            }
        }
