import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUserName, logout } = useResearch();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUserName(name);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Account Settings & Profile</h1>
          <p>Manage your researcher profile, display name, and authentication.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Profile Settings
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Display Name
              </label>
              <input
                type="text"
                className="search-bar"
                style={{ width: '100%', padding: '0.75rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Email Address
              </label>
              <input
                type="email"
                className="search-bar"
                style={{ width: '100%', padding: '0.75rem', opacity: 0.7 }}
                value={user?.email || 'researcher@domain.com'}
                disabled
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Subscription Tier
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="pro-badge" style={{ margin: 0 }}>{user?.plan || 'Pro Plan'}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Unlimited research access</span>
              </div>
            </div>

            {message && (
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.88rem', fontWeight: 600 }}>
                {message}
              </div>
            )}

            <button type="submit" className="primary-button" style={{ padding: '0.75rem' }}>
              Save Profile Changes
            </button>
          </form>
        </div>

        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Session & Security
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Logging out will end your current session and require you to sign back in.
          </p>

          <button
            className="secondary-button"
            style={{
              width: '100%',
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '0.85rem'
            }}
            onClick={handleLogout}
          >
            🚪 Log Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
