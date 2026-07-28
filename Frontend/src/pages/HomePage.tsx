import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import {
  UploadCloud,
  FileText,
  MessageSquare,
  ArrowRight,
  Scale,
  Upload,
  BookOpen
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { papers, chatSessions, user, sendMessage } = useResearch();
  const [bannerQuery, setBannerQuery] = useState('');

  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const userName = user?.name ? user.name.split(' ')[0] : 'Arjun';

  const handleAskQuestion = (queryText?: string) => {
    const q = queryText || bannerQuery;
    if (!q.trim()) return;
    sendMessage(q);
    navigate('/chat');
  };

  const displayPapers = papers;
  const displayChats = chatSessions.map((s, idx) => ({
    id: s.id,
    title: s.title,
    timeAgo: s.createdAt || (idx === 0 ? 'Today' : 'Recently')
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Header Greeting */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
          {timeGreeting}, {userName}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
          Let's make your research smarter today.
        </p>
      </div>

      {/* Split Top Action Banner */}
      <div className="banner-split-card">
        {/* Left: Drag & Drop Upload */}
        <div className="banner-left-area" onClick={() => navigate('/upload')}>
          <div className="cloud-icon-circle">
            <UploadCloud size={22} color="var(--accent-purple)" />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Upload papers to your library
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Drag & drop your PDF files here or <span className="browse-link">browse</span>
            </div>
          </div>
        </div>

        {/* Center OR Divider */}
        <div className="banner-divider">
          <span className="or-badge">OR</span>
        </div>

        {/* Right: Ask Question Search Bar */}
        <div className="banner-right-area">
          <div className="query-input-bar">
            <input
              type="text"
              placeholder="Ask a question about your papers..."
              value={bannerQuery}
              onChange={(e) => setBannerQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button className="send-query-btn" onClick={() => handleAskQuestion()} title="Ask AI">
              <ArrowRight size={16} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Recent Papers */}
        <div className="dashboard-card-panel">
          <div className="card-panel-header">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Recent Papers
            </h3>
            <button className="view-all-btn" onClick={() => navigate('/library')}>
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {displayPapers.length > 0 ? (
              displayPapers.slice(0, 5).map((paper: any) => (
                <div
                  key={paper.id}
                  className="recent-paper-row"
                  onClick={() => navigate('/library')}
                >
                  <div className="pdf-icon-badge">
                    <FileText size={16} color="#ef4444" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="paper-row-title">{paper.title}</div>
                    <div className="paper-row-sub">
                      {paper.authors} {paper.publishedIn ? `• ${paper.publishedIn}` : ''}
                    </div>
                  </div>
                  <div className="paper-row-time">{paper.year || 'Recent'}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <BookOpen size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>No papers uploaded yet</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '1rem' }}>Add PDF papers or search arXiv to start building your library.</div>
                <button className="primary-button" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }} onClick={() => navigate('/upload')}>
                  + Upload Paper
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Continue Where You Left Off */}
        <div className="dashboard-card-panel">
          <div className="card-panel-header">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Continue where you left off
            </h3>
            <button className="view-all-btn" onClick={() => navigate('/chat')}>
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {displayChats.length > 0 ? (
              displayChats.slice(0, 5).map((chat: any) => (
                <div
                  key={chat.id}
                  className="recent-paper-row"
                  onClick={() => navigate('/chat')}
                >
                  <div className="chat-icon-badge">
                    <MessageSquare size={16} color="var(--accent-purple)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="paper-row-title">{chat.title}</div>
                  </div>
                  <div className="paper-row-time">{chat.timeAgo || 'Today'}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>No active chat sessions</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '1rem' }}>Ask a question above to start an AI research conversation.</div>
                <button className="secondary-button" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }} onClick={() => navigate('/chat')}>
                  Start New Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom 4 Quick Action Tool Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        {/* Tool 1 */}
        <div className="quick-action-card" onClick={() => navigate('/upload')}>
          <div className="action-card-header">
            <div className="action-card-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }}>
              <Upload size={18} />
            </div>
            <ArrowRight className="arrow-indicator" size={16} />
          </div>
          <div className="action-card-title">Upload Paper</div>
          <div className="action-card-desc">Add new research papers to your library</div>
        </div>

        {/* Tool 2 */}
        <div className="quick-action-card" onClick={() => navigate('/chat')}>
          <div className="action-card-header">
            <div className="action-card-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
              <MessageSquare size={18} />
            </div>
            <ArrowRight className="arrow-indicator" size={16} />
          </div>
          <div className="action-card-title">AI Chat</div>
          <div className="action-card-desc">Ask questions and get AI-powered answers</div>
        </div>

        {/* Tool 3 */}
        <div className="quick-action-card" onClick={() => navigate('/compare')}>
          <div className="action-card-header">
            <div className="action-card-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
              <Scale size={18} />
            </div>
            <ArrowRight className="arrow-indicator" size={16} />
          </div>
          <div className="action-card-title">Compare Papers</div>
          <div className="action-card-desc">Compare multiple papers side by side</div>
        </div>

        {/* Tool 4 */}
        <div className="quick-action-card" onClick={() => navigate('/review')}>
          <div className="action-card-header">
            <div className="action-card-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
              <FileText size={18} />
            </div>
            <ArrowRight className="arrow-indicator" size={16} />
          </div>
          <div className="action-card-title">Literature Review</div>
          <div className="action-card-desc">Generate comprehensive literature reviews</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

