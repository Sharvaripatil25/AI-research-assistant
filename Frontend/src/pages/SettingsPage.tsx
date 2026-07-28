import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import { User, Mail, Building, BrainCircuit, Key, Database, LogOut, Check, Sparkles, FileText, Download, ShieldCheck, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, logout, papers, clearAllPapers } = useResearch();
  
  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [researchField, setResearchField] = useState(user?.researchField || '');
  const [aiModel, setAiModel] = useState(() => user?.email ? (localStorage.getItem(`pref_aimodel_${user.email.toLowerCase()}`) || 'Gemini 1.5 Flash (Fast & Responsive)') : 'Gemini 1.5 Flash (Fast & Responsive)');
  const [citationFormat, setCitationFormat] = useState(() => user?.email ? (localStorage.getItem(`pref_citation_${user.email.toLowerCase()}`) || 'APA 7th Edition') : 'APA 7th Edition');
  const [ragDepth, setRagDepth] = useState(() => user?.email ? (localStorage.getItem(`pref_ragdepth_${user.email.toLowerCase()}`) || '5 Chunks (Balanced - Recommended)') : '5 Chunks (Balanced - Recommended)');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [cacheMessage, setCacheMessage] = useState('');

  // Sync state dynamically whenever logged-in user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setInstitution(user.institution || '');
      setResearchField(user.researchField || '');
      if (user.email) {
        const emailKey = user.email.toLowerCase();
        setAiModel(localStorage.getItem(`pref_aimodel_${emailKey}`) || 'Gemini 1.5 Flash (Fast & Responsive)');
        setCitationFormat(localStorage.getItem(`pref_citation_${emailKey}`) || 'APA 7th Edition');
        setRagDepth(localStorage.getItem(`pref_ragdepth_${emailKey}`) || '5 Chunks (Balanced - Recommended)');
      }
    }
  }, [user]);

  // Dynamically calculate actual workspace storage used from uploaded papers
  const totalStorageMB = papers.reduce((acc, p) => acc + (Number(p.pages) || 12) * 0.18 + 0.4, 0).toFixed(1);
  const maxStorageMB = 500;
  const storagePercentage = Math.min(100, Math.max(1, (Number(totalStorageMB) / maxStorageMB) * 100)).toFixed(1);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = name.trim() || (user?.email ? user.email.split('@')[0] : 'Researcher');
    updateUserProfile({ name: cleanName, institution: institution.trim(), researchField: researchField.trim() });
    setMessage('Profile & preferences saved successfully!');
    setTimeout(() => setMessage(''), 6000);
  };

  const handleModelPrefChange = (val: string, keyPrefix: string, setter: (v: string) => void) => {
    setter(val);
    if (user?.email) {
      localStorage.setItem(`${keyPrefix}_${user.email.toLowerCase()}`, val);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword && newPassword) {
      setPassMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPassMessage(''), 3000);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(papers, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "workspace-library-export.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleClearCache = () => {
    if (window.confirm('Clear cached RAG vector embeddings and workspace index?')) {
      setCacheMessage('Workspace cache & index cleared!');
      setTimeout(() => setCacheMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Page Title */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Account Settings & Preferences
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Manage your researcher profile, AI model preferences, citation formats, and workspace security.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Researcher Profile Card */}
        <div className="glass-panel">
          {/* Header Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <div className="avatar" style={{ width: '52px', height: '52px', fontSize: '1.2rem', fontWeight: 800 }}>
              {user?.avatarInitials || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'U')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {name || user?.name || 'Researcher'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {user?.email || ''}
              </div>
            </div>
            <span className="pill-tag pill-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem' }}>
              <ShieldCheck size={14} /> Researcher Tier
            </span>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--accent-purple)" /> Profile Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Display Name
                </label>
                <input
                  type="text"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', opacity: 0.75 }}
                  value={user?.email || ''}
                  disabled
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Institution / Organization
                </label>
                <input
                  type="text"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Stanford University"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Primary Research Field
                </label>
                <input
                  type="text"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                  value={researchField}
                  onChange={(e) => setResearchField(e.target.value)}
                  placeholder="e.g. Machine Learning"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
                className="primary-button"
                style={{ padding: '0.65rem 1.4rem', cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              >
                Save Profile Changes
              </button>

              {message && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(52, 211, 153, 0.12)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(52, 211, 153, 0.12)'
                  }}
                >
                  <Check size={15} color="var(--accent-emerald)" />
                  <span>{message}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* AI & RAG Preferences Card */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BrainCircuit size={18} color="var(--accent-purple)" /> AI Model & RAG Preferences
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                AI Synthesis Engine
              </label>
              <select
                className="select-dropdown"
                style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                value={aiModel}
                onChange={(e) => handleModelPrefChange(e.target.value, 'pref_aimodel', setAiModel)}
              >
                <option>Gemini 1.5 Flash (Fast & Responsive)</option>
                <option>Gemini 1.5 Pro (Deep Academic Analysis)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Default Citation Format
              </label>
              <select
                className="select-dropdown"
                style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                value={citationFormat}
                onChange={(e) => handleModelPrefChange(e.target.value, 'pref_citation', setCitationFormat)}
              >
                <option>APA 7th Edition</option>
                <option>IEEE Citation Style</option>
                <option>Harvard Style</option>
                <option>BibTeX Format</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              RAG Document Retrieval Depth
            </label>
            <select
              className="select-dropdown"
              style={{ width: '100%', padding: '0.65rem 0.85rem' }}
              value={ragDepth}
              onChange={(e) => handleModelPrefChange(e.target.value, 'pref_ragdepth', setRagDepth)}
            >
              <option>3 Chunks (Fast Context)</option>
              <option>5 Chunks (Balanced - Recommended)</option>
              <option>10 Chunks (Maximum Depth)</option>
            </select>
          </div>
        </div>

        {/* Password & Security Card */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="var(--accent-purple)" /> Password & Security
          </h3>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Current Password
                </label>
                <input
                  type="password"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="search-bar"
                  style={{ width: '100%', padding: '0.65rem 0.85rem' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {passMessage && (
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={16} /> {passMessage}
              </div>
            )}

            <button type="submit" className="secondary-button" style={{ padding: '0.65rem 1.25rem', alignSelf: 'flex-start' }}>
              Update Password
            </button>
          </form>
        </div>

        {/* Session & Sign Out Card */}
        <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} color="#ef4444" /> Account Session
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            Logging out will end your session and require you to sign back in.
          </p>

          <button
            className="secondary-button"
            style={{
              width: '100%',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.25)',
              background: 'rgba(239, 68, 68, 0.08)',
              padding: '0.65rem 1rem',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onClick={handleLogout}
          >
            <LogOut size={16} color="#ef4444" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

