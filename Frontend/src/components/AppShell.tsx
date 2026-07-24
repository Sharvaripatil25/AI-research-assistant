import { ReactNode, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';
import {
  Home,
  BookOpen,
  MessageSquare,
  Scale,
  FileText,
  Bookmark,
  Settings,
  Sun,
  Moon,
  Bell,
  Sparkles,
  ChevronDown,
  ArrowRight,
  LogOut,
  Search
} from 'lucide-react';

type AppShellProps = {
  children: ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const primaryNavItems = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'AI Chat', path: '/chat', icon: MessageSquare },
  { label: 'Compare Papers', path: '/compare', icon: Scale },
  { label: 'Literature Review', path: '/review', icon: FileText },
  { label: 'Search', path: '/search', icon: Search }
];

const secondaryNavItems = [
  { label: 'Settings', path: '/settings', icon: Settings }
];

const AppShell = ({ children, theme, toggleTheme }: AppShellProps) => {
  const navigate = useNavigate();
  const { user, logout, searchQuery, setSearchQuery } = useResearch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('/search');
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
        <NavLink to="/dashboard" className="sidebar-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-mark">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
              AI Research Assistant
            </h1>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon"><Icon size={18} /></span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

          <nav className="sidebar-nav" style={{ marginTop: 0 }}>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <span className="nav-icon"><Icon size={18} /></span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div style={{ flex: 1 }} />

          <div className="topbar-right">
            <button className="icon-btn" type="button" onClick={toggleTheme} title="Toggle light/dark theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-btn" type="button" title="Notifications" onClick={() => alert('No new notifications')}>
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            {/* User Profile Avatar */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <div
                className="profile-chip"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title="Account Profile & Actions"
              >
                <div className="avatar">{user?.avatarInitials || 'AS'}</div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* User Dropdown Menu - User Info & Log Out only */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '125%',
                    right: 0,
                    width: '240px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.85rem',
                    boxShadow: 'var(--card-shadow)',
                    zIndex: 100
                  }}
                >
                  {/* User Profile Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.65rem' }}>
                    <div className="avatar" style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}>
                      {user?.avatarInitials || 'AS'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user?.name || 'Sharvari Patil'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user?.email || 'sharvaripatil333@gmail.com'}
                      </div>
                    </div>
                  </div>

                  {/* Log Out Button */}
                  <button
                    className="secondary-button"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      color: '#ef4444',
                      borderColor: 'rgba(239, 68, 68, 0.25)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={handleLogout}
                  >
                    <LogOut size={15} color="#ef4444" />
                    <span>Log Out</span>
                  </button>
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
