import { useNavigate } from 'react-router-dom';
import { BookOpen, Sun, Moon, MessageSquare, Scale, FileText, Search, ArrowRight, Play } from 'lucide-react';

type LandingPageProps = {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
};

const LandingPage = ({ theme = 'dark', toggleTheme }: LandingPageProps) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
        transition: 'background-color 0.25s ease',
        overflowX: 'hidden',
        width: '100%'
      }}
    >
      {/* Sticky Top Navbar */}
      <header
        className="landing-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-sidebar)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'var(--card-shadow)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div className="brand-mark">
              <BookOpen size={18} />
            </div>
            <span className="brand-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              AI Research Assistant
            </span>
          </div>

          <nav className="desktop-only-nav" style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>
              Features
            </a>
          </nav>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {toggleTheme && (
            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              style={{ width: '34px', height: '34px' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <button
            className="secondary-button"
            type="button"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
          <button
            className="primary-button"
            type="button"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3.5rem 1.25rem 2.5rem', textAlign: 'center', boxSizing: 'border-box' }}>
        <div className="hero-badge" style={{ margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
          <span>Powered by AI</span> • <span>Designed for Researchers</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Understand Research.<br />
          Discover Insights.
        </h1>

        <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Upload papers, ask questions, compare research, and generate literature reviews with the power of AI.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button className="primary-button" style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem' }} onClick={() => navigate('/signup')}>
            <span>Get Started For Free</span>
            <ArrowRight size={16} />
          </button>
          <button className="secondary-button" style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }} onClick={() => navigate('/dashboard')}>
            <Play size={15} />
            <span>View Demo</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-tint)', color: 'var(--accent-purple)', display: 'grid', placeItems: 'center', marginBottom: '0.85rem' }}>
              <MessageSquare size={19} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
              AI Chat with Papers
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Get instant answers with precise inline citations directly from your uploaded PDF collection.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-tint)', color: 'var(--accent-purple)', display: 'grid', placeItems: 'center', marginBottom: '0.85rem' }}>
              <Scale size={19} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
              Compare Research
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Side-by-side matrix comparison of model types, datasets, key innovations, and benchmark metrics.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-tint)', color: 'var(--accent-purple)', display: 'grid', placeItems: 'center', marginBottom: '0.85rem' }}>
              <FileText size={19} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
              Literature Review
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Generate comprehensive, structured literature reviews on any topic in under 60 seconds.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-tint)', color: 'var(--accent-purple)', display: 'grid', placeItems: 'center', marginBottom: '0.85rem' }}>
              <Search size={19} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
              Smart Search
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Semantic vector search across AI research papers with instant relevance scores.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
