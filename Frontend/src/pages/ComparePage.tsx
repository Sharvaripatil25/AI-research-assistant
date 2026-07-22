import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';

const ComparePage = () => {
  const { papers, comparedPaperIds, addPaperToCompare, removePaperFromCompare } = useResearch();
  const [showAddPicker, setShowAddPicker] = useState(false);

  const comparedPapers = papers.filter(p => comparedPaperIds.includes(p.id));
  const uncomparedPapers = papers.filter(p => !comparedPaperIds.includes(p.id));

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(comparedPapers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "paper-comparison.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="compare-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Compare Papers</h1>
          <p>Select 2 or more papers to analyze side-by-side.</p>
        </div>
        <button className="secondary-button" onClick={handleExport}>
          📥 Export Comparison
        </button>
      </div>

      {/* Selected Papers Tag Chips */}
      <div className="compare-tags-row">
        {comparedPapers.map((p, idx) => (
          <div
            key={p.id}
            className={`pill-tag ${idx % 3 === 0 ? 'pill-purple' : idx % 3 === 1 ? 'pill-blue' : 'pill-cyan'}`}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <span>{p.title} ({p.year})</span>
            <span
              style={{ marginLeft: '0.5rem', fontWeight: 800 }}
              onClick={(e) => { e.stopPropagation(); removePaperFromCompare(p.id); }}
            >
              ✕
            </span>
          </div>
        ))}

        <div style={{ position: 'relative' }}>
          <button
            className="secondary-button"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            onClick={() => setShowAddPicker(!showAddPicker)}
          >
            + Add Paper
          </button>

          {showAddPicker && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                background: 'var(--sidebar-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                padding: '0.75rem',
                zIndex: 100,
                width: '260px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>SELECT PAPER TO ADD:</div>
              {uncomparedPapers.length > 0 ? (
                uncomparedPapers.map(p => (
                  <div
                    key={p.id}
                    style={{
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      marginBottom: '0.25rem',
                      background: 'rgba(255,255,255,0.04)'
                    }}
                    onClick={() => { addPaperToCompare(p.id); setShowAddPicker(false); }}
                  >
                    {p.title} ({p.year})
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>All papers added to comparison</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="aspect-col">Aspect</th>
              {comparedPapers.map(p => (
                <th key={p.id}>{p.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="aspect-col">Authors</td>
              {comparedPapers.map(p => (
                <td key={p.id}>{p.authors}</td>
              ))}
            </tr>
            <tr>
              <td className="aspect-col">Published Year</td>
              {comparedPapers.map(p => (
                <td key={p.id}>{p.year}</td>
              ))}
            </tr>
            <tr>
              <td className="aspect-col">Primary Topics</td>
              {comparedPapers.map(p => (
                <td key={p.id}>
                  {p.tags.map((t, i) => (
                    <span key={i} className="pill-tag pill-purple" style={{ marginRight: '4px' }}>{t}</span>
                  ))}
                </td>
              ))}
            </tr>
            <tr>
              <td className="aspect-col">Core Methodology / Abstract</td>
              {comparedPapers.map(p => (
                <td key={p.id} style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>{p.abstract}</td>
              ))}
            </tr>
            <tr>
              <td className="aspect-col">Citations</td>
              {comparedPapers.map(p => (
                <td key={p.id} style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>
                  {p.citations.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
