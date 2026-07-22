import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-mark">✨</div>
          <span className="brand-title" style={{ fontSize: '1.25rem' }}>AI Research Assistant</span>
        </div>

        <ul className="landing-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#about">About</a></li>
        </ul>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <button className="secondary-button" type="button" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="primary-button" type="button" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-badge">
          ⚡ Powered by AI, Designed for Researchers
        </div>

        <h1 className="hero-title">
          Understand Research.<br />
          Discover Insights.
        </h1>

        <p className="hero-subtitle">
          Upload papers, ask questions, compare research, and generate literature reviews with the power of AI.
        </p>

        <div className="hero-actions">
          <button className="primary-button" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/signup')}>
            Get Started For Free
          </button>
          <button className="secondary-button" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }} onClick={() => navigate('/dashboard')}>
            🎬 View Demo
          </button>
        </div>

        <div className="hero-preview-frame">
          <div style={{
            background: 'rgba(13, 14, 29, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '1.5rem',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>📌 DASHBOARD PREVIEW</div>
              <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: '#fff', fontSize: '0.85rem', marginBottom: '0.5rem' }}>🏠 Home</div>
              <div style={{ padding: '0.5rem', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>📚 Library</div>
              <div style={{ padding: '0.5rem', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>💬 AI Chat</div>
              <div style={{ padding: '0.5rem', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>⚖️ Compare</div>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Papers Uploaded</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>128</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Conversations</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>87</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hours Saved</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>36.5h</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recent Upload: Attention Is All You Need</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...</div>
              </div>
            </div>
          </div>
        </div>

        <div id="features" className="landing-features-grid">
          <div className="feature-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>💬</div>
            <h3>AI Chat with Papers</h3>
            <p>Get instant answers with precise inline citations directly from your uploaded PDF collection.</p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚖️</div>
            <h3>Compare Research</h3>
            <p>Side-by-side matrix comparison of model types, datasets, key innovations, and benchmark metrics.</p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>📝</div>
            <h3>Literature Review</h3>
            <p>Generate comprehensive, structured literature reviews on any topic in under 60 seconds.</p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3>Smart Search</h3>
            <p>Semantic vector search across thousands of AI research papers with similarity scores.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
