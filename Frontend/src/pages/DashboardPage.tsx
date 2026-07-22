import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type DashboardPageProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const API_URL = 'http://localhost:5000';

type PaperItem = {
  id: number;
  name: string;
  uploadedAt: string;
  summary: string;
  category: string;
  metadata: string[];
};

const DashboardPage = ({ theme, toggleTheme }: DashboardPageProps) => {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const accepted = Array.from(files).filter((file) => file.type === 'application/pdf');
    if (!accepted.length) {
      return;
    }

    const nextPapers = accepted.map((file, index) => {
      const category = index % 2 === 0 ? 'Machine Learning' : 'Research Methods';
      const metadata = index % 2 === 0 ? ['Methodology', 'Results', 'Limitations'] : ['Dataset', 'Experiment', 'Conclusion'];

      return {
        id: Date.now() + index,
        name: file.name,
        uploadedAt: new Date().toLocaleString(),
        summary: `Auto-generated summary: this paper is ready for AI-assisted extraction of methods, findings, and limitations.`,
        category,
        metadata
      };
    });

    setPapers((current) => [...nextPapers, ...current]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const displayName = user?.email?.split('@')[0] ?? 'researcher';
  const paperCount = useMemo(() => papers.length, [papers]);
  const comparisonPapers = useMemo(() => papers.filter((paper) => selectedPaperIds.includes(paper.id)), [papers, selectedPaperIds]);
  const comparisonSummary = useMemo(() => {
    if (comparisonPapers.length !== 2) {
      return '';
    }

    const [firstPaper, secondPaper] = comparisonPapers;
    const sharedThemes = firstPaper.metadata.filter((item) => secondPaper.metadata.includes(item));
    const uniqueThemes = [
      ...firstPaper.metadata.filter((item) => !secondPaper.metadata.includes(item)),
      ...secondPaper.metadata.filter((item) => !firstPaper.metadata.includes(item))
    ];

    const sharedText = sharedThemes.length ? `Both papers emphasize ${sharedThemes.join(', ')}.` : 'Both papers share a strong research focus.';
    const uniqueText = uniqueThemes.length
      ? `They diverge around ${uniqueThemes.join(', ')}.`
      : 'Their emphasis stays closely aligned.';

    return `${sharedText} ${uniqueText} ${firstPaper.category} and ${secondPaper.category} are presented as complementary perspectives.`;
  }, [comparisonPapers]);

  const togglePaperSelection = (paperId: number) => {
    setSelectedPaperIds((current) => {
      if (current.includes(paperId)) {
        return current.filter((id) => id !== paperId);
      }

      return current.length < 2 ? [...current, paperId] : current;
    });
  };

  const handleAsk = () => {
    if (!question.trim()) return;

    const trimmedQuestion = question.trim();
    setMessages((current) => [...current, { role: 'user', content: trimmedQuestion }]);

    const fallbackResponse = papers.length > 0
      ? `I can analyze ${papers.length} uploaded paper${papers.length > 1 ? 's' : ''} for: “${trimmedQuestion}”. This is where the AI-assisted answer will appear once the backend model is connected.`
      : `I can help answer questions about your research library once papers are uploaded. Your question was: “${trimmedQuestion}”.`;

    setMessages((current) => [...current, { role: 'assistant', content: fallbackResponse }]);
    setQuestion('');
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Research workspace</p>
          <h1>Welcome back, {displayName}.</h1>
          <p className="hero-copy">Upload papers, organize your corpus, and prepare them for AI-powered analysis.</p>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            className="ghost-button"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{paperCount}</h3>
          <p>Uploaded papers</p>
        </div>
        <div className="stat-card">
          <h3>{paperCount > 0 ? 'Ready' : 'Pending'}</h3>
          <p>Processing status</p>
        </div>
        <div className="stat-card">
          <h3>Live</h3>
          <p>AI insights</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel upload-panel">
          <div
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <h3>Upload research papers</h3>
            <p>Drag and drop PDF files here or browse from your device.</p>
            <label className="primary-button upload-button">
              Choose PDF files
              <input type="file" accept="application/pdf" multiple onChange={handleInputChange} />
            </label>
          </div>
        </section>

        <section className="panel">
          <h3>Next actions</h3>
          <ul className="panel-list">
            <li>Upload your first paper</li>
            <li>Ask a question across your library</li>
            <li>Compare two studies side by side</li>
          </ul>
        </section>
      </div>

      <section className="panel papers-panel">
        <div className="panel-heading">
          <h3>Paper library</h3>
          <span>{paperCount} papers</span>
        </div>

        {paperCount === 0 ? (
          <div className="empty-state">
            <p>No papers uploaded yet. Start by dragging in your first PDF.</p>
          </div>
        ) : (
          <div className="paper-list">
            {papers.map((paper) => {
              const isSelected = selectedPaperIds.includes(paper.id);
              return (
                <article className={`paper-card ${isSelected ? 'selected' : ''}`} key={paper.id}>
                  <div className="paper-content">
                    <div className="paper-title-row">
                      <h4>{paper.name}</h4>
                      <span className="paper-badge">{paper.category}</span>
                    </div>
                    <p>{paper.summary}</p>
                    <div className="metadata-row">
                      {paper.metadata.map((item) => (
                        <span key={item} className="metadata-chip">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="paper-meta">
                    <button className="secondary-button" type="button" onClick={() => togglePaperSelection(paper.id)}>
                      {isSelected ? 'Selected' : 'Compare'}
                    </button>
                    <span>{paper.uploadedAt}</span>
                    <strong>Ready</strong>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel comparison-panel">
        <div className="panel-heading">
          <h3>Paper comparison</h3>
          <span>{comparisonPapers.length === 2 ? 'Side by side' : 'Select two papers'}</span>
        </div>

        {comparisonPapers.length === 2 ? (
          <>
            <div className="comparison-summary">
              <h4>Generated comparison insight</h4>
              <p>{comparisonSummary}</p>
            </div>
            <div className="comparison-grid">
              {comparisonPapers.map((paper) => (
                <div key={paper.id} className="comparison-card">
                  <h4>{paper.name}</h4>
                  <p>{paper.summary}</p>
                  <ul>
                    <li><strong>Category:</strong> {paper.category}</li>
                    <li><strong>Highlights:</strong> {paper.metadata.join(', ')}</li>
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Select exactly two papers to see a comparison summary.</p>
          </div>
        )}
      </section>

      <section className="panel chat-panel">
        <div className="panel-heading">
          <h3>Research chat</h3>
          <span>Ask about your papers</span>
        </div>

        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="empty-state chat-empty">
              <p>Ask a question such as “What methods were used?” or “Summarize the main findings.”</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
                <strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
                <p>{message.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="chat-input-row">
          <input
            className="input"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question about your papers"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleAsk();
              }
            }}
          />
          <button className="primary-button" onClick={handleAsk} type="button">Ask</button>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
