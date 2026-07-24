import { useState, useRef, useEffect } from 'react';
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
  const {
    chatSessions,
    activeSessionId,
    activeSession,
    chatMessages,
    isTyping,
    sendMessage,
    startNewChat,
    deleteChatMessage,
    deleteChatSession,
    selectSession,
    papers
  } = useResearch();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

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

        {chatSessions.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
              PAST CHATS ({chatSessions.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '200px', overflowY: 'auto' }}>
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    background: session.id === activeSessionId ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    border: session.id === activeSessionId ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.82rem',
                    color: session.id === activeSessionId ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '0.4rem' }}>
                    💬 {session.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatSession(session.id);
                    }}
                    title="Delete this chat"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      padding: '2px 4px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1rem', fontWeight: 600 }}>SUGGESTED PROMPTS</div>
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
        {/* Chat Area Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.85rem',
            marginBottom: '0.85rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {activeSession ? activeSession.title : 'New AI Research Chat'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
              ● AI Assistant Active ({papers.length} Papers indexed)
            </div>
          </div>

          {activeSessionId && chatMessages.length > 0 && (
            <button
              onClick={() => deleteChatSession(activeSessionId)}
              title="Delete current chat"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
            >
              🗑️ Delete Chat
            </button>
          )}
        </div>

        <div className="chat-messages">
          {chatMessages.length > 0 ? (
            <>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-msg ${msg.sender}`} style={{ position: 'relative' }}>
                  <div className="chat-bubble" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                        {msg.text}
                      </div>
                      <button
                        onClick={() => deleteChatMessage(msg.id)}
                        title="Delete message"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          opacity: 0.6,
                          padding: '0 2px',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                      >
                        ✕
                      </button>
                    </div>

                    {msg.datasets && msg.datasets.length > 0 && (
                      <div style={{ marginTop: '0.6rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Extracted Datasets:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                          {msg.datasets.map((d, i) => (
                            <span key={i} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                              📊 {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Sources:</span>
                        {msg.sources.map((s, i) => (
                          <span key={i} className="citation-chip" onClick={() => navigate('/library')}>📄 {s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-msg assistant">
                  <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span style={{ animation: 'pulse 1s infinite' }}>🤖</span>
                    <span>AI Assistant is analyzing papers & generating RAG synthesis...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
              <h3>Start an AI Chat session</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '0.3rem' }}>Ask questions about your uploaded papers or pick a suggested prompt on the left.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
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
