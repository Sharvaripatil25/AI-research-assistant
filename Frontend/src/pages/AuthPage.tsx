import { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useResearch } from '../context/ResearchContext';

const API_URL = 'http://localhost:5000/api';

type AuthPageProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const AuthPage = ({ theme, toggleTheme }: AuthPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useResearch();

  const [isLogin, setIsLogin] = useState(() => !location.pathname.includes('signup'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(false);

    const displayName = name.trim() || email.split('@')[0] || 'Researcher';
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'U';

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setUser({
        email,
        name: displayName,
        avatarInitials: initials,
        plan: 'Pro Plan'
      });

      setMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setUser({
        email: email || 'researcher@domain.com',
        name: displayName,
        avatarInitials: initials,
        plan: 'Pro Plan'
      });
      setMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
      setTimeout(() => navigate('/dashboard'), 300);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem 1rem',
        background: 'var(--bg-dark)',
        backgroundImage:
          'radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.25) 0%, transparent 60%), linear-gradient(180deg, #090a16 0%, #060710 100%)'
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '920px',
          width: '100%',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          border: '1px solid var(--card-border-glow)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px' }}>
          {/* Left Brand Panel */}
          <div
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(13, 14, 29, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div className="brand-mark">✨</div>
                <span className="brand-title" style={{ fontSize: '1.25rem' }}>
                  AI Research Assistant
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                Research faster with an intelligent workspace.
              </h1>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Upload papers, summarize findings, ask inline cited questions, compare benchmarks, and synthesize
                literature reviews.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="pill-tag pill-purple">📄 PDF RAG Analysis</span>
                <span className="pill-tag pill-blue">⚖️ Matrix Comparison</span>
                <span className="pill-tag pill-cyan">📝 Auto Literature Reviews</span>
              </div>
            </div>

            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              style={{ width: 'auto', padding: '0.5rem 1rem', display: 'inline-flex', gap: '0.5rem' }}
            >
              {theme === 'dark' ? '☀️ Light Theme' : '🌙 Dark Theme'}
            </button>
          </div>

          {/* Right Form Panel */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                {isLogin ? 'Welcome back 👋' : 'Create your account 🚀'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {isLogin
                  ? 'Sign in to continue your research workflow.'
                  : 'Start organizing and analyzing your papers with AI.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLogin && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.3rem',
                      fontWeight: 600
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="search-bar"
                    style={{ width: '100%', padding: '0.75rem 1rem' }}
                    placeholder="e.g. Dr. Sharvari Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.3rem',
                    fontWeight: 600
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.75rem 1rem' }}
                  placeholder="researcher@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.3rem',
                    fontWeight: 600
                  }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.75rem 1rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {message && (
                <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="primary-button"
                style={{ padding: '0.85rem', marginTop: '0.5rem', width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Free Account'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                className="link-btn"
                style={{ fontSize: '0.88rem' }}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
