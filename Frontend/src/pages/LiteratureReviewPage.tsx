import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { Sparkles } from 'lucide-react';

const LiteratureReviewPage = () => {
  const { papers } = useResearch();
  const [topic, setTopic] = useState('Transformer-based models in computer vision');
  const [selectedIds, setSelectedIds] = useState<string[]>(papers.slice(0, 3).map(p => p.id));
  const [reviewType, setReviewType] = useState('Comprehensive');
  const [instructions, setInstructions] = useState('Focus on recent advances and open challenges.');
  const [progressStep, setProgressStep] = useState(0);
  const [generatedReview, setGeneratedReview] = useState<string | null>(null);

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
    setProgressStep(1);
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setGeneratedReview(
            `# Literature Review: ${topic}\n\n` +
            `**Review Type**: ${reviewType}\n` +
            `**Papers Included**: ${selectedIds.length} papers analyzed.\n\n` +
            `## 1. Introduction & Background\n` +
            `Recent progress in ${topic} has demonstrated a paradigm shift towards self-attention architectures and unified transformer representations. Across the analyzed literature, researchers observe substantial accuracy improvements over traditional baselines.\n\n` +
            `## 2. Key Synthesis & Insights\n` +
            `- **Architectural Shift**: Self-attention mechanisms enable direct modeling of long-range dependencies.\n` +
            `- **Scalability**: Empirical results confirm model performance scales predictably with dataset volume and compute budget.\n\n` +
            `## 3. Open Challenges & Future Directions\n` +
            `${instructions}`
          );
          return 5;
        }
        return prev + 1;
      });
    }, 800);
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
        </div>

        {/* Right Progress / Output Pane */}
        <div className="progress-container">
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

          {generatedReview && (
            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit', fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                {generatedReview}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiteratureReviewPage;
