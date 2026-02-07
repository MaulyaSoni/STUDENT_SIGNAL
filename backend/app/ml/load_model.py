import joblib
import json
import os

# Paths to model files
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "dropout_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")
FEATURE_ORDER_PATH = os.path.join(BASE_DIR, "models", "feature_order.json")

# Global variables to cache loaded models
model = None
scaler = None
feature_order = None

def load_model():
    """Load the trained dropout prediction model"""
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        model = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded from {MODEL_PATH}")
    return model

def load_scaler():
    """Load the feature scaler"""
    global scaler
    if scaler is None:
        if os.path.exists(SCALER_PATH):
            scaler = joblib.load(SCALER_PATH)
            print(f"✅ Scaler loaded from {SCALER_PATH}")
        else:
            print("⚠️  Scaler not found, predictions will use raw features")
    return scaler

def load_feature_order():
    """Load the feature order for consistent predictions"""
    global feature_order
    if feature_order is None:
        if os.path.exists(FEATURE_ORDER_PATH):
            with open(FEATURE_ORDER_PATH, 'r') as f:
                feature_order = json.load(f)
            print(f"✅ Feature order loaded: {feature_order}")
        else:
            # Default feature order
            feature_order = ["attendance", "internal_marks", "backlogs", "study_hours", "previous_failures"]
            print(f"⚠️  Using default feature order: {feature_order}")
    return feature_order
