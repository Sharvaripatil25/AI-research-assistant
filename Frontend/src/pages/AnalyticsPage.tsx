import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const { papers, chatSessions } = useResearch();

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Analytics Overview</h1>
          <p>Your research activity insights and performance statistics.</p>
        </div>

        <select
          className="select-dropdown"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Top 4 Stats Grid */}
      <div className="stats-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Papers Uploaded</span>
            <div className="metric-icon">📄</div>
          </div>
          <div className="metric-value">{papers.length}</div>
          <div className="metric-trend">{papers.length > 0 ? `+${papers.length} total` : '0 uploaded'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">AI Conversations</span>
            <div className="metric-icon">💬</div>
          </div>
          <div className="metric-value">{chatSessions.length}</div>
          <div className="metric-trend">{chatSessions.length > 0 ? `+${chatSessions.length} active` : '0 active'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Literature Reviews</span>
            <div className="metric-icon">📝</div>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-trend">0 generated</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Hours Saved</span>
            <div className="metric-icon">⏱️</div>
          </div>
          <div className="metric-value">{(papers.length * 1.5 + chatSessions.length * 0.5).toFixed(1)}</div>
          <div className="metric-trend">0h saved</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-grid">
        {/* Line Chart */}
        <div className="chart-container">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Papers Uploaded Over Time
          </h3>

          <div style={{ width: '100%', height: '240px' }}>
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

              {/* Area Path */}
              <path
                d="M 0 160 Q 60 120 120 140 T 240 70 T 360 100 T 480 30 L 480 180 L 0 180 Z"
                fill="url(#areaGradient)"
              />

              {/* Line Path */}
              <path
                d="M 0 160 Q 60 120 120 140 T 240 70 T 360 100 T 480 30"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
              />

              {/* Glowing Dots */}
              <circle cx="120" cy="140" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              <circle cx="240" cy="70" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              <circle cx="360" cy="100" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              <circle cx="480" cy="30" r="6" fill="#c084fc" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
            <span>Apr 20</span>
            <span>Apr 27</span>
            <span>May 4</span>
            <span>May 11</span>
            <span>May 18</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-container">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
            Top Research Topics
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '220px' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* CV 35% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="16" strokeDasharray="83.5 155" />
                {/* NLP 28% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="66.8 172" strokeDashoffset="-83.5" />
                {/* ML 20% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="16" strokeDasharray="47.7 191" strokeDashoffset="-150.3" />
                {/* Robotics 10% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="16" strokeDasharray="23.8 215" strokeDashoffset="-198" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
                <span>Computer Vision: <strong>35%</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
                <span>NLP: <strong>28%</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }} />
                <span>Machine Learning: <strong>20%</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} />
                <span>Robotics: <strong>10%</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#64748b' }} />
                <span>Others: <strong>7%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Cards */}
      <div className="analytics-bottom-row">
        <div className="glass-panel">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Most Active Day</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>Monday</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', marginTop: '0.3rem' }}>Activity is 35% higher</div>
        </div>

        <div className="glass-panel">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Average Session</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>24m 30s</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '0.3rem' }}>↑ +15% vs last 30 days</div>
        </div>

        <div className="glass-panel">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Total Searches</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>156</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '0.3rem' }}>↑ +22% vs last 30 days</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
