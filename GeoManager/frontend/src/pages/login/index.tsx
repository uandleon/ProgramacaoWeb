
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="grid-overlay"></div>
        
        <div className="content-wrapper">
          <header className="logo-container">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h2>GeoManager</h2>
          </header>

          <main className="hero-text">
            <h1>
              Gerencie o mundo<br />
              <span className="highlight">com precisão.</span>
            </h1>
            <p>Sistema completo de gestão geográfica: continentes, países e cidades com dados em tempo real.</p>
          </main>

          <footer className="stats-container">
            <div className="stat-item">
              <span className="stat-number">7</span>
              <span className="stat-label">Continentes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">195+</span>
              <span className="stat-label">Países</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Cidades</span>
            </div>
          </footer>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <div className="form-header">
            <h2>Bem-vindo de volta</h2>
            <p>Faça login para acessar o painel</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input type="email" id="email" placeholder="admin@geo.com" required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  defaultValue="12345678" 
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Entrar
            </button>
          </form>

          <div className="demo-info">
            <p>Demo: <span className="highlight-text">admin@geo.com</span> / <span className="highlight-text">admin123</span></p>
          </div>
        </div>
        
        <button className="help-btn">?</button>
      </div>
    </div>
  );
}