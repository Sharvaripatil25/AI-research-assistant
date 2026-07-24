import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import { FileText, Loader2, Folder, Edit3 } from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const { addPaper } = useResearch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [publishedIn, setPublishedIn] = useState('arXiv ' + new Date().getFullYear());
  const [abstract, setAbstract] = useState('');
  const [tagsInput, setTagsInput] = useState('PDF, Research');

  const processFile = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setUploadProgress(15);

    // Clean up filename into paper title
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
    setTitle(formattedTitle);

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const autoAbstract = `Uploaded document: "${file.name}" (${fileSizeMb} MB). Extracted full text content and indexed for AI research synthesis.`;
    setAbstract(autoAbstract);

    // Simulate progress animation
    let currentProgress = 20;
    const interval = setInterval(() => {
      currentProgress += 25;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          // Add paper to workspace context
          addPaper({
            title: formattedTitle,
            authors: authors || 'Extracted Author',
            year: year || new Date().getFullYear().toString(),
            publishedIn: publishedIn || 'Uploaded PDF',
            abstract: autoAbstract,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
          });
          navigate('/library');
        }, 500);
      }
    }, 250);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

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

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
      />

      <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem', marginBottom: '1.5rem' }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-purple)' : 'rgba(139, 92, 246, 0.3)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            background: isDragging ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '3.2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            {uploading ? <Loader2 size={48} className="spin-anim" color="var(--accent-purple)" style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={48} color="var(--accent-purple)" />}
          </div>

          {uploading ? (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Uploading & Indexing PDF...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {fileName}
              </p>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-indigo))',
                    transition: 'width 0.25s ease'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', marginTop: '0.5rem', display: 'block', fontWeight: 600 }}>
                {uploadProgress}% • Parsing PDF & generating embeddings...
              </span>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Click to browse or drag and drop your PDF research paper here
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Supports PDF, DOCX, or TXT papers up to 50MB
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  className="primary-button"
                  style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Folder size={16} /> Select PDF File
                </button>
                <button
                  className="secondary-button"
                  style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowManualForm(!showManualForm);
                  }}
                >
                  <Edit3 size={16} /> {showManualForm ? 'Hide Details Form' : 'Add Metadata Manually'}
                </button>
              </div>
            </>
          )}
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
                  placeholder="2024"
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
                  placeholder="arXiv 2024"
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
