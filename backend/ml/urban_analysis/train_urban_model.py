# train_urban_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
df = pd.read_csv('urban_data.csv')

# Convert categorical variables to numerical
df = pd.get_dummies(df, columns=['area_type'], drop_first=True)

# Prepare features and target
X = df.drop('optimization_suggestion', axis=1)
y = df['optimization_suggestion']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model accuracy: {accuracy * 100:.2f}%")

# Save the model
joblib.dump(model, 'urban_optimization_model.pkl')
print("Model trained and saved to urban_optimization_model.pkl.")