import { ReactNode, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

type AppShellProps = {
  children: ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const navItems = [
  { label: 'Home', path: '/dashboard', icon: '🏠' },
  { label: 'Library', path: '/library', icon: '📚' },
  { label: 'Upload Paper', path: '/upload', icon: '📤' },
  { label: 'AI Chat', path: '/chat', icon: '💬' },
  { label: 'Compare Papers', path: '/compare', icon: '⚖️' },
  { label: 'Literature Review', path: '/review', icon: '📝' },
  { label: 'Collections', path: '/collections', icon: '🔍' },
  { label: 'Analytics', path: '/analytics', icon: '📊' },
  { label: 'Settings', path: '/settings', icon: '⚙️' }
];

const AppShell = ({ children, theme, toggleTheme }: AppShellProps) => {
  const navigate = useNavigate();
  const { user, logout, searchQuery, setSearchQuery } = useResearch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('/collections');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-brand">
          <div className="brand-mark">✨</div>
          <div>
            <p className="brand-title">AI Research</p>
            <p className="brand-subtitle">Assistant</p>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="pro-badge">⚡ {user?.plan || 'Pro Plan'}</div>
          <p>Unlimited research access & smart synthesis.</p>
          <button
            className="primary-button"
            style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
            type="button"
            onClick={() => navigate('/settings')}
          >
            Manage Plan
          </button>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div className="topbar-left">
            <div className="search-bar">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search papers, chats, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <span className="search-shortcut" onClick={() => navigate('/collections')}>⌘K</span>
            </div>
          </div>

          <div className="topbar-right">
            <button className="icon-btn" type="button" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="icon-btn" type="button" title="Notifications" onClick={() => alert('No new notifications')}>
              🔔
              <span className="notification-dot" />
            </button>

            {/* Clickable User Profile Chip */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <div
                className="profile-chip"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title="Account Profile & Actions"
              >
                <div className="avatar">{user?.avatarInitials || 'DR'}</div>
                <span className="profile-name">{user?.name || 'Dr. Researcher'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>▼</span>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '260px',
                    background: 'var(--sidebar-bg)',
                    border: '1px solid var(--card-border-glow)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 100
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                      {user?.avatarInitials || 'DR'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user?.name || 'Dr. Researcher'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user?.email || 'researcher@domain.com'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <button
                      className="secondary-button"
                      style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                    >
                      ⚙️ Account Settings & Profile
                    </button>
                    <button
                      className="secondary-button"
                      style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      onClick={() => { setShowProfileMenu(false); navigate('/library'); }}
                    >
                      📚 My Research Library
                    </button>
                    <button
                      className="secondary-button"
                      style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      onClick={toggleTheme}
                    >
                      {theme === 'dark' ? '☀️ Switch to Light Theme' : '🌙 Switch to Dark Theme'}
                    </button>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                      <button
                        className="secondary-button"
                        style={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          color: '#f87171',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.85rem'
                        }}
                        onClick={handleLogout}
                      >
                        🚪 Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
};

export default AppShell;
