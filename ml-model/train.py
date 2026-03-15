import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

print("📂 Loading LIAR dataset...")

# Load all 3 LIAR files
train_df = pd.read_csv('train.tsv', sep='\t', header=None)
test_df  = pd.read_csv('test.tsv',  sep='\t', header=None)
valid_df = pd.read_csv('valid.tsv', sep='\t', header=None)

# Combine all
liar = pd.concat([train_df, test_df, valid_df])

# Column 2 = text, Column 1 = label
liar = liar[[2, 1]]
liar.columns = ['text', 'label']

# Convert 6 labels → 2 labels (REAL=0, FAKE=1)
# Removed unclear labels (half-true, barely-true) for better accuracy
def convert_label(label):
    if label in ['true', 'mostly-true']:
        return 0  # REAL
    elif label in ['false', 'pants-fire']:
        return 1  # FAKE
    else:
        return None  # Remove unclear labels

liar['label'] = liar['label'].apply(convert_label)
liar = liar.dropna(subset=['label'])
liar['label'] = liar['label'].astype(int)

print(f"✅ LIAR dataset loaded: {len(liar)} articles")
print(f"   🟢 Real: {len(liar[liar.label==0])}")
print(f"   🔴 Fake: {len(liar[liar.label==1])}")

# ── Load ISOT Political Dataset ──
print("\n📂 Loading ISOT political dataset...")
try:
    fake_political = pd.read_csv('Fake.csv')
    real_political = pd.read_csv('True.csv')
    fake_political['text'] = fake_political['title'] + ' ' + fake_political['text']
    real_political['text'] = real_political['title'] + ' ' + real_political['text']
    fake_political['label'] = 1
    real_political['label'] = 0
    isot = pd.concat([fake_political, real_political])[['text', 'label']]
    print(f"✅ ISOT dataset loaded: {len(isot)} articles")
except:
    isot = pd.DataFrame(columns=['text', 'label'])
    print("⚠️ ISOT not found, using LIAR only...")

# ── Load Custom Health News ──
print("\n📂 Loading custom health dataset...")
try:
    custom = pd.read_csv('custom_news.csv')
    custom = pd.concat([custom] * 10)  # repeat for more weight
    print(f"✅ Custom health news loaded: {len(custom)} articles")
except:
    custom = pd.DataFrame(columns=['text', 'label'])
    print("⚠️ Custom dataset not found, skipping...")

# ── FIXED: Combine All Datasets (split into separate lines) ──
df = pd.concat([liar, isot, custom])
df = df.dropna()
df = df.sample(frac=1, random_state=42)  # shuffle

print(f"\n📊 TOTAL COMBINED DATASET:")
print(f"   Total : {len(df)}")
print(f"   🟢 Real: {len(df[df.label==0])}")
print(f"   🔴 Fake: {len(df[df.label==1])}")

# ── Train/Test Split ──
X_train, X_test, y_train, y_test = train_test_split(
    df['text'], df['label'],
    test_size=0.2,
    random_state=42
)

# ── TF-IDF Vectorizer ──
print("\n🔄 Converting text to numbers (TF-IDF)...")
vectorizer = TfidfVectorizer(
    max_features=15000,
    stop_words='english',
    ngram_range=(1, 2),
    min_df=2
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec  = vectorizer.transform(X_test)

# ── Train Model ──
print("🧠 Training ML model...")
model = LogisticRegression(max_iter=1000, C=2.0)
model.fit(X_train_vec, y_train)

# ── Accuracy ──
predictions = model.predict(X_test_vec)
accuracy = accuracy_score(y_test, predictions)
print(f"\n🎯 Model Accuracy: {round(accuracy * 100, 2)}%")
print("\n📋 Detailed Report:")
print(classification_report(y_test, predictions, target_names=['REAL', 'FAKE']))

# ── Save Model ──
joblib.dump(model, 'model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
print("💾 model.pkl and vectorizer.pkl saved!")
print("✅ Training complete!")