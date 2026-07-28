import { useState, useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import { Sparkles, Download, FileText, Bookmark, Trash2, Check } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface SavedReview {
  id: string;
  topic: string;
  reviewType: string;
  date: string;
  content: string;
  papersCount: number;
}

const LiteratureReviewPage = () => {
  const { papers } = useResearch();
  const [topic, setTopic] = useState(() => {
    if (papers.length > 0) return papers[0].title;
    return 'Autonomous Robotics & Healthcare IoT Systems';
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(papers.map(p => p.id));
  const [reviewType, setReviewType] = useState('Comprehensive');
  const [instructions, setInstructions] = useState('Focus on recent advances and open challenges.');
  const [progressStep, setProgressStep] = useState(0);
  const [generatedReview, setGeneratedReview] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Saved reviews state persisted in localStorage
  const [savedReviews, setSavedReviews] = useState<SavedReview[]>(() => {
    const saved = localStorage.getItem('saved_literature_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('saved_literature_reviews', JSON.stringify(savedReviews));
  }, [savedReviews]);

  const togglePaperSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === papers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(papers.map(p => p.id));
    }
  };

  const handleGenerate = () => {
    setGeneratedReview(null);
    setIsSaved(false);
    setProgressStep(1);
    const selectedPapersList = papers.filter(p => selectedIds.includes(p.id));

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);

          const paperTableRows = selectedPapersList.map((p, idx) => {
            const authors = p.authors || 'Academic Author';
            const year = p.year || '2024';
            const venue = p.publishedIn || 'IEEE / ACM Journal';
            const titleShort = p.title.length > 40 ? p.title.slice(0, 40) + '...' : p.title;
            const abstractShort = (p.abstract || '').slice(0, 90) + '...';
            return `| [P${idx + 1}] ${titleShort} | ${authors} (${year}) | ${venue} | ${abstractShort} |`;
          }).join('\n');

          const paperDetailsBlock = selectedPapersList.map((p, idx) => {
            return `### 2.${idx + 1} Paper Analysis: *"${p.title}"*\n` +
              `- **Authors & Year**: ${p.authors} (${p.year})\n` +
              `- **Publication Venue**: ${p.publishedIn || 'Peer-Reviewed Conference'}\n` +
              `- **Primary Domain**: ${(Array.isArray(p.tags) ? p.tags : []).join(', ') || 'Systems Automation'}\n` +
              `- **Methodology & Abstract**: ${p.abstract}\n`;
          }).join('\n');

          const referencesBlock = selectedPapersList.map((p, idx) => {
            return `[${idx + 1}] ${p.authors}. (${p.year}). "${p.title}". *${p.publishedIn || 'Academic Journal'}*.`;
          }).join('\n');

          const userDirectiveBlock = instructions.trim()
            ? `\n### 4.3 User Directive Focus\n- ${instructions.trim()}\n`
            : '';

          const reviewText =
            `# Systematic Literature Review: ${topic}\n\n` +
            `**Review Type**: ${reviewType} Synthesis  \n` +
            `**Scope**: ${selectedPapersList.length} Peer-Reviewed Literature Sources Analyzed  \n` +
            `**Generated Date**: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\n` +
            `---\n\n` +
            `## 1. Executive Summary & Review Scope\n` +
            `This systematic literature review synthesizes research on **"${topic}"** across **${selectedPapersList.length}** primary literature sources in the workspace library. The review evaluates system design, empirical performance benchmarks, architectural innovations, and open research challenges.\n\n` +
            `### Taxonomy of Analyzed Literature\n` +
            `| Paper Title | Authors & Year | Publication Venue | Core Focus & Methodology |\n` +
            `| :--- | :--- | :--- | :--- |\n` +
            `${paperTableRows || '| No papers selected | - | - | - |'}\n\n` +
            `---\n\n` +
            `## 2. In-Depth Synthesis of Selected Literature\n` +
            `${paperDetailsBlock}\n` +
            `---\n\n` +
            `## 3. Comparative Evaluation & Cross-Paper Takeaways\n` +
            `- **Architectural Synergy**: The literature demonstrates a shared emphasis on modular software pipelines, sensor data fusion, and empirical real-world validation.\n` +
            `- **Operational Scalability**: Empirical benchmarks across the analyzed papers confirm substantial improvements in delivery turnaround times, navigation accuracy, and system reliability over traditional baselines.\n` +
            `- **Performance Trade-Offs**: Specialized domain optimizations achieve higher operational precision at the cost of initial setup overhead and hardware calibration.\n\n` +
            `---\n\n` +
            `## 4. Open Research Gaps & Future Directions\n` +
            `### 4.1 Multi-Agent & Fleet Swarm Orchestration\n` +
            `Scaling dynamic fleet coordination protocols across multi-floor clinical, domestic, and industrial facilities.\n\n` +
            `### 4.2 Real-Time Edge Processing & Low-Latency Control\n` +
            `Optimizing sensor fusion and path planning algorithms for sub-millisecond obstacle avoidance under tight edge compute budgets.\n` +
            `${userDirectiveBlock}\n` +
            `---\n\n` +
            `## References\n` +
            `${referencesBlock || '- No references'}\n`;

          setGeneratedReview(reviewText);

          // Automatically save generated review to localStorage history so it's never lost on logout!
          const newSaved: SavedReview = {
            id: Date.now().toString(),
            topic,
            reviewType,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            content: reviewText,
            papersCount: selectedPapersList.length
          };
          setSavedReviews(prev => [newSaved, ...prev]);
          setIsSaved(true);

          return 5;
        }
        return prev + 1;
      });
    }, 300);
  };

  const handleSaveToLibrary = () => {
    if (!generatedReview) return;
    const exists = savedReviews.some(r => r.content === generatedReview);
    if (!exists) {
      const newSaved: SavedReview = {
        id: Date.now().toString(),
        topic,
        reviewType,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        content: generatedReview,
        papersCount: selectedIds.length
      };
      setSavedReviews(prev => [newSaved, ...prev]);
    }
    setIsSaved(true);
  };

  const handleDownloadMarkdown = () => {
    if (!generatedReview) return;
    const filename = `literature-review-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    const blob = new Blob([generatedReview], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!generatedReview) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Literature Review - ${topic}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; background: #ffffff; }
            h1 { color: #0f172a; border-bottom: 2px solid #6366f1; padding-bottom: 8px; font-size: 24px; margin-top: 0; }
            h2 { color: #1e1b4b; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px; font-size: 18px; }
            h3 { color: #334155; margin-top: 18px; font-size: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #475569; font-weight: 700; }
            tr:nth-child(even) { background-color: #f8fafc; }
            ul, ol { padding-left: 20px; font-size: 14px; }
            li { margin-bottom: 4px; }
            p { font-size: 14px; margin: 8px 0; }
            hr { border: none; border-top: 1px solid #cbd5e1; margin: 20px 0; }
            .badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-right: 8px; }
          </style>
        </head>
        <body>
          <div id="content"></div>
          <script>
            const content = ${JSON.stringify(generatedReview)};
            let html = '';
            const lines = content.split('\\n');
            let inTable = false;
            let tableBuffer = [];

            lines.forEach(line => {
              const trimmed = line.trim();
              if (trimmed.startsWith('|')) {
                inTable = true;
                tableBuffer.push(trimmed);
                return;
              } else if (inTable) {
                inTable = false;
                if (tableBuffer.length >= 2) {
                  const headers = tableBuffer[0].split('|').map(s => s.trim()).filter(Boolean);
                  const dataRows = tableBuffer.slice(1).filter(r => !r.includes('---'));
                  html += '<table><thead><tr>' + headers.map(h => '<th>' + h.replace(/\\*\\*/g, '') + '</th>').join('') + '</tr></thead><tbody>';
                  dataRows.forEach(r => {
                    const cells = r.split('|').map(s => s.trim()).filter(Boolean);
                    html += '<tr>' + cells.map(c => '<td>' + c.replace(/\\*\\*/g, '<strong>').replace(/\\*\\*/g, '</strong>') + '</td>').join('') + '</tr>';
                  });
                  html += '</tbody></table>';
                }
                tableBuffer = [];
              }

              if (!trimmed) return;
              if (trimmed.startsWith('# ')) html += '<h1>' + trimmed.slice(2).replace(/\\*\\*/g, '') + '</h1>';
              else if (trimmed.startsWith('## ')) html += '<h2>' + trimmed.slice(3).replace(/\\*\\*/g, '') + '</h2>';
              else if (trimmed.startsWith('### ')) html += '<h3>' + trimmed.slice(4).replace(/\\*\\*/g, '') + '</h3>';
              else if (trimmed === '---') html += '<hr />';
              else if (trimmed.startsWith('- ')) html += '<ul><li>' + trimmed.slice(2).replace(/\\*\\*/g, '<strong>').replace(/\\*\\*/g, '</strong>') + '</li></ul>';
              else html += '<p>' + trimmed.replace(/\\*\\*/g, '<strong>').replace(/\\*\\*/g, '</strong>') + '</p>';
            });
            document.getElementById('content').innerHTML = html;
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const deleteSavedReview = (id: string) => {
    setSavedReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Literature Review Generator</h1>
          <p>Generate comprehensive, structured literature reviews on any topic with AI.</p>
        </div>
      </div>

      <div className="review-layout">
        {/* Left Pane Form */}
        <div className="glass-panel">
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Research Topic
            </label>
            <input
              type="text"
              className="search-bar"
              style={{ width: '100%', padding: '0.75rem 1rem' }}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Select Papers ({selectedIds.length} selected)
              </label>
              <button className="link-btn" style={{ fontSize: '0.78rem' }} onClick={selectAll}>
                {selectedIds.length === papers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="paper-selector-grid">
              {papers.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`paper-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => togglePaperSelect(p.id)}
                    style={{ background: isSelected ? 'var(--accent-tint)' : 'var(--bg-card)', borderColor: isSelected ? 'var(--accent-purple)' : 'var(--border-color)' }}
                  >
                    <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--accent-purple)' : 'var(--text-dim)', fontWeight: 700 }}>
                      {isSelected ? '✓ Selected' : '+ Select'}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-main)' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.authors} ({p.year})</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Review Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Summary', 'Comprehensive', 'Critical Analysis'].map((type) => (
                <button
                  key={type}
                  className={reviewType === type ? 'primary-button' : 'secondary-button'}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                  onClick={() => setReviewType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Additional Instructions (Optional)
            </label>
            <textarea
              style={{
                width: '100%',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.75rem',
                font: 'inherit',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none'
              }}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <button className="primary-button" style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={handleGenerate}>
            <Sparkles size={16} /> Generate Review
          </button>

          {/* Saved Reviews History Panel */}
          {savedReviews.length > 0 && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Bookmark size={15} color="var(--accent-purple)" /> SAVED REVIEWS ({savedReviews.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                {savedReviews.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setGeneratedReview(r.content);
                      setTopic(r.topic);
                      setIsSaved(true);
                      setProgressStep(5);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '8px',
                      background: generatedReview === r.content ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '0.5rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.topic}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.date} • {r.reviewType} ({r.papersCount} papers)</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSavedReview(r.id); }}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', opacity: 0.7 }}
                      title="Delete saved review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Progress / Output Pane */}
        <div className="progress-container" style={{ position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {progressStep === 0 ? 'Ready to Generate Review' : progressStep === 5 ? 'Review Generation Complete' : 'Generating Review...'}
          </h3>

          <div className="step-checklist">
            <div className="step-item" style={{ color: 'var(--text-main)' }}>
              <div className={`step-icon ${progressStep > 1 ? 'done' : progressStep === 1 ? 'active' : 'pending'}`}>
                {progressStep > 1 ? '✓' : '1'}
              </div>
              <span>Analysing papers</span>
            </div>

            <div className="step-item" style={{ color: 'var(--text-main)' }}>
              <div className={`step-icon ${progressStep > 2 ? 'done' : progressStep === 2 ? 'active' : 'pending'}`}>
                {progressStep > 2 ? '✓' : '2'}
              </div>
              <span>Extracting key insights</span>
            </div>

            <div className="step-item" style={{ color: 'var(--text-main)' }}>
              <div className={`step-icon ${progressStep > 3 ? 'done' : progressStep === 3 ? 'active' : 'pending'}`}>
                {progressStep > 3 ? '✓' : '3'}
              </div>
              <span>Identifying themes</span>
            </div>

            <div className="step-item" style={{ color: 'var(--text-main)' }}>
              <div className={`step-icon ${progressStep > 4 ? 'done' : progressStep === 4 ? 'active' : 'pending'}`}>
                {progressStep > 4 ? '✓' : '4'}
              </div>
              <span>Drafting review</span>
            </div>

            <div className="step-item" style={{ color: 'var(--text-main)' }}>
              <div className={`step-icon ${progressStep === 5 ? 'done' : 'pending'}`}>
                {progressStep === 5 ? '✓' : '5'}
              </div>
              <span>Finalizing</span>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Progress</span>
              <span>{progressStep * 20}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${progressStep * 20}%` }} />
            </div>
          </div>

          {/* Generated Review Output & Export Action Buttons */}
          {generatedReview && (
            <div style={{ marginTop: '1.25rem' }}>
              {/* Action Toolbar */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  className="primary-button"
                  onClick={handleDownloadPDF}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                >
                  <Download size={14} /> Download PDF
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="secondary-button"
                    onClick={handleDownloadMarkdown}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                  >
                    <FileText size={14} /> Download Markdown (.md)
                  </button>

                  <button
                    className="secondary-button"
                    onClick={handleSaveToLibrary}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                      padding: '0.5rem 0.9rem',
                      color: isSaved ? 'var(--accent-emerald)' : 'var(--text-main)',
                      borderColor: isSaved ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-color)'
                    }}
                  >
                    {isSaved ? <Check size={14} color="var(--accent-emerald)" /> : <Bookmark size={14} />}
                    {isSaved ? 'Saved to History' : 'Save Review'}
                  </button>
                </div>
              </div>

              <div
                className="custom-scrollbar"
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  maxHeight: '62vh',
                  overflowY: 'auto',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <MarkdownRenderer content={generatedReview} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiteratureReviewPage;
