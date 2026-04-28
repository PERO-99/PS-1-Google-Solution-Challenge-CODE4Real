import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './DemoCredentialsPopup.css';

export default function DemoCredentialsPopup({ setEmail, setPassword }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="demo-popup-card">
      <button className="demo-popup-close" onClick={() => setShow(false)}>
        <X size={20} />
      </button>
      
      <div className="demo-popup-title">🔐 DEMO ACCESS</div>
      <div className="demo-popup-subtitle">Use these to login</div>
      
      <div className="demo-popup-divider"></div>
      
      <div className="demo-popup-field">
        <div className="demo-popup-label">OPERATIVE ID</div>
        <div className="demo-popup-value">demo@sentinel.io</div>
      </div>
      
      <div className="demo-popup-field">
        <div className="demo-popup-label">ENCRYPTION KEY</div>
        <div className="demo-popup-value">sentinel2026</div>
      </div>
      
      <div className="demo-popup-divider"></div>
      
      <button 
        className="demo-popup-button"
        onClick={() => {
          setEmail("demo@sentinel.io");
          setPassword("sentinel2026");
          setShow(false);
        }}
      >
        AUTO-FILL CREDENTIALS
      </button>
    </div>
  );
}
