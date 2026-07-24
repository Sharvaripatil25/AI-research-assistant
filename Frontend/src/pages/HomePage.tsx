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

  // Sample default papers if library is empty to match reference mockup
  const displayPapers = papers.length > 0 ? papers : [
    {
      id: 'attention-is-all-you-need',
      title: 'Attention Is All You Need',
      authors: 'Vaswani et al., 2017',
      category: 'Neural Networks',
      timeAgo: '2 days ago'
    },
    {
      id: 'efficientnet',
      title: 'EfficientNet: Rethinking Model Scaling',
      authors: 'Tan & Le, 2019',
      category: 'Computer Vision',
      timeAgo: '3 days ago'
    },
    {
      id: 'gnn-survey',
      title: 'A Survey on Graph Neural Networks',
      authors: 'Zhou et al., 2020',
      category: 'Graph ML',
      timeAgo: '5 days ago'
    },
    {
      id: 'rl-robotics',
      title: 'Reinforcement Learning for Robotics',
      authors: 'Kober et al., 2013',
      category: 'Robotics',
      timeAgo: '1 week ago'
    },
    {
      id: 'bert',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      authors: 'Devlin et al., 2018',
      category: 'NLP',
      timeAgo: '1 week ago'
    }
  ];

  // Sample default continue sessions to match reference mockup
  const displayChats = chatSessions.length > 0 ? chatSessions.map((s, idx) => ({
    id: s.id,
    title: s.title,
    timeAgo: idx === 0 ? '2 hours ago' : idx === 1 ? 'Yesterday' : `${idx + 1} days ago`
  })) : [
    { id: '1', title: 'What are the limitations of Transformer models?', timeAgo: '2 hours ago' },
    { id: '2', title: 'Compare the performance of ResNet and EfficientNet.', timeAgo: 'Yesterday' },
    { id: '3', title: 'Explain the methodology used in EfficientNet.', timeAgo: '2 days ago' },
    { id: '4', title: 'How does attention mechanism work?', timeAgo: '3 days ago' }
  ];

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
          <div className="try-hint-text">
            Try: <span className="hint-clickable" onClick={() => handleAskQuestion('What are the limitations of Transformer models?')}>
              "What are the limitations of Transformer models?"
            </span>
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
            {displayPapers.slice(0, 5).map((paper: any) => (
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
                    {paper.authors} {paper.category ? `• ${paper.category}` : ''}
                  </div>
                </div>
                <div className="paper-row-time">{paper.timeAgo || 'Recent'}</div>
              </div>
            ))}
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
            {displayChats.slice(0, 5).map((chat: any) => (
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
            ))}
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

