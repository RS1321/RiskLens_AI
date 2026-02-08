# ==========================================
# train.py — Fraud Model (No PCA)
# ==========================================

import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.preprocessing import LabelEncoder

from xgboost import XGBClassifier


# ==========================================
# 1. LOAD DATASET
# ==========================================

print("Loading dataset...")

df = pd.read_csv("data.csv")

print("Total samples:", len(df))


# ==========================================
# 2. FEATURE ENGINEERING
# ==========================================

print("\nEngineering features...")

# Convert elapsed seconds → hour of day
df["hour_of_day"] = (df["Time"] // 3600) % 24

# Night flag
df["is_night"] = df["hour_of_day"].apply(
    lambda x: 1 if x <= 4 or x >= 22 else 0
)

# Log transform amount
df["amount_log"] = np.log1p(df["Amount"])


# ==========================================
# 3. SIMULATE LOCATION
# ==========================================

np.random.seed(42)

locations = ["LowRisk", "MediumRisk", "HighRisk"]

df["location"] = np.random.choice(
    locations,
    size=len(df),
    p=[0.7, 0.2, 0.1]
)

le = LabelEncoder()
df["location_encoded"] = le.fit_transform(df["location"])


# ==========================================
# 4. SELECT FEATURES
# ==========================================

features = [
    "Amount",
    "amount_log",
    "hour_of_day",
    "is_night",
    "location_encoded"
]

X = df[features]
y = df["Class"]


# ==========================================
# 5. TRAIN TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)


# ==========================================
# 6. HANDLE CLASS IMBALANCE
# ==========================================

ratio = len(y_train[y_train == 0]) / len(y_train[y_train == 1])

print("scale_pos_weight:", round(ratio, 2))


# ==========================================
# 7. TRAIN MODEL  ← THIS WAS MISSING
# ==========================================

print("\nTraining model...")

model = XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=ratio,
    eval_metric="logloss",
    random_state=42
)

model.fit(X_train, y_train)


# ==========================================
# 8. EVALUATION
# ==========================================

print("\n=== Evaluation ===")

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

roc_auc = roc_auc_score(y_test, y_prob)
print("\nROC-AUC:", round(roc_auc, 4))


# ==========================================
# 9. SAVE MODEL BUNDLE
# ==========================================

bundle = {
    "model": model,
    "label_encoder": le,
    "features": features
}

joblib.dump(bundle, "model.pkl")

print("\nModel saved as model.pkl")
print("Training complete.")
