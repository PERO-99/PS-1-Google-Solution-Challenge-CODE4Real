import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Shield, Zap, Globe, Scale, BarChart3, Eye,
  ArrowRight, Play, CheckCircle, TrendingUp
} from "lucide-react";
import PlatformLogo from "../components/PlatformLogo.jsx";
import "./Landing.css";

const STATS = [
  { val: "₹180M+", label: "Revenue Protected" },
  { val: "2.4M+", label: "Violations Detected" },
  { val: "7",     label: "Platforms Monitored" },
  { val: "< 3s",  label: "Detection Speed" },
];

const FEATURES = [
  {
    icon: Eye,
    color: "#48c3ff",
    title: "AI-Powered Detection",
    desc: "Perceptual fingerprinting + semantic analysis catches even re-encoded, cropped, or speed-altered pirated content across all major platforms.",
  },
  {
    icon: Globe,
    color: "#1fe6a8",
    title: "7-Platform Coverage",
    desc: "YouTube, X, TikTok, Instagram, Facebook, Twitch, Reddit — monitored simultaneously in real time with a single scan command.",
  },
  {
    icon: Scale,
    color: "#a78bfa",
    title: "One-Click Legal Forge",
    desc: "AI-drafted DMCA takedown notices, platform-specific complaint templates, and legal dossiers generated in seconds.",
  },
  {
    icon: BarChart3,
    color: "#ffbc57",
    title: "Revenue Intelligence",
    desc: "Estimate ad revenue lost per violation, total damage exposure, and ROI of enforcement — data that moves investors.",
  },
  {
    icon: Zap,
    color: "#ff567d",
    title: "Real-Time Alerts",
    desc: "Live activity feed with severity scoring, threat trajectory charts, and instant notifications when new violations surface.",
  },
  {
    icon: TrendingUp,
    color: "#48c3ff",
    title: "Analytics Command Center",
    desc: "Platform pressure maps, violation trends, enforcement success rates — everything a rights holder needs to make decisions.",
  },
];

const PLATFORMS = [
  { name: "YouTube",    key: "youtube",   color: "#ff0000" },
  { name: "X / Twitter", key: "x",        color: "#1da1f2" },
  { name: "TikTok",     key: "tiktok",    color: "#69c9d0" },
  { name: "Instagram",  key: "instagram", color: "#e1306c" },
  { name: "Twitch",     key: "twitch",    color: "#9146ff" },
  { name: "Facebook",   key: "facebook",  color: "#1877f2" },
  { name: "Reddit",     key: "reddit",    color: "#ff4500" },
];

const TEAM = [
  { name: "Ranjeet Kumar",   role: "Team Lead · Full Stack",    avatar: "RK", color: "#48c3ff" },
  { name: "Manjeet Kumar",   role: "Backend · API Systems",     avatar: "MK", color: "#1fe6a8" },
  { name: "Mayank Bhaskar",  role: "Frontend · UI/UX",          avatar: "MB", color: "#a78bfa" },
  { name: "Aakriti Singh",   role: "Research · Legal Strategy", avatar: "AS", color: "#ffbc57" },
];

function AnimatedCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const isFloat = target.includes(".");
        const duration = 1200;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const cur = isFloat ? (eased * num).toFixed(1) : Math.round(eased * num);
          setVal(cur);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Landing() {
  const navigate = useNavigate();
  const [scanDemo, setScanDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoThreats, setDemoThreats] = useState(0);

  const runDemo = () => {
    setScanDemo(true);
    setDemoProgress(0);
    setDemoThreats(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 3;
      if (p >= 100) { p = 100; clearInterval(iv); setDemoThreats(14); }
      setDemoProgress(Math.min(p, 100));
    }, 120);
  };

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="brand-logo">
            <div className="brand-icon-lg animate-glow">
              <img src="/sentinel_logo.png" alt="Sentinel Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            </div>
            <div>
              <div className="brand-name-lg">SENTINEL</div>
              <div className="brand-tagline">SPORTS IP PROTECTION ENGINE</div>
            </div>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#platforms">Platforms</a>
            <a href="#team">Team</a>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
              Launch App <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fadeUp">
            <span className="hero-badge-dot" />
            AI-Powered · Real-Time · 7 Platforms
          </div>

          <h1 className="hero-title animate-fadeUp delay-1">
            Stop Sports Piracy<br />
            <span className="hero-gradient">Before It Costs You</span>
          </h1>

          <p className="hero-sub animate-fadeUp delay-2">
            SENTINEL is the world's most advanced sports content protection platform.
            Detect unauthorized broadcasts, generate legal takedowns, and protect
            millions in revenue — all in under 3 seconds.
          </p>

          <div className="hero-actions animate-fadeUp delay-3">
            <button className="btn btn-primary btn-xl" onClick={() => navigate("/login")}>
              <Shield size={16} />
              Enter Command Center
            </button>
            <button className="btn btn-xl" onClick={runDemo}>
              <Play size={16} />
              Watch Live Demo
            </button>
          </div>

          {/* Demo scan widget */}
          {scanDemo && (
            <div className="demo-widget animate-fadeUp">
              <div className="demo-header">
                <span className="demo-dot" />
                <span>LIVE SCAN DEMO — IPL 2026 Final</span>
                {demoThreats > 0 && <span className="demo-threats">{demoThreats} VIOLATIONS FOUND</span>}
              </div>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div style={{ width: `${demoProgress}%` }} />
              </div>
              <div className="demo-platforms">
                {PLATFORMS.map((p, i) => (
                  <div key={p.name} className="demo-platform" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="demo-platform-dot" style={{
                      background: demoProgress > (i + 1) * 14 ? p.color : "rgba(255,255,255,0.1)"
                    }} />
                    <PlatformLogo platform={p.key} size={13} />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating stats */}
        <div className="hero-stats animate-fadeUp delay-4">
          {STATS.map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="hero-stat-val">
                {s.val.includes("+") ? (
                  <><AnimatedCounter target={s.val} />{s.val.includes("M") ? "M+" : "+"}</>
                ) : s.val}
              </div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Features ── */}
      <section id="features" className="section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">CAPABILITIES</p>
            <h2 className="section-title">Built for Rights Holders Who Mean Business</h2>
            <p className="section-desc">
              Every feature is designed around one goal: protect your content, recover your revenue, and win in court.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card animate-fadeUp delay-${i + 1}`}>
                <div className="feature-icon" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={20} color={f.color} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section id="platforms" className="section section-dark">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">COVERAGE</p>
            <h2 className="section-title">Every Platform. One Command.</h2>
          </div>
          <div className="platforms-row">
            {PLATFORMS.map((p, i) => (
              <div key={p.name} className={`platform-pill animate-fadeUp delay-${i + 1}`}>
                <PlatformLogo platform={p.key} size={18} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          <div className="platform-visual">
            <div className="radar-container">
              <div className="radar-ring r1" />
              <div className="radar-ring r2" />
              <div className="radar-ring r3" />
              <div className="radar-sweep" />
              <div className="radar-center">
                <Shield size={24} color="#48c3ff" />
              </div>
              {PLATFORMS.map((p, i) => {
                const angle = (i / PLATFORMS.length) * 2 * Math.PI - Math.PI / 2;
                const r = 110;
                const x = 50 + (r / 2.4) * Math.cos(angle);
                const y = 50 + (r / 2.4) * Math.sin(angle);
                return (
                  <div
                    key={p.name}
                    className="radar-blip animate-pulse"
                    style={{
                      left: `${x}%`, top: `${y}%`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                    title={p.name}
                  >
                    <PlatformLogo platform={p.key} size={20} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">WORKFLOW</p>
            <h2 className="section-title">From Upload to Takedown in 4 Steps</h2>
          </div>
          <div className="steps-row">
            {[
              { n: "01", title: "Upload Reference", desc: "Drop your protected sports clip or enter content metadata." },
              { n: "02", title: "AI Scans 7 Platforms", desc: "Perceptual fingerprinting + keyword hunting runs simultaneously." },
              { n: "03", title: "Review Threat Dossiers", desc: "Every violation scored by severity, views, and estimated damage." },
              { n: "04", title: "Deploy Legal Action", desc: "One-click DMCA notices, platform reports, and legal packages." },
            ].map((s, i) => (
              <div key={i} className={`step-card animate-fadeUp delay-${i + 1}`}>
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < 3 && <div className="step-arrow"><ArrowRight size={16} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section id="team" className="section section-dark">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">THE TEAM</p>
            <h2 className="section-title">Built by 1st Year Students Who Mean Business</h2>
            <p className="section-desc">
              Four first-year engineering students who decided piracy was a problem worth solving — and built a full-stack AI platform to prove it.
            </p>
          </div>
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <div key={i} className={`team-card animate-fadeUp delay-${i + 1}`}>
                <div className="team-avatar" style={{ background: `${m.color}20`, border: `1px solid ${m.color}40`, color: m.color }}>
                  {m.avatar}
                </div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <div className="team-badge">1st Year · B.Tech</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="section-inner">
          <div className="cta-box">
            <div className="cta-glow" />
            <p className="section-eyebrow">READY TO WIN</p>
            <h2 className="cta-title">Protect Your Content.<br />Recover Your Revenue.</h2>
            <p className="cta-sub">
              Join the teams using SENTINEL to detect piracy in real time and enforce their rights at scale.
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-xl" onClick={() => navigate("/login")}>
                <Shield size={16} />
                Launch SENTINEL
              </button>
              <button className="btn btn-xl" onClick={() => navigate("/hunter")}>
                <Zap size={16} />
                Run First Scan
              </button>
            </div>
            <div className="cta-checks">
              {["No setup required", "Works without API keys", "DMCA ready in seconds"].map((c, i) => (
                <div key={i} className="cta-check">
                  <CheckCircle size={14} color="#00ffb3" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <Shield size={16} color="#48c3ff" />
          <span>SENTINEL v3</span>
        </div>
        <p className="footer-copy">© 2026 Sentinel · Built by Ranjeet, Manjeet, Mayank & Aakriti · 1st Year B.Tech Students</p>
      </footer>
    </div>
  );
}
