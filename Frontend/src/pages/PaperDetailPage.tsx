import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

const PaperDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { papers, deletePaper } = useResearch();
  const [activeTab, setActiveTab] = useState('Overview');

  const paper = papers.find(p => p.id === id) || papers[0];

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/library')}>
        ← Back to Library
      </button>

      <div className="paper-detail-header">
        <div className="detail-title-row">
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <span className="pdf-icon">PDF</span>
              {paper.tags.map((t, idx) => (
                <span key={idx} className="pill-tag pill-purple">{t}</span>
              ))}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Published {paper.year}</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {paper.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              {paper.authors}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="secondary-button" onClick={() => alert(`Opening PDF document for ${paper.title}...`)}>
              📄 Open PDF
            </button>
            <button className="primary-button" onClick={() => navigate('/chat')}>
              ✨ Ask AI about this paper
            </button>
            <button className="secondary-button" style={{ color: '#f87171' }} onClick={() => { deletePaper(paper.id); navigate('/library'); }}>
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-row">
        {['Overview', 'Summary', 'Methodology', 'Results', 'Citations', 'Questions'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="detail-layout">
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Abstract</h3>
          <p className="detail-abstract">
            {paper.abstract}
          </p>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Keywords & Topics</h3>
          <div className="keywords-group">
            {paper.tags.map((tag, idx) => (
              <span key={idx} className="pill-tag pill-blue">{tag}</span>
            ))}
            <span className="pill-tag pill-cyan">Machine Learning</span>
            <span className="pill-tag pill-green">Deep Learning</span>
          </div>

          {activeTab === 'Summary' && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>AI Generated Summary</h3>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
                <li>Synthesizes key architectural contributions and benchmark results.</li>
                <li>Provides reproducible baseline metrics against existing SOTA frameworks.</li>
                <li>Highlights training computational overhead and data parallelization strategies.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.1rem' }}>Paper Information</h3>

          <div className="info-table-row">
            <span className="info-label">Authors</span>
            <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '180px' }}>{paper.authors}</span>
          </div>

          <div className="info-table-row">
            <span className="info-label">Published in</span>
            <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '180px' }}>{paper.publishedIn || 'ML Conference'}</span>
          </div>

          <div className="info-table-row">
            <span className="info-label">Year</span>
            <span style={{ fontWeight: 600 }}>{paper.year}</span>
          </div>

          <div className="info-table-row">
            <span className="info-label">Pages</span>
            <span style={{ fontWeight: 600 }}>{paper.pages || '1–12'}</span>
          </div>

          <div className="info-table-row">
            <span className="info-label">DOI</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{paper.doi || '10.1000/xyz123'}</span>
          </div>

          <div className="info-table-row">
            <span className="info-label">Citations</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{paper.citations.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperDetailPage;
