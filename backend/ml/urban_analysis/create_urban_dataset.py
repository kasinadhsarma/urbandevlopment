# create_urban_dataset.py
import pandas as pd
import numpy as np

# Create a synthetic dataset
np.random.seed(42)
num_samples = 1000

data = {
    'area_type': np.random.choice(['downtown', 'suburban', 'industrial'], num_samples),
    'population_density': np.random.randint(100, 1000, num_samples),
    'traffic_flow': np.random.randint(50, 500, num_samples),
    'green_spaces': np.random.randint(0, 100, num_samples),
    'public_transport': np.random.randint(0, 100, num_samples),
    'optimization_suggestion': np.random.choice(['increase_green_spaces', 'optimize_traffic', 'expand_public_transport'], num_samples)
}

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('urban_data.csv', index=False)
print("Synthetic dataset created and saved to urban_data.csv.")