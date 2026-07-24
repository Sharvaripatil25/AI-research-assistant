import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch, Paper } from '../context/ResearchContext';
import { Search, BookOpen, Globe, FileText, Plus, Check, ArrowRight, Loader2 } from 'lucide-react';

interface WebPaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  publishedIn: string;
  abstract: string;
  tags: string[];
  citations: number;
}

const CollectionsPage = () => {
  const navigate = useNavigate();
  const { papers, addPaper, searchQuery, setSearchQuery } = useResearch();
  const [activeTab, setActiveTab] = useState<'uploaded' | 'web'>('uploaded');

  // Web search state
  const [webResults, setWebResults] = useState<WebPaper[]>([]);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [savedWebIds, setSavedWebIds] = useState<string[]>([]);

  const currentQuery = searchQuery || '';

  // Filter Uploaded Library Papers
  const filteredUploadedPapers = papers.filter(p => {
    const q = currentQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.abstract.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Fetch Web Academic Papers when in 'web' tab or query changes
  useEffect(() => {
    if (activeTab !== 'web') return;

    const queryToSearch = currentQuery.trim() || 'artificial intelligence';
    setIsSearchingWeb(true);

    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/search-web?q=${encodeURIComponent(queryToSearch)}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.papers)) {
            setWebResults(data.papers);
          }
        })
        .catch(err => {
          console.error('Failed to fetch web search results:', err);
        })
        .finally(() => {
          setIsSearchingWeb(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentQuery, activeTab]);

  const handleSaveWebPaper = (webPaper: WebPaper) => {
    if (savedWebIds.includes(webPaper.id)) return;

    const newPaper: Paper = {
      id: `paper-${Date.now()}`,
      title: webPaper.title,
      authors: webPaper.authors,
      year: webPaper.year || new Date().getFullYear().toString(),
      publishedIn: webPaper.publishedIn || 'Web Academic Database',
      abstract: webPaper.abstract,
      tags: webPaper.tags || ['Web Search'],
      citations: webPaper.citations || 0,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    addPaper(newPaper);
    setSavedWebIds(prev => [...prev, webPaper.id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Search Research Papers
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Find concepts across your uploaded library or query live web & academic databases.
          </p>
        </div>
      </div>

      {/* Prominent Search Hero Input */}
      <div
        className="glass-panel"
        style={{
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)'
        }}
      >
        <Search size={22} color="var(--accent-purple)" style={{ marginLeft: '0.25rem' }} />
        <input
          type="text"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '1.05rem',
            color: 'var(--text-main)',
            fontWeight: 500,
            padding: '0.65rem 0'
          }}
          placeholder="Search papers by title, author, keyword, abstract, or concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="secondary-button"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            Clear Search
          </button>
        ) : (
          <span className="pill-tag pill-purple" style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', fontWeight: 700 }}>
            ⚡ Instant Search
          </span>
        )}
      </div>

      {/* 2 Search Scope Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.65rem'
          }}
        >
          <button
            onClick={() => setActiveTab('uploaded')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.25rem',
              border: 'none',
              background: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'uploaded' ? 'var(--accent-purple)' : 'var(--text-muted)',
              borderBottom: activeTab === 'uploaded' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={18} />
            <span>Uploaded Papers ({filteredUploadedPapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('web')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.25rem',
              border: 'none',
              background: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'web' ? 'var(--accent-purple)' : 'var(--text-muted)',
              borderBottom: activeTab === 'web' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={18} />
            <span>Web & Academic Databases</span>
          </button>
        </div>

        {/* Tab 1: Uploaded Workspace Papers */}
        {activeTab === 'uploaded' && (
          filteredUploadedPapers.length > 0 ? (
            filteredUploadedPapers.map((paper) => (
              <div key={paper.id} className="result-card">
                <div style={{ flex: 1 }}>
                  <h3
                    style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer', marginBottom: '0.4rem' }}
                    onClick={() => navigate(`/library/${paper.id}`)}
                  >
                    {paper.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {paper.authors} • {paper.year} {paper.publishedIn ? `• ${paper.publishedIn}` : ''}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {paper.abstract}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '130px' }}>
                  <button
                    className="secondary-button"
                    style={{ fontSize: '0.78rem', padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    onClick={() => navigate(`/library/${paper.id}`)}
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <FileText size={42} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {papers.length === 0 ? 'No papers in your library yet' : 'No matching uploaded papers'}
              </h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                {papers.length === 0
                  ? 'Upload your PDF research papers to start analyzing and querying them.'
                  : `No papers in your library match "${currentQuery}".`}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="primary-button" onClick={() => navigate('/upload')}>
                  <Plus size={16} /> Upload New Paper
                </button>
                <button className="secondary-button" onClick={() => setActiveTab('web')}>
                  <Globe size={16} /> Search Web Databases
                </button>
              </div>
            </div>
          )
        )}

        {/* Tab 2: Live Web & Academic Databases Search */}
        {activeTab === 'web' && (
          isSearchingWeb ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <Loader2 size={36} color="var(--accent-purple)" className="spin-animation" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Searching Academic Literature...</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.88rem' }}>
                Querying live web databases and arXiv preprints for "{currentQuery || 'artificial intelligence'}".
              </p>
            </div>
          ) : webResults.length > 0 ? (
            webResults.map((item) => {
              const isSaved = savedWebIds.includes(item.id);
              return (
                <div key={item.id} className="result-card">
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {item.authors} • <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{item.publishedIn}</span> • {item.year}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {item.abstract}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '130px' }}>
                    <button
                      className={isSaved ? 'secondary-button' : 'primary-button'}
                      style={{ fontSize: '0.78rem', padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={() => handleSaveWebPaper(item)}
                      disabled={isSaved}
                    >
                      {isSaved ? (
                        <><Check size={13} color="var(--accent-emerald)" /> Added to Library</>
                      ) : (
                        <><Plus size={13} /> Add to Library</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <Globe size={42} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>No web results found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.88rem' }}>
                Try searching for terms like "Transformers", "Healthcare", "Federated Learning", or "Computer Vision".
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
