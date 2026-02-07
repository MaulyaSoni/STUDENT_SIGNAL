"""
Decision Tree Visualization Module
Generates visualization images for the trained decision tree model
"""
import os
import joblib
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree, export_text
from io import BytesIO
import base64

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "dropout_model.pkl")

def generate_tree_visualization(max_depth=4):
    """Generate decision tree visualization as base64 image"""
    try:
        # Load the model
        model = joblib.load(MODEL_PATH)
        
        # Check if model is a decision tree
        model_type = type(model).__name__
        if 'Tree' not in model_type and 'Forest' not in model_type:
            return {
                "error": f"Model is {model_type}, not a tree-based model",
                "image": None,
                "text_rules": "Not applicable for this model type"
            }
        
        # Create figure
        plt.figure(figsize=(20, 10))
        
        # Feature names
        feature_names = ["attendance", "internal_marks", "backlogs", "study_hours", "previous_failures"]
        class_names = ["No Dropout", "Dropout"]
        
        # Plot the tree
        if 'Forest' in model_type:
            # For Random Forest, visualize the first tree
            tree = model.estimators_[0]
            plot_tree(tree, 
                     feature_names=feature_names,
                     class_names=class_names,
                     filled=True, 
                     rounded=True,
                     fontsize=10,
                     max_depth=max_depth)
            plt.title("Decision Tree Visualization (First Tree from Random Forest)", fontsize=16, pad=20)
        else:
            # For single Decision Tree
            plot_tree(model, 
                     feature_names=feature_names,
                     class_names=class_names,
                     filled=True, 
                     rounded=True,
                     fontsize=10,
                     max_depth=max_depth)
            plt.title("Decision Tree Visualization", fontsize=16, pad=20)
        
        # Save to bytes
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)
        
        # Convert to base64
        image_base64 = base64.b64encode(buffer.read()).decode()
        
        # Get text representation
        if 'Forest' in model_type:
            text_rules = export_text(tree, feature_names=feature_names, max_depth=max_depth)
        else:
            text_rules = export_text(model, feature_names=feature_names, max_depth=max_depth)
        
        plt.close()
        
        return {
            "model_type": model_type,
            "image": f"data:image/png;base64,{image_base64}",
            "text_rules": text_rules,
            "feature_names": feature_names,
            "num_features": len(feature_names)
        }
    
    except FileNotFoundError:
        return {
            "error": "Model file not found",
            "image": None,
            "text_rules": None
        }
    except Exception as e:
        return {
            "error": str(e),
            "image": None,
            "text_rules": None
        }

def get_feature_importance():
    """Get feature importance from the model"""
    try:
        model = joblib.load(MODEL_PATH)
        
        # Check if model has feature_importances_
        if hasattr(model, 'feature_importances_'):
            feature_names = ["attendance", "internal_marks", "backlogs", "study_hours", "previous_failures"]
            importances = model.feature_importances_
            
            # Create importance dictionary
            importance_dict = {
                name: float(importance) 
                for name, importance in zip(feature_names, importances)
            }
            
            # Sort by importance
            sorted_importance = dict(sorted(importance_dict.items(), 
                                          key=lambda x: x[1], 
                                          reverse=True))
            
            # Create visualization
            plt.figure(figsize=(10, 6))
            plt.barh(list(sorted_importance.keys()), list(sorted_importance.values()))
            plt.xlabel('Importance')
            plt.title('Feature Importance in Dropout Prediction')
            plt.tight_layout()
            
            # Save to bytes
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return {
                "importances": sorted_importance,
                "image": f"data:image/png;base64,{image_base64}"
            }
        else:
            return {
                "error": "Model does not support feature importance",
                "importances": None,
                "image": None
            }
    
    except Exception as e:
        return {
            "error": str(e),
            "importances": None,
            "image": None
        }
