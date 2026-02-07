import numpy as np
from typing import Dict, Any, List
from app.ml.load_model import load_model, load_scaler, load_feature_order

def prepare_features(student_data: Dict[str, Any]) -> np.ndarray:
    """Prepare features in the correct order for model prediction"""
    feature_names = load_feature_order()
    
    # Extract features in the correct order
    features = []
    for feature_name in feature_names:
        value = student_data.get(feature_name, 0)
        # Handle missing or invalid values
        if value is None or value == "":
            value = 0
        features.append(float(value))
    
    return np.array([features])

def predict_dropout_probability(student_data: Dict[str, Any]) -> float:
    """Predict dropout probability for a student"""
    try:
        model = load_model()
        scaler = load_scaler()
        
        # Prepare features
        features = prepare_features(student_data)
        
        # Scale features if scaler is available
        if scaler is not None:
            features = scaler.transform(features)
        
        # Get probability of dropout (class 1)
        try:
            probability = model.predict_proba(features)[0][1]
        except AttributeError:
            # If model doesn't have predict_proba, use predict
            prediction = model.predict(features)[0]
            probability = float(prediction)
        
        return round(float(probability), 4)
    
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        # Fallback to rule-based prediction
        return estimate_risk_fallback(student_data)

def predict_dropout(attendance: float, internal_marks: float = 75, backlogs: int = 0, 
                   study_hours: float = 4, previous_failures: int = 0) -> Dict[str, Any]:
    """Predict dropout for student with individual parameters"""
    student_data = {
        "attendance": attendance,
        "internal_marks": internal_marks,
        "backlogs": backlogs,
        "study_hours": study_hours,
        "previous_failures": previous_failures
    }
    
    probability = predict_dropout_probability(student_data)
    risk_level = calculate_risk_level(probability, student_data)
    risk_factors = identify_risk_factors(student_data)
    
    return {
        "dropout_probability": probability,
        "risk_level": risk_level,
        "prediction": 1 if probability > 0.5 else 0,
        "risk_factors": risk_factors,
        "confidence": get_prediction_confidence(probability)
    }

def calculate_risk_level(probability: float, student_data: Dict[str, Any]) -> str:
    """Calculate risk level based on probability and other factors"""
    attendance = student_data.get("attendance", 100)
    backlogs = student_data.get("backlogs", 0)
    
    # High risk criteria
    if probability > 0.7 or attendance < 60 or backlogs >= 3:
        return "high"
    # Medium risk criteria
    elif probability > 0.4 or attendance < 75 or backlogs >= 1:
        return "medium"
    # Low risk
    else:
        return "low"

def identify_risk_factors(student_data: Dict[str, Any]) -> List[str]:
    """Identify specific risk factors for a student"""
    factors = []
    
    attendance = student_data.get("attendance", 100)
    internal_marks = student_data.get("internal_marks", 100)
    backlogs = student_data.get("backlogs", 0)
    study_hours = student_data.get("study_hours", 0)
    previous_failures = student_data.get("previous_failures", 0)
    
    if attendance < 75:
        factors.append(f"Low attendance ({attendance}%)")
    if internal_marks < 50:
        factors.append(f"Low internal marks ({internal_marks})")
    if backlogs > 0:
        factors.append(f"{backlogs} backlog(s)")
    if study_hours < 3:
        factors.append(f"Insufficient study hours ({study_hours}h/day)")
    if previous_failures > 0:
        factors.append(f"{previous_failures} previous failure(s)")
    
    return factors if factors else ["No significant risk factors identified"]

def get_prediction_confidence(probability: float) -> str:
    """Get confidence level of prediction"""
    if probability > 0.8 or probability < 0.2:
        return "high"
    elif probability > 0.6 or probability < 0.4:
        return "medium"
    else:
        return "low"

def estimate_risk_fallback(student_data: Dict[str, Any]) -> float:
    """Fallback risk estimation using rules"""
    score = 0.0
    factors = 0
    
    attendance = student_data.get("attendance", 100)
    internal_marks = student_data.get("internal_marks", 100)
    backlogs = student_data.get("backlogs", 0)
    
    # Attendance factor
    if attendance < 60:
        score += 0.3
        factors += 1
    elif attendance < 75:
        score += 0.15
        factors += 1
    
    # Marks factor
    if internal_marks < 40:
        score += 0.3
        factors += 1
    elif internal_marks < 60:
        score += 0.15
        factors += 1
    
    # Backlogs factor
    if backlogs >= 3:
        score += 0.3
        factors += 1
    elif backlogs > 0:
        score += 0.1 * backlogs
        factors += 1
    
    return min(score, 0.95)  # Cap at 95%
