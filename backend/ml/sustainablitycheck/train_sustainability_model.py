# train_sustainability_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

# Load the dataset
df = pd.read_csv('sustainability_data.csv')

# Prepare features and targets
X = df[['population_density', 'industrial_zones', 'public_transport', 'renewable_investment']]
y_carbon = df['carbon_footprint']
y_green = df['green_space_coverage']
y_renewable = df['renewable_energy_usage']

# Split the data
X_train, X_test, y_carbon_train, y_carbon_test = train_test_split(X, y_carbon, test_size=0.2, random_state=42)
_, _, y_green_train, y_green_test = train_test_split(X, y_green, test_size=0.2, random_state=42)
_, _, y_renewable_train, y_renewable_test = train_test_split(X, y_renewable, test_size=0.2, random_state=42)

# Train models
carbon_model = RandomForestRegressor(n_estimators=100, random_state=42)
carbon_model.fit(X_train, y_carbon_train)

green_model = RandomForestRegressor(n_estimators=100, random_state=42)
green_model.fit(X_train, y_green_train)

renewable_model = RandomForestRegressor(n_estimators=100, random_state=42)
renewable_model.fit(X_train, y_renewable_train)

# Evaluate models
carbon_pred = carbon_model.predict(X_test)
carbon_mae = mean_absolute_error(y_carbon_test, carbon_pred)

green_pred = green_model.predict(X_test)
green_mae = mean_absolute_error(y_green_test, green_pred)

renewable_pred = renewable_model.predict(X_test)
renewable_mae = mean_absolute_error(y_renewable_test, renewable_pred)

print(f"Carbon Footprint MAE: {carbon_mae}")
print(f"Green Space Coverage MAE: {green_mae}")
print(f"Renewable Energy Usage MAE: {renewable_mae}")

# Save models
joblib.dump(carbon_model, 'carbon_model.pkl')
joblib.dump(green_model, 'green_model.pkl')
joblib.dump(renewable_model, 'renewable_model.pkl')
print("Models trained and saved.")