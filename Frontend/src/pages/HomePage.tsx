import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { papers, chatSessions, user } = useResearch();

  const recentPapers = papers.slice(0, 3);
  const totalHoursSaved = (papers.length * 1.5 + chatSessions.length * 0.5).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Clean Hero Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {user?.name || 'Researcher'} 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Your AI-powered workspace for paper indexing, literature synthesis, and smart context Q&A.
          </p>
        </div>
      </div>

      {/* Sleek Workspace Summary Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => navigate('/library')}
        >
          <span style={{ fontSize: '1.4rem' }}>📄</span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{papers.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Papers Uploaded</div>
          </div>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'rgba(255, 255, 255, 0.08)' }} />

        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => navigate('/chat')}
        >
          <span style={{ fontSize: '1.4rem' }}>💬</span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{chatSessions.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI Conversations</div>
          </div>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'rgba(255, 255, 255, 0.08)' }} />

        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => navigate('/analytics')}
        >
          <span style={{ fontSize: '1.4rem' }}>⏱️</span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{totalHoursSaved}h</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Research Time Saved</div>
          </div>
        </div>
      </div>

      {/* 3 Quick Action Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.25rem' }}>
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(13, 14, 29, 0.6) 100%)'
          }}
          onClick={() => navigate('/upload')}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📤</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Upload Paper</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Select or drag & drop PDF papers to index vectors and extract citations.
          </p>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(13, 14, 29, 0.6) 100%)'
          }}
          onClick={() => navigate('/chat')}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>AI Research Chat</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Ask natural language questions across all papers in your workspace.
          </p>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(13, 14, 29, 0.6) 100%)'
          }}
          onClick={() => navigate('/review')}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Literature Review</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Synthesize comprehensive literature reviews across selected research papers.
          </p>
        </div>
      </div>

      {/* Recent Activity Panel */}
      {papers.length > 0 ? (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
          <div className="panel-header" style={{ marginBottom: '1rem' }}>
            <h3 className="panel-title" style={{ fontSize: '1rem', fontWeight: 700 }}>
              Recent Research Papers ({papers.length})
            </h3>
            <button className="link-btn" onClick={() => navigate('/library')}>
              View Library →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {recentPapers.map((paper) => (
              <div
                key={paper.id}
                className="paper-list-item"
                onClick={() => navigate(`/library/${paper.id}`)}
                style={{ cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}
              >
                <div className="paper-info">
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>{paper.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {paper.authors} ({paper.year}) &nbsp;•&nbsp; {paper.publishedIn}
                  </p>
                </div>
                <span className="time-stamp" style={{ fontSize: '0.75rem' }}>View Paper →</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div style={{ fontSize: '2.5rem' }}>📁</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Workspace is Ready</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px' }}>
            Upload your first research paper to start generating vector embeddings, running AI chats, and synthesizing reviews.
          </p>
          <button
            className="primary-button"
            style={{ marginTop: '0.5rem', padding: '0.65rem 1.75rem', fontSize: '0.88rem' }}
            onClick={() => navigate('/upload')}
          >
            📤 Upload Paper Now
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
