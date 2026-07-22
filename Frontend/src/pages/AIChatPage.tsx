import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

const suggestedPrompts = [
  'What datasets are commonly used in these papers?',
  'Explain the transformer architecture.',
  'Compare GNN models.',
  'How does EfficientNet work?'
];

const AIChatPage = () => {
  const navigate = useNavigate();
  const { chatMessages, sendMessage, startNewChat, papers } = useResearch();
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;
    sendMessage(messageText);
    if (!textToSend) setInput('');
  };

  return (
    <div className="chat-layout">
      {/* Left Chat History Sidebar */}
      <div className="chat-history-sidebar">
        <button className="new-chat-btn" onClick={startNewChat}>+ New Chat</button>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>SUGGESTED PROMPTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
          {suggestedPrompts.map((prompt, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleSend(prompt)}
            >
              💬 {prompt}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main-area">
        <div className="chat-messages">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                <div className="chat-bubble">
                  <p>{msg.text}</p>

                  {msg.datasets && (
                    <ul style={{ margin: '0.75rem 0', paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {msg.datasets.map((d, i) => (
                        <li key={i} style={{ marginBottom: '0.3rem' }}>{d}</li>
                      ))}
                    </ul>
                  )}

                  {msg.sources && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sources:</span>
                      {msg.sources.map((s, i) => (
                        <span key={i} className="citation-chip" onClick={() => navigate('/library')}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
              <h3>Start an AI Chat session</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '0.3rem' }}>Ask questions about your uploaded papers or pick a suggested prompt on the left.</p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="chat-input-container">
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/upload')} title="Upload paper context">📎</span>
          <input
            type="text"
            placeholder="Ask a follow-up question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="primary-button" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => handleSend()}>
            Send
          </button>
        </div>
      </div>

      {/* Right Sources Sidebar */}
      <div className="sources-panel">
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Workspace Sources ({papers.length})</h4>

        {papers.slice(0, 3).map((paper, idx) => (
          <div key={paper.id} className="source-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/library/${paper.id}`)}>
            <div className="match-score">{98 - idx * 4}% match</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>{paper.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{paper.authors} ({paper.year})</div>
          </div>
        ))}

        <button className="secondary-button" style={{ marginTop: 'auto', fontSize: '0.8rem', padding: '0.5rem' }} onClick={() => navigate('/library')}>
          View all sources ({papers.length})
        </button>
      </div>
    </div>
  );
};

export default AIChatPage;
