# ==========================================
# app.py — Fraud Detection Backend (Final)
# PCA-Free • Hackathon Ready
# ==========================================

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from predict import predict_transaction


# ==========================================
# INIT FASTAPI
# ==========================================

app = FastAPI(
    title="AI Fraud Detection API",
    description="Real-time transaction fraud detection system",
    version="1.0"
)


# ==========================================
# INPUT SCHEMA
# ==========================================

class Transaction(BaseModel):

    transaction_id: str
    location: str
    hour_of_day: int   # 0–23
    amount: float


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Fraud Detection API Running",
        "model": "XGBoost Behavioral Fraud Model",
        "version": "1.0"
    }


# ==========================================
# TIME RISK ENGINE
# ==========================================

def get_time_risk(hour: int):

    if 0 <= hour <= 4:
        return "HIGH_NIGHT_RISK"

    elif 5 <= hour <= 7:
        return "EARLY_MORNING_RISK"

    elif 22 <= hour <= 23:
        return "LATE_NIGHT_RISK"

    else:
        return "NORMAL_TIME_RISK"


# ==========================================
# LOCATION RISK ENGINE
# ==========================================

def get_location_risk(location: str):

    high_risk = ["HighRisk"]
    medium_risk = ["MediumRisk"]

    if location in high_risk:
        return "HIGH"

    elif location in medium_risk:
        return "MEDIUM"

    else:
        return "LOW"


# ==========================================
# PREDICTION ENDPOINT
# ==========================================

@app.post("/predict")
def predict(txn: Transaction):

    try:

        # Build ML input
        txn_dict = {
            "amount": txn.amount,
            "hour_of_day": txn.hour_of_day,
            "location": txn.location
        }

        # ML Prediction
        result = predict_transaction(txn_dict)

        # Behavioral Risk
        time_risk = get_time_risk(txn.hour_of_day)

        # Location Risk
        location_risk = get_location_risk(txn.location)

        # ==================================
        # FINAL RESPONSE
        # ==================================

        return {
            "status": "success",

            "transaction_id": txn.transaction_id,
            "location": txn.location,
            "hour_of_day": txn.hour_of_day,
            "amount": txn.amount,

            "prediction": result["prediction"],
            "fraud_probability": result["fraud_probability"],
            "risk_level": result["risk_level"],

            "time_risk_factor": time_risk,
            "location_risk_factor": location_risk
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
