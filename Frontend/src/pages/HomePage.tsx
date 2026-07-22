import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { papers, chatMessages, user } = useResearch();

  const recentPapers = papers.slice(0, 4);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Welcome back, {user?.name || 'Researcher'} 👋</h1>
          <p>Here's what's happening with your research today.</p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="stats-grid">
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/library')}>
          <div className="metric-header">
            <span className="metric-label">Papers Uploaded</span>
            <div className="metric-icon">📄</div>
          </div>
          <div className="metric-value">{papers.length}</div>
          <div className="metric-trend">↑ +12 this week</div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/chat')}>
          <div className="metric-header">
            <span className="metric-label">Conversations</span>
            <div className="metric-icon">💬</div>
          </div>
          <div className="metric-value">{chatMessages.length > 0 ? chatMessages.length : 87}</div>
          <div className="metric-trend">↑ +8 this week</div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/review')}>
          <div className="metric-header">
            <span className="metric-label">Literature Reviews</span>
            <div className="metric-icon">📝</div>
          </div>
          <div className="metric-value">15</div>
          <div className="metric-trend">↑ +2 this week</div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/analytics')}>
          <div className="metric-header">
            <span className="metric-label">Hours Saved</span>
            <div className="metric-icon">⏱️</div>
          </div>
          <div className="metric-value">36.5</div>
          <div className="metric-trend">↑ +12.5h this week</div>
        </div>
      </div>

      {/* Main Grid: Recent Papers & Continue Chat */}
      <div className="dashboard-grid">
        <div className="glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Papers</h3>
            <button className="link-btn" onClick={() => navigate('/library')}>View all</button>
          </div>

          {recentPapers.map((paper) => (
            <div key={paper.id} className="paper-list-item" onClick={() => navigate(`/library/${paper.id}`)} style={{ cursor: 'pointer' }}>
              <div className="paper-info">
                <h4>{paper.title}</h4>
                <p>
                  {paper.authors} ({paper.year}) &nbsp;•&nbsp;{' '}
                  {paper.tags.map((t, idx) => (
                    <span key={idx} className="pill-tag pill-purple" style={{ marginRight: '4px' }}>{t}</span>
                  ))}
                </p>
              </div>
              <span className="time-stamp">Recently</span>
            </div>
          ))}
        </div>

        <div className="glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">Continue Chat</h3>
            <button className="link-btn" onClick={() => navigate('/chat')}>View all</button>
          </div>

          {chatMessages.length > 0 ? (
            chatMessages.slice(-3).map((msg) => (
              <div key={msg.id} className="chat-preview-item" onClick={() => navigate('/chat')} style={{ cursor: 'pointer' }}>
                <p><strong>{msg.sender === 'user' ? 'You:' : 'AI:'}</strong> {msg.text}</p>
                <span className="time-stamp">{msg.timestamp}</span>
              </div>
            ))
          ) : (
            <div className="chat-preview-item" onClick={() => navigate('/chat')} style={{ cursor: 'pointer' }}>
              <p>What datasets are used in these papers?</p>
              <span className="time-stamp">2 hours ago</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Actions
        </h4>
        <div className="quick-actions-bar">
          <button className="quick-action-btn" onClick={() => navigate('/upload')}>
            <span>📤</span> Upload Paper
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/chat')}>
            <span>💬</span> Start AI Chat
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/compare')}>
            <span>⚖️</span> Compare Papers
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/review')}>
            <span>📝</span> Literature Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
