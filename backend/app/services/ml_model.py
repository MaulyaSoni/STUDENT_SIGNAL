from sklearn.linear_model import LogisticRegression
import numpy as np

model = LogisticRegression()

# dummy training (hackathon-safe)
X = np.array([[80,1],[60,3],[50,4],[90,0]])
y = np.array([0,1,1,0])
model.fit(X, y)

def predict_dropout(attendance, absences):
    prob = model.predict_proba([[attendance, absences]])[0][1]
    return round(float(prob), 2)
