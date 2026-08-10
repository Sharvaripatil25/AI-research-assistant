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
  Search,
  User,
  CheckCheck,
  Trash2,
  X,
  CheckCircle2,
  Info,
  Menu
} from 'lucide-react';

type AppShellProps = {
  children: ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'paper' | 'ai' | 'system';
}

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
  const { user, logout, searchQuery, setSearchQuery, papers, chatSessions } = useResearch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // ... rest of component logic ...


  const userEmail = user?.email ? user.email.toLowerCase().trim() : 'guest';

  // Dynamic Notification state persisted in localStorage per user
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const savedUser = localStorage.getItem('research_user');
      let email = 'guest';
      if (savedUser) {
        const p = JSON.parse(savedUser);
        if (p.email) email = p.email.toLowerCase().trim();
      }
      const saved = localStorage.getItem(`notif_read_${email}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const savedUser = localStorage.getItem('research_user');
      let email = 'guest';
      if (savedUser) {
        const p = JSON.parse(savedUser);
        if (p.email) email = p.email.toLowerCase().trim();
      }
      const saved = localStorage.getItem(`notif_dismissed_${email}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync read/dismissed state when active user changes
  useEffect(() => {
    try {
      const savedRead = localStorage.getItem(`notif_read_${userEmail}`);
      setReadIds(savedRead ? JSON.parse(savedRead) : []);

      const savedDismissed = localStorage.getItem(`notif_dismissed_${userEmail}`);
      setDismissedIds(savedDismissed ? JSON.parse(savedDismissed) : []);
    } catch { }
  }, [userEmail]);

  // Save readIds to localStorage
  useEffect(() => {
    localStorage.setItem(`notif_read_${userEmail}`, JSON.stringify(readIds));
  }, [readIds, userEmail]);

  // Save dismissedIds to localStorage
  useEffect(() => {
    localStorage.setItem(`notif_dismissed_${userEmail}`, JSON.stringify(dismissedIds));
  }, [dismissedIds, userEmail]);

  // Re-generate notifications based on actual workspace activity (excluding login welcome)
  useEffect(() => {
    const list: NotificationItem[] = [];

    // 1. Real Uploaded Papers in User's Workspace
    if (papers && papers.length > 0) {
      papers.slice(0, 5).forEach((paper) => {
        const paperId = `paper-${paper.id}`;
        if (!dismissedIds.includes(paperId)) {
          const timeFormatted = paper.uploadDate
            ? new Date(paper.uploadDate).toLocaleDateString([], { month: 'short', day: 'numeric' })
            : 'Recently';
          list.push({
            id: paperId,
            title: `Paper Indexed: ${paper.title.slice(0, 40)}${paper.title.length > 40 ? '...' : ''}`,
            description: `By ${paper.authors || 'Unknown'}. Full-text indexed for AI analysis.`,
            timestamp: timeFormatted,
            read: readIds.includes(paperId),
            type: 'paper'
          });
        }
      });
    }

    // 2. Real Active Chat Sessions
    if (chatSessions && chatSessions.length > 0) {
      chatSessions.slice(0, 3).forEach((session) => {
        const sessionId = `chat-${session.id}`;
        if (!dismissedIds.includes(sessionId)) {
          list.push({
            id: sessionId,
            title: `Chat Session: ${session.title.slice(0, 35)}${session.title.length > 35 ? '...' : ''}`,
            description: `${session.messages.length} message(s) saved in session trajectory.`,
            timestamp: session.createdAt || 'Active',
            read: readIds.includes(sessionId),
            type: 'ai'
          });
        }
      });
    }

    setNotifications(list);
  }, [userEmail, papers, chatSessions, readIds, dismissedIds]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setReadIds(prev => [...new Set([...prev, ...notifications.map(n => n.id)])]);
  };

  const toggleRead = (id: string) => {
    setReadIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  const clearAllNotifications = () => {
    setDismissedIds(prev => [...new Set([...prev, ...notifications.map(n => n.id)])]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'unread') return !n.read;
    return true;
  });

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

  // Close profile dropdown & notification modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app-shell">
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar${isMobileMenuOpen ? ' mobile-open' : ''}`}>
        <NavLink
          to="/dashboard"
          className="sidebar-brand"
          style={{ textDecoration: 'none' }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
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
                onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
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
          <button
            className="mobile-hamburger-btn icon-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Toggle Navigation Menu"
          >
            <Menu size={18} />
          </button>

          <div style={{ flex: 1 }} />

          <div className="topbar-right">
            <button className="icon-btn" type="button" onClick={toggleTheme} title="Toggle light/dark theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Trigger & Modal */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="icon-btn"
                type="button"
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-dot" />}
              </button>

              {/* Notification Modal / Popover */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '125%',
                    right: 0,
                    width: '350px',
                    maxHeight: '480px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg, 12px)',
                    boxShadow: 'var(--card-shadow, 0 12px 32px rgba(0, 0, 0, 0.25))',
                    zIndex: 110,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span
                          style={{
                            background: 'var(--primary-color, #6366f1)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '10px'
                          }}
                        >
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          title="Mark all as read"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary-color, #6366f1)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px'
                          }}
                        >
                          <CheckCheck size={14} />
                          <span>Mark all read</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        title="Close"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <button
                      onClick={() => setNotifFilter('all')}
                      style={{
                        background: notifFilter === 'all' ? 'var(--primary-color, #6366f1)' : 'transparent',
                        color: notifFilter === 'all' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.25rem 0.65rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotifFilter('unread')}
                      style={{
                        background: notifFilter === 'unread' ? 'var(--primary-color, #6366f1)' : 'transparent',
                        color: notifFilter === 'unread' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.25rem 0.65rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  {/* Notification List */}
                  <div style={{ flex: 1, overflowY: 'auto', maxHeight: '320px', padding: '0.35rem' }}>
                    {filteredNotifications.length === 0 ? (
                      <div
                        style={{
                          padding: '2rem 1rem',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem'
                        }}
                      >
                        <CheckCircle2 size={32} style={{ marginBottom: '0.5rem', color: 'var(--primary-color, #6366f1)', opacity: 0.7 }} />
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>You're all caught up!</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>No {notifFilter === 'unread' ? 'unread ' : ''}notifications.</div>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => toggleRead(notif.id)}
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0.65rem 0.75rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                            borderLeft: notif.read ? '3px solid transparent' : '3px solid var(--primary-color, #6366f1)',
                            marginBottom: '0.25rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: notif.type === 'paper' ? 'rgba(59, 130, 246, 0.15)' : notif.type === 'ai' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: notif.type === 'paper' ? '#3b82f6' : notif.type === 'ai' ? '#a855f7' : '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {notif.type === 'paper' ? <FileText size={16} /> : notif.type === 'ai' ? <Sparkles size={16} /> : <Info size={16} />}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                              <span style={{ fontWeight: notif.read ? 600 : 700, fontSize: '0.83rem', color: 'var(--text-main)' }}>
                                {notif.title}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '0.5rem', flexShrink: 0 }}>
                                {notif.timestamp}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                              {notif.description}
                            </div>
                          </div>

                          <button
                            onClick={(e) => deleteNotification(notif.id, e)}
                            title="Dismiss"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '0.2rem',
                              opacity: 0.6
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <button
                        onClick={clearAllNotifications}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Clear all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <div
                className="profile-chip"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title="Account Profile & Actions"
              >
                <div className="avatar">{user?.avatarInitials || 'U'}</div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* User Dropdown Menu - User Info & Actions */}
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
                    padding: '0.75rem',
                    boxShadow: 'var(--card-shadow)',
                    zIndex: 100
                  }}
                >
                  {/* User Profile Info (Clickable) */}
                  <div
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    title="Click to view profile & settings"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-md, 8px)',
                      cursor: 'pointer',
                      marginBottom: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="avatar" style={{ width: '38px', height: '38px', fontSize: '0.85rem', flexShrink: 0 }}>
                      {user?.avatarInitials || 'U'}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user?.name || 'Researcher'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user?.email || ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.35rem 0 0.5rem 0' }} />

                  {/* View Profile Option */}
                  <button
                    className="secondary-button"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      color: 'var(--text-main)',
                      borderColor: 'var(--border-color)',
                      background: 'transparent',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.4rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                  >
                    <User size={15} color="var(--text-main)" />
                    <span>View Profile</span>
                  </button>

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
                      gap: '0.5rem',
                      cursor: 'pointer'
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
