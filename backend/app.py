from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
print("Loading ML model...")
try:
    model = joblib.load('model.pkl')
    vectorizer = joblib.load('vectorizer.pkl')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    vectorizer = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Verity API is running!",
        "model_loaded": model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json
        text = data.get('text', '')

        if not text.strip():
            return jsonify({"error": "No text provided"}), 400

        X = vectorizer.transform([text])
        prediction = model.predict(X)[0]
        confidence = round(model.predict_proba(X).max() * 100, 1)

        verdict = "FAKE" if prediction == 1 else "REAL"

        print(f"Prediction: {verdict} ({confidence}%)")

        return jsonify({
            "verdict": verdict,
            "confidence": confidence,
            "label": int(prediction)
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)