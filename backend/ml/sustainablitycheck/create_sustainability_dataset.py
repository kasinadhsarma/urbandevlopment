# create_sustainability_dataset.py
import pandas as pd
import numpy as np

# Create a synthetic dataset
np.random.seed(42)
num_samples = 1000

data = {
    'population_density': np.random.randint(100, 1000, num_samples),  # People per square kilometer
    'industrial_zones': np.random.randint(0, 50, num_samples),  # Number of industrial zones
    'public_transport': np.random.randint(0, 100, num_samples),  # % of population using public transport
    'renewable_investment': np.random.randint(0, 100, num_samples),  # % of budget allocated to renewable energy
    'carbon_footprint': np.random.uniform(10, 20, num_samples),  # Tons CO2e per capita
    'green_space_coverage': np.random.uniform(10, 30, num_samples),  # % of total city area
    'renewable_energy_usage': np.random.uniform(20, 50, num_samples)  # % of total energy consumption
}

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('sustainability_data.csv', index=False)
print("Synthetic dataset created and saved to sustainability_data.csv.")