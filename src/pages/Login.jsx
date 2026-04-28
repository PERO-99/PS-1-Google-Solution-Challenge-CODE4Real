import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, ArrowRight, Zap, Fingerprint } from "lucide-react";
import "./Login.css";
import DemoCredentialsPopup from "../components/DemoCredentialsPopup";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ id: "", key: "" });

  const setEmail = (email) => setCredentials(prev => ({...prev, id: email}));
  const setPassword = (password) => setCredentials(prev => ({...prev, key: password}));

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-background-glow"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand-icon animate-pulse-slow" style={{ padding: 0, overflow: "hidden" }}>
            <img src="/sentinel_logo.png" alt="Sentinel Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h1 className="login-title">SENTINEL</h1>
          <p className="login-subtitle">SECURE TERMINAL ACCESS</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>OPERATIVE ID</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input 
                type="text" 
                placeholder="Enter clearance code..." 
                value={credentials.id}
                onChange={(e) => setCredentials({...credentials, id: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>ENCRYPTION KEY</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••••••" 
                value={credentials.key}
                onChange={(e) => setCredentials({...credentials, key: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-login ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="auth-scanning">
                <Fingerprint size={18} className="spin-slow" />
                AUTHENTICATING...
              </span>
            ) : (
              <>
                INITIALIZE UPLINK <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="status-indicator">
            <div className="status-dot"></div>
            SYSTEM SECURE
          </div>
          <a href="#" className="forgot-link">Request Access?</a>
        </div>
      </div>
      <DemoCredentialsPopup setEmail={setEmail} setPassword={setPassword} />
    </div>
  );
}
