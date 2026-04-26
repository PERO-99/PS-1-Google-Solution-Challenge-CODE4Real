import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSentinel } from "../context/SentinelContext.jsx";
import {
  LayoutDashboard, Crosshair, FileWarning, Scale,
  BarChart3, Settings, ChevronLeft, ChevronRight,
  Shield, Activity, Zap, Bell, Sun, Moon
} from "lucide-react";
import "./AppShell.css";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Mission Control" },
  { to: "/hunter",    icon: Crosshair,       label: "Live Hunter" },
  { to: "/dossiers",  icon: FileWarning,     label: "Threat Dossiers" },
  { to: "/legal",     icon: Scale,           label: "Legal Forge" },
  { to: "/analytics", icon: BarChart3,       label: "Analytics" },
  { to: "/settings",  icon: Settings,        label: "System Config" },
];

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [clock, setClock]         = useState("");
  const { threats, status, feed } = useSentinel();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("sentinel-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sentinel-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const highCount = threats.filter(t => t.severity === "HIGH").length;

  return (
    <div className={`shell ${collapsed ? "shell--collapsed" : ""}`}>
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-icon animate-glow" style={{ padding: 0, overflow: "hidden" }}>
              <img src="/sentinel_logo.png" alt="Sentinel Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {!collapsed && (
              <div className="brand-text">
                <span className="brand-name">SENTINEL</span>
                <span className="brand-ver">v3 · SPORTS IP ENGINE</span>
              </div>
            )}
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <p className="section-label" style={{ padding: "0 14px" }}>NAVIGATION</p>}
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={16} />
              {!collapsed && <span>{label}</span>}
              {to === "/dossiers" && threats.length > 0 && (
                <span className="nav-badge">{threats.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-stats">
            <p className="section-label" style={{ padding: "0 14px" }}>LIVE STATS</p>
            <div className="stat-row">
              <span className="stat-label">THREATS</span>
              <span className="stat-val" style={{ color: highCount > 0 ? "#ff6b8a" : "#00ffb3" }}>
                {threats.length}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">STATUS</span>
              <span className="stat-val" style={{ color: status === "scanning" ? "var(--amber)" : status === "complete" ? "#00ffb3" : "var(--txt-soft)" }}>
                {status.toUpperCase()}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">HIGH RISK</span>
              <span className="stat-val" style={{ color: "#ff6b8a" }}>{highCount}</span>
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="sidebar-feed">
            <p className="section-label" style={{ padding: "0 14px" }}>ACTIVITY</p>
            <div className="feed-mini">
              {feed.slice(-5).reverse().map((f, i) => (
                <div key={i} className="feed-mini-item">
                  <span className="feed-mini-dot" style={{
                    background: f.type === "error" ? "#ff6b8a" : f.type === "warn" ? "#ffcc44" : f.type === "ok" ? "#00ffb3" : "var(--cyan)"
                  }} />
                  <span className="feed-mini-text">{f.m}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div className="shell-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-breadcrumb">
              {NAV.find(n => n.to === location.pathname)?.label || "SENTINEL"}
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-status">
              <Activity size={12} style={{ color: "#00ffb3" }} />
              <span>LIVE</span>
            </div>
            <span className="badge">
              <Zap size={10} />
              {clock}
            </span>
            {highCount > 0 && (
              <span className="badge" style={{ borderColor: "rgba(255,107,138,0.5)", color: "#ff6b8a" }}>
                <Bell size={10} />
                {highCount} HIGH RISK
              </span>
            )}
            <button className="btn" onClick={toggleTheme} style={{ fontSize: 10, padding: "6px 12px" }}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <a href="/" className="btn" style={{ fontSize: 10, padding: "6px 12px" }}>← HOME</a>
          </div>
        </header>

        {/* Page content */}
        <main className="shell-content">
          {children}
        </main>
      </div>
    </div>
  );
}
