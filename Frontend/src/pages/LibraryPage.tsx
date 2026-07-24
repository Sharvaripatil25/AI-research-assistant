import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import { Trash2, RotateCcw, Upload, Search, FileText, Plus } from 'lucide-react';

const LibraryPage = () => {
  const navigate = useNavigate();
  const { papers, deletePaper, clearAllPapers, resetToSamplePapers, searchQuery, setSearchQuery } = useResearch();
  const [topic, setTopic] = useState('All Topics');
  const [year, setYear] = useState('All Years');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || paper.authors.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topic === 'All Topics' || paper.tags.some(t => t.toLowerCase().includes(topic.toLowerCase()));
    const matchesYear = year === 'All Years' || paper.year === year;
    return matchesSearch && matchesTopic && matchesYear;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Library</h1>
          <p>All your uploaded research papers in one place ({papers.length} total).</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {papers.length > 0 ? (
            <button
              className="secondary-button"
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              onClick={() => { if (window.confirm('Clear all papers from workspace?')) clearAllPapers(); }}
            >
              <Trash2 size={14} /> Clear All
            </button>
          ) : (
            <button className="secondary-button" onClick={resetToSamplePapers} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCcw size={14} /> Load Sample Papers
            </button>
          )}
          <button className="primary-button" onClick={() => navigate('/upload')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> <span>Upload Paper</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="library-filter-bar">
        <div className="filter-left">
          <div className="search-bar" style={{ maxWidth: '300px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select className="select-dropdown" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>All Topics</option>
            <option>NLP</option>
            <option>Computer Vision</option>
            <option>Graph ML</option>
            <option>Robotics</option>
          </select>

          <select className="select-dropdown" value={year} onChange={(e) => setYear(e.target.value)}>
            <option>All Years</option>
            <option>2020</option>
            <option>2019</option>
            <option>2018</option>
            <option>2017</option>
            <option>2013</option>
          </select>

          <select className="select-dropdown">
            <option>Sort: Newest</option>
            <option>Sort: Citations</option>
            <option>Sort: Title</option>
          </select>
        </div>

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            ▦
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Paper Grid / List */}
      <div className={viewMode === 'grid' ? 'paper-grid' : 'search-results-list'}>
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="paper-card"
            >
              <div className="paper-card-header">
                <span className="pdf-icon">PDF</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{paper.year}</span>
                  <button
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
                    onClick={(e) => { e.stopPropagation(); deletePaper(paper.id); }}
                    title="Delete paper"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div onClick={() => navigate(`/library/${paper.id}`)} style={{ cursor: 'pointer' }}>
                <h3 className="paper-card-title">{paper.title}</h3>
                <p className="paper-card-authors">{paper.authors}</p>
                <div className="paper-card-tags">
                  {paper.tags.map((t, idx) => (
                    <span key={idx} className="pill-tag pill-purple">{t}</span>
                  ))}
                </div>
              </div>

              <div className="paper-card-footer">
                <span>{paper.citations.toLocaleString()} citations</span>
                <button className="link-btn" style={{ fontSize: '0.78rem' }} onClick={() => navigate(`/library/${paper.id}`)}>
                  View Details →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
              <FileText size={42} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your research library is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
              Upload your own PDF research papers or load sample papers to get started.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="primary-button" onClick={() => navigate('/upload')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={16} /> Upload Your First Paper
              </button>
              <button className="secondary-button" onClick={resetToSamplePapers} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={14} /> Load Sample Papers
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredPapers.length > 0 && (
        <div className="pagination">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing 1 to {filteredPapers.length} of {papers.length} papers
          </span>
          <div className="pagination-controls">
            <div className="page-number">‹</div>
            <div className="page-number active">1</div>
            <div className="page-number">›</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
