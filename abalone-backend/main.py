from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

model = joblib.load("model.pkl")
encoder = joblib.load("encoder.pkl")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AbaloneInput(BaseModel):
    Sex: str
    Length: float
    Diameter: float
    Height: float
    Whole_weight: float
    Whole_weight_1: float
    Whole_weight_2: float
    Shell_weight: float

@app.post("/predict")
def predict(data: AbaloneInput):
    sex_encoded = encoder.transform([data.Sex])[0]
    features_df = pd.DataFrame({
        'Sex': [sex_encoded],
        'Length': [data.Length],
        'Diameter': [data.Diameter],
        'Height': [data.Height],
        'Whole weight': [data.Whole_weight],
        'Whole weight.1': [data.Whole_weight_1],
        'Whole weight.2': [data.Whole_weight_2],
        'Shell weight': [data.Shell_weight]
    })


    prediction = model.predict(features_df)[0]
    return {"predicted_rings": round(prediction, 2)}

@app.get("/")
def hello():
  return{"message": "Hello"}