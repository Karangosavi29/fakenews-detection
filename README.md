# VERITY — Fake News Detection System

![ML](https://img.shields.io/badge/ML-Scikit--learn-orange)
![Frontend](https://img.shields.io/badge/Frontend-React.js-blue)
![Backend](https://img.shields.io/badge/Backend-Python%20Flask-green)
![Accuracy](https://img.shields.io/badge/Accuracy-90.04%25-brightgreen)
![Deployed](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-black)

> An AI-powered web application that detects whether a news article is **FAKE** or **REAL** using Machine Learning.

🔗 **Live Demo:** https://fakenews-detection-zeta.vercel.app  
🔗 **API:** https://fakenews-detection-9g59.onrender.com

---

## 📌 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Datasets](#datasets)
- [ML Model](#ml-model)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Results](#results)

---

## 📖 About

VERITY is a full-stack fake news detection web application built from scratch. It uses a Logistic Regression model trained on 57,849 labeled news articles to classify news as FAKE or REAL with a confidence percentage.

---

## ✨ Features

- Paste any news headline or article text
- Instant FAKE / REAL verdict with confidence score
- 4 example news items to test quickly
- Dark cyber-themed React UI
- REST API backend using Python Flask
- Fully deployed and live on the internet

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, CSS3 |
| Backend | Python Flask, flask-cors |
| ML Library | Scikit-learn |
| Algorithm | Logistic Regression |
| Text Processing | TF-IDF Vectorizer |
| Model Storage | joblib (.pkl files) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render.com |
| Version Control | Git + GitHub |

---

## 📊 Datasets

### 1. ISOT Fake News Dataset
- **Source:** Kaggle
- **Size:** 44,898 articles
- **Topic:** Political news
- **Files:** `Fake.csv`, `True.csv`
- **Real news source:** Reuters

### 2. LIAR Dataset
- **Source:** GitHub (UCSB NLP Lab)
- **Size:** 12,791 statements
- **Topic:** All topics (politics, health, science, economy)
- **Files:** `train.tsv`, `test.tsv`, `valid.tsv`
- **Labels used:** true, mostly-true → REAL | false, pants-fire → FAKE
- **Labels removed:** half-true, barely-true (unclear)

### 3. Custom Health Dataset
- **Source:** Manually created
- **Size:** 160 entries (16 × 10 repeats)
- **Topic:** Health news (fake and real)
- **File:** `custom_news.csv`

### Combined Total

| Dataset | Articles |
|---------|----------|
| ISOT | 44,898 |
| LIAR | 12,791 |
| Custom Health | 160 |
| **TOTAL** | **57,849** |

---

## 🧠 ML Model

### Algorithm
**Logistic Regression** from scikit-learn

### Why Logistic Regression?
- Works excellently for text classification
- Fast to train on large datasets
- Gives probability scores for confidence %
- Easy to interpret and explain

### Training Pipeline

```
1. Load Data      → ISOT + LIAR + Custom datasets
2. Preprocess     → Remove nulls, combine title + text
3. Label Convert  → true/mostly-true = REAL (0)
                    false/pants-fire = FAKE (1)
4. TF-IDF         → 15,000 features, ngram(1,2)
5. Train          → LogisticRegression(C=2.0, max_iter=1000)
6. Evaluate       → 90.04% accuracy
7. Save           → model.pkl + vectorizer.pkl
```

### Model Performance

| Metric | Score |
|--------|-------|
| Overall Accuracy | 90.04% |
| REAL Precision | 89% |
| FAKE Precision | 91% |
| F1 Score | 90% |

---

## 📁 Project Structure

```
fake-news-project/
├── ml-model/
│   ├── train.py            ← Train the ML model
│   ├── Fake.csv            ← ISOT fake news
│   ├── True.csv            ← ISOT real news
│   ├── train.tsv           ← LIAR dataset
│   ├── test.tsv            ← LIAR dataset
│   ├── valid.tsv           ← LIAR dataset
│   ├── custom_news.csv     ← Custom health dataset
│   ├── model.pkl           ← Saved trained model
│   └── vectorizer.pkl      ← Saved TF-IDF vectorizer
│
├── backend/
│   ├── app.py              ← Python Flask API (main)
│   ├── requirements.txt    ← Python dependencies
│   ├── model.pkl           ← Copy of trained model
│   ├── vectorizer.pkl      ← Copy of vectorizer
│   ├── server.js           ← Old Node.js (not used)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js          ← Main React component
│   │   └── App.css         ← Styling
│   ├── public/
│   │   └── index.html
│   ├── vercel.json         ← Vercel config
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Python 3.11+
- Node.js 20+
- Git

### Step 1 — Clone Repository
```bash
git clone https://github.com/Karangosavi29/fakenews-detection.git
cd fakenews-detection
```

### Step 2 — Train ML Model
```bash
cd ml-model
pip install scikit-learn pandas numpy joblib
python train.py
```

### Step 3 — Run Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at: `http://localhost:5000`

### Step 4 — Run Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

---

## ⚙️ How It Works

```
User pastes news text
        ↓
React Frontend (Vercel)
        ↓ POST /predict
Python Flask API (Render)
        ↓ loads model.pkl
TF-IDF Vectorizer converts text → numbers
        ↓
Logistic Regression predicts
        ↓
Returns { verdict, confidence }
        ↓
React shows FAKE / REAL result
```

---

## 📡 API Reference

### POST /predict

**Request:**
```json
{
  "text": "Your news article text here"
}
```

**Response:**
```json
{
  "verdict": "FAKE",
  "confidence": 94.2,
  "label": 1
}
```

**Verdict values:**
- `FAKE` → label: 1
- `REAL` → label: 0

---

## 🌐 Deployment

### Frontend — Vercel
| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |

### Backend — Render
| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `python app.py` |

### Environment Variable (Vercel)
```
REACT_APP_API_URL = https://fakenews-detection-9g59.onrender.com
```

---

## ✅ Results

| Test News | Expected | Result |
|-----------|----------|--------|
| "Obama secretly funded terrorist organizations" | FAKE | ✅ FAKE |
| "Senate passes healthcare bill with bipartisan support" | REAL | ✅ REAL |
| "5G towers are government mind control devices" | FAKE | ✅ FAKE |
| "Federal Reserve raises interest rates by 25 basis points" | REAL | ✅ REAL |

---

## 👨‍💻 Developer

**Karan Gosavi**
- GitHub: [@Karangosavi29](https://github.com/Karangosavi29)
- Project: [fakenews-detection](https://github.com/Karangosavi29/fakenews-detection)

---

## 📜 License

This project is for educational purposes only.  
Always verify news with trusted sources before believing or sharing.

---

> Built with Python, React, and Machine Learning
