import { useState } from 'react';
import './App.css';

const EXAMPLES = [
  "Obama secretly funded terrorist organizations using taxpayer money",
  "Senate passes new healthcare bill with bipartisan support in Congress",
  "5G towers are government mind control devices installed by billionaires",
  "Study finds daily walking significantly reduces risk of heart disease",
];
function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


      
   const response = await fetch(`${API_URL}/predict`, {

REACT_APP_API_URL = https://your-backend-url.com
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError('❌ Could not connect to server. Make sure backend is running!');
    }

    setLoading(false);
  };

  // Color config based on verdict
  const getConfig = (verdict) => {
    if (verdict === 'FAKE') return {
      color: '#ff2d55',
      bg: 'rgba(255,45,85,0.12)',
      border: '2px solid #ff2d55',
      icon: '✗',
      label: 'FAKE NEWS',
    };
    return {
      color: '#00e5a0',
      bg: 'rgba(0,229,160,0.1)',
      border: '2px solid #00e5a0',
      icon: '✓',
      label: 'CREDIBLE NEWS',
    };
  };

  const cfg = result ? getConfig(result.verdict) : null;

  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <h1>VERITY</h1>
        <p>AI-POWERED FAKE NEWS DETECTOR</p>
        <div className="status">
          <span className="status-dot" />
          ML MODEL ACTIVE
        </div>
      </div>

      {/* Input Panel */}
      <div className="panel">
        <div className="panel-title">INPUT NEWS TEXT</div>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a news headline or article text here..."
        />

        {/* Example buttons */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(200,216,232,0.35)', marginBottom: 8 }}>
            TRY EXAMPLES:
          </div>
          <div className="examples">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="example-btn"
                onClick={() => setText(ex)}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          className="analyze-btn"
          onClick={analyze}
          disabled={!text.trim() || loading}
        >
          {loading ? '⏳ ANALYZING...' : '▶  ANALYZE NEWS'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(255,45,85,0.1)',
          border: '1px solid rgba(255,45,85,0.4)',
          borderRadius: 6,
          padding: 16,
          fontSize: 12,
          color: '#ff2d55',
          marginBottom: 20,
          letterSpacing: 1,
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="panel loading">
          <div className="loading-text">
            ◉ SCANNING TEXT...<br /><br />
            ANALYZING PATTERNS<br />
            CHECKING CREDIBILITY<br />
            RUNNING ML MODEL
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !result && !error && (
        <div className="panel empty">
          ◎<br /><br />
          AWAITING INPUT<br />
          Paste news text above and click ANALYZE
        </div>
      )}

      {/* Result */}
      {!loading && result && cfg && (
        <div className="panel" style={{ border: cfg.border }}>
          <div className="panel-title">ANALYSIS RESULT</div>

          {/* Verdict Badge */}
          <div className="verdict-badge" style={{
            background: cfg.bg,
            border: cfg.border,
          }}>
            <span className="verdict-icon" style={{ color: cfg.color }}>
              {cfg.icon}
            </span>
            <span className="verdict-label" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>

          {/* Confidence */}
          <div className="conf-row">
            <span style={{ color: 'rgba(200,216,232,0.4)' }}>CONFIDENCE SCORE</span>
            <span style={{ color: cfg.color, fontWeight: 900 }}>
              {result.confidence}%
            </span>
          </div>
          <div className="conf-bar-bg">
            <div
              className="conf-bar"
              style={{
                width: `${result.confidence}%`,
                background: cfg.color,
                boxShadow: `0 0 10px ${cfg.color}`,
              }}
            />
          </div>

          {/* Summary */}
          <div className="summary">
            This article was classified as <strong style={{ color: cfg.color }}>
              {result.verdict}
            </strong> with <strong>{result.confidence}%</strong> confidence
            by the trained ML model.
          </div>

          {/* Verdict Details */}
          {result.verdict === 'FAKE' && (
            <>
              <div className="flags-title" style={{ color: '#ff2d55' }}>
                ⚠ WHY IT MAY BE FAKE
              </div>
              {[
                'Sensational or exaggerated language detected',
                'Claims may lack verifiable sources',
                'Pattern matches known fake news articles',
              ].map((f, i) => (
                <div key={i} className="flag-item">
                  <span className="flag-dot" style={{ background: '#ff2d55' }} />
                  {f}
                </div>
              ))}
            </>
          )}

          {result.verdict === 'REAL' && (
            <>
              <div className="flags-title" style={{ color: '#00e5a0' }}>
                ✓ CREDIBILITY INDICATORS
              </div>
              {[
                'Neutral and factual language patterns',
                'Writing style matches credible news sources',
                'No sensationalist patterns detected',
              ].map((f, i) => (
                <div key={i} className="flag-item">
                  <span className="flag-dot" style={{ background: '#00e5a0' }} />
                  {f}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        VERITY v1.0 — Always verify news with trusted sources
      </div>

    </div>
  );
}

export default App;