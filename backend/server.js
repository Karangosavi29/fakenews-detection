const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// Prediction route
app.post('/predict', (req, res) => {
  const { text } = req.body;

  // Validate input
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'No text provided' });
  }

  console.log('📩 Received text for analysis...');

  // Call Python script
  const python = spawn('python', ['predict.py', text]);

  let result = '';
  let errorMsg = '';

  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorMsg += data.toString();
  });

  python.on('close', (code) => {
    if (code !== 0) {
      console.error(' Python error:', errorMsg);
      return res.status(500).json({ error: 'Prediction failed' });
    }

    try {
      const parsed = JSON.parse(result);
      console.log('✅ Prediction:', parsed);
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: 'Invalid response from model' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});