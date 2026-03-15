import sys
import joblib
import json
import os

model_path = os.path.join('..', 'ml-model', 'model.pkl')
vectorizer_path = os.path.join('..', 'ml-model', 'vectorizer.pkl')

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

text = sys.argv[1]

X = vectorizer.transform([text])
prediction = model.predict(X)[0]
proba = model.predict_proba(X)[0]

# Get confidence for predicted class
confidence = round(proba.max() * 100, 1)

# If confidence is low — mark as uncertain
if confidence < 60:
    verdict = "UNCERTAIN"
elif prediction == 1:
    verdict = "FAKE"
else:
    verdict = "REAL"

result = {
    "verdict": verdict,
    "confidence": confidence,
    "label": int(prediction)
}

print(json.dumps(result))