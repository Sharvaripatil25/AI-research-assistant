import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

const UploadPage = () => {
  const navigate = useNavigate();
  const { addPaper } = useResearch();
  const [isDragging, setIsDragging] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState('2024');
  const [publishedIn, setPublishedIn] = useState('arXiv 2024');
  const [abstract, setAbstract] = useState('');
  const [tagsInput, setTagsInput] = useState('NLP, Transformer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    addPaper({
      title,
      authors: authors || 'Unknown Authors',
      year: year || '2024',
      publishedIn: publishedIn || 'arXiv',
      abstract: abstract || 'Custom uploaded research paper in workspace.',
      tags: tags.length > 0 ? tags : ['General ML']
    });

    navigate('/library');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Upload Paper</h1>
          <p>Bring a new research paper into your AI workspace for instant indexing & synthesis.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem', marginBottom: '1.5rem' }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); setShowManualForm(true); }}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-purple)' : 'rgba(139, 92, 246, 0.3)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            background: isDragging ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Drag and drop your PDF research paper here
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Supports PDF, DOCX, or ArXiv paper URLs up to 50MB
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="primary-button" style={{ padding: '0.75rem 2rem' }} onClick={() => setShowManualForm(true)}>
              Choose File to Upload
            </button>
            <button className="secondary-button" style={{ padding: '0.75rem 1.5rem' }} onClick={() => setShowManualForm(!showManualForm)}>
              {showManualForm ? 'Hide Form' : '✏️ Add Details Manually'}
            </button>
          </div>
        </div>
      </div>

      {showManualForm && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Add Paper Details
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Paper Title *
              </label>
              <input
                type="text"
                className="search-bar"
                style={{ width: '100%', padding: '0.75rem' }}
                placeholder="e.g. LLaMA: Open and Efficient Foundation Language Models"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Authors
                </label>
                <input
                  type="text"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.75rem' }}
                  placeholder="Touvron et al."
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Publication Year
                </label>
                <input
                  type="text"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.75rem' }}
                  placeholder="2023"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Conference / Journal
                </label>
                <input
                  type="text"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.75rem' }}
                  placeholder="arXiv 2023"
                  value={publishedIn}
                  onChange={(e) => setPublishedIn(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                className="search-bar"
                style={{ width: '100%', padding: '0.75rem' }}
                placeholder="LLM, NLP, Foundation Models"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Abstract
              </label>
              <textarea
                style={{
                  width: '100%',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text-main)',
                  padding: '0.75rem',
                  font: 'inherit',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none'
                }}
                placeholder="Enter paper abstract..."
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
              />
            </div>

            <button type="submit" className="primary-button" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
              Add Paper to Workspace
            </button>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          💡 Pro-tips for uploading research:
        </h3>
        <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
          <li>Original digital PDFs produce the most accurate inline citations and figure extractions.</li>
          <li>Once uploaded, papers are automatically processed with AI vector embeddings.</li>
          <li>You can immediately chat with, compare, or generate literature reviews from newly uploaded papers.</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
