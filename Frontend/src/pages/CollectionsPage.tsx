import { useState } from 'react';

const searchResults = [
  {
    id: '1',
    title: 'Federated Learning for Healthcare: A Survey',
    authors: 'Li, Q., et al. (2020)',
    snippet: 'A comprehensive survey on the applications of federated learning in healthcare, discussing challenges, opportunities, and future directions.',
    tags: ['Healthcare', 'Federated Learning', 'Survey'],
    matchScore: '98% match'
  },
  {
    id: '2',
    title: 'Communication-Efficient Federated Learning in Healthcare',
    authors: 'Tang, X., et al. (2021)',
    snippet: 'Tackles communication bottleneck in healthcare federated learning for privacy-preserving disease detection across distributed hospitals.',
    tags: ['Healthcare', 'Federated Learning', 'Optimization'],
    matchScore: '93% match'
  },
  {
    id: '3',
    title: 'Privacy-Preserving Patient Data Analysis via Federated Learning',
    authors: 'Kairouz, P., et al. (2021)',
    snippet: 'Introduces differential privacy guarantees for multi-hospital federated learning without sharing raw clinical EHR records.',
    tags: ['Healthcare', 'Privacy', 'Federated Learning'],
    matchScore: '90% match'
  }
];

const CollectionsPage = () => {
  const [query, setQuery] = useState('federated learning in healthcare');

  return (
    <div>
      {/* Top Search Bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.85rem' }}>
        <div className="search-bar" style={{ flex: 1, padding: '0.85rem 1.25rem' }}>
          <span>🔍</span>
          <input
            type="text"
            style={{ fontSize: '1rem' }}
            placeholder="Search papers, topics, concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="primary-button" style={{ borderRadius: 'var(--radius-md)' }}>
          Search
        </button>
      </div>

      {/* Filter Row */}
      <div className="library-filter-bar">
        <div className="filter-left">
          <select className="select-dropdown">
            <option>All Papers</option>
            <option>Selected Papers Only</option>
          </select>

          <select className="select-dropdown">
            <option>Sort: Relevance</option>
            <option>Sort: Newest</option>
            <option>Sort: Citations</option>
          </select>

          <select className="select-dropdown">
            <option>All Years</option>
            <option>2021</option>
            <option>2020</option>
          </select>

          <button className="secondary-button" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ⚙️ Filters
          </button>
        </div>
      </div>

      {/* Search Layout */}
      <div className="search-explore-layout">
        <div className="search-results-list">
          {searchResults.map((item) => (
            <div key={item.id} className="result-card">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h3>
                  <span className="similarity-badge">⚡ {item.matchScore}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>{item.authors}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '0.85rem' }}>{item.snippet}</p>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="pill-tag pill-purple">{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span className="pdf-icon">PDF</span>
                <button className="secondary-button" style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}>
                  View Paper
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar: Related Topics & Top Authors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Related Topics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--accent-purple)' }}># federated learning</span>
                <span style={{ color: 'var(--text-dim)' }}>1,245 papers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--accent-blue)' }}># healthcare</span>
                <span style={{ color: 'var(--text-dim)' }}>875 papers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--accent-cyan)' }}># privacy-preserving ml</span>
                <span style={{ color: 'var(--text-dim)' }}>642 papers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--accent-green)' }}># distributed learning</span>
                <span style={{ color: 'var(--text-dim)' }}>489 papers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--accent-pink)' }}># medical data mining</span>
                <span style={{ color: 'var(--text-dim)' }}>312 papers</span>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Top Authors</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Li, Q.</span>
                <span style={{ color: 'var(--text-dim)' }}>23 papers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Yang, X.</span>
                <span style={{ color: 'var(--text-dim)' }}>18 papers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Rieke, N.</span>
                <span style={{ color: 'var(--text-dim)' }}>15 papers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
