# ==========================================
# predict.py — FIXED
# ==========================================

import pandas as pd
import numpy as np
import joblib


# Load model bundle
bundle = joblib.load("model.pkl")

model = bundle["model"]
label_encoder = bundle["label_encoder"]
features = bundle["features"]

print("Model loaded successfully")


def predict_transaction(txn_dict):

    df = pd.DataFrame([txn_dict])

    # Match training schema
    df["Amount"] = df["amount"]

    # Feature engineering
    df["amount_log"] = np.log1p(df["Amount"])

    df["is_night"] = df["hour_of_day"].apply(
        lambda x: 1 if x <= 4 or x >= 22 else 0
    )

    df["location_encoded"] = label_encoder.transform(
        df["location"]
    )

    # Select trained feature order
    X = df[features]

    prob = model.predict_proba(X)[0][1]

    label = "FRAUD" if prob > 0.5 else "NORMAL"

    if prob > 0.7:
        risk = "HIGH"
    elif prob > 0.3:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "prediction": label,
        "fraud_probability": float(prob),
        "risk_level": risk
    }
