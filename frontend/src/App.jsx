import { useState } from 'react';
import './index.css';

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignUp
      ? formData
      : { username: formData.username, password: formData.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication error');
      }

      setUser(data);
      setStatus({ type: 'success', text: isSignUp ? 'Account created!' : 'Signed in!' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setFormData({ username: '', email: '', password: '' });
    setStatus(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="page-container">
        <div className="main-layout">
          {/* Desktop Left Hero Section */}
          <div className="hero-section">
            <div className="brand-icon-large">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <h1 className="hero-heading">
              See everyday moments from your <span>friends.</span>
            </h1>
            <div className="hero-card-preview">
              <div className="preview-pill">📸 Share & Connect</div>
            </div>
          </div>

          {/* Right Auth Card Section */}
          <div className="auth-section">
            <div className="mobile-brand-header">
              <div className="brand-icon-large">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </div>

            <div className="form-card">
              {user ? (
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '12px' }}>Welcome, @{user.username}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                    Authenticated with MongoDB Backend
                  </p>
                  <button className="btn-primary" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="form-title">
                    {isSignUp ? 'Create your account' : 'Log into SocialNet'}
                  </h2>

                  {status && (
                    <div className={`status-box ${status.type}`}>
                      {status.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="username"
                      placeholder="Mobile number, username or email"
                      className="input-field"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />

                    {isSignUp && (
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    )}

                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="input-field"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <button type="submit" className="btn-primary">
                      {isSignUp ? 'Sign up' : 'Log in'}
                    </button>
                  </form>

                  {!isSignUp && (
                    <a href="#forgot" className="forgot-link">
                      Forgot password?
                    </a>
                  )}

                  <button
                    className="btn-secondary"
                    onClick={() => alert('SSO integration placeholder')}
                  >
                    Log in with SSO
                  </button>

                  <button
                    className="btn-outline"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setStatus(null);
                    }}
                  >
                    {isSignUp ? 'Already have an account? Log in' : 'Create new account'}
                  </button>

                  <div className="meta-watermark">Earn With Login App</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Links */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#blog">Blog</a>
          <a href="#jobs">Jobs</a>
          <a href="#help">Help</a>
          <a href="#api">API</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#locations">Locations</a>
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          © 2026 SocialNet Demo Project
        </div>
      </footer>
    </div>
  );
}
