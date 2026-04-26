import { useSentinel } from "../context/SentinelContext.jsx";
import { CheckCircle, XCircle, Server, Key, Info, Shield, Zap } from "lucide-react";
import "./Settings.css";

export default function Settings() {
  const { apiHealth } = useSentinel();

  const integrations = [
    {
      name: "YouTube Data API v3",
      key: "YOUTUBE_API_KEY",
      status: apiHealth?.integrations?.youtube,
      desc: "Enables real-time YouTube search for pirated content. Without this, mock data is used.",
      color: "#ff0000",
    },
    {
      name: "SerpAPI (X + TikTok)",
      key: "SERPAPI_KEY",
      status: apiHealth?.integrations?.serpapi,
      desc: "Powers X and TikTok search via Google. Without this, mock data is used.",
      color: "#1da1f2",
    },
    {
      name: "OpenAI API",
      key: "OPENAI_API_KEY",
      status: false,
      desc: "Optional: enables AI-authored DMCA notices and threat analysis summaries.",
      color: "#10a37f",
    },
  ];

  return (
    <div className="settings animate-fadeUp">
      {/* System health */}
      <div className="settings-section panel animate-fadeUp delay-1">
        <p className="panel-title">SYSTEM HEALTH</p>
        <div className="health-grid">
          <div className="health-item">
            <Server size={16} style={{ color: apiHealth?.ok ? "#00ffb3" : "#ff6b8a" }} />
            <div>
              <div className="health-name">API Server</div>
              <div className="health-status" style={{ color: apiHealth?.ok ? "#00ffb3" : "#ff6b8a" }}>
                {apiHealth?.ok ? "ONLINE" : "OFFLINE"} · 127.0.0.1:8787
              </div>
            </div>
            {apiHealth?.ok
              ? <CheckCircle size={16} style={{ color: "#00ffb3", marginLeft: "auto" }} />
              : <XCircle    size={16} style={{ color: "#ff6b8a",  marginLeft: "auto" }} />
            }
          </div>
          <div className="health-item">
            <Zap size={16} style={{ color: "var(--cyan)" }} />
            <div>
              <div className="health-name">Frontend</div>
              <div className="health-status" style={{ color: "#00ffb3" }}>ONLINE · Vite + React 18</div>
            </div>
            <CheckCircle size={16} style={{ color: "#00ffb3", marginLeft: "auto" }} />
          </div>
          <div className="health-item">
            <Shield size={16} style={{ color: "var(--purple)" }} />
            <div>
              <div className="health-name">Scan Engine</div>
              <div className="health-status" style={{ color: "#00ffb3" }}>READY · 7 platforms configured</div>
            </div>
            <CheckCircle size={16} style={{ color: "#00ffb3", marginLeft: "auto" }} />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="settings-section panel animate-fadeUp delay-2">
        <p className="panel-title">API INTEGRATIONS</p>
        <div className="integrations-list">
          {integrations.map((intg, i) => (
            <div key={i} className="integration-item">
              <div className="integration-dot" style={{ background: intg.status ? "#00ffb3" : "rgba(255,255,255,0.12)" }} />
              <div className="integration-info">
                <div className="integration-name">{intg.name}</div>
                <div className="integration-key">
                  <Key size={10} />
                  <code>{intg.key}</code>
                </div>
                <div className="integration-desc">{intg.desc}</div>
              </div>
              <div className={`integration-badge ${intg.status ? "live" : "fallback"}`}>
                {intg.status ? "LIVE" : "FALLBACK"}
              </div>
            </div>
          ))}
        </div>
        <div className="settings-note">
          <Info size={13} style={{ color: "var(--cyan)", flexShrink: 0 }} />
          <span>
            Add API keys to your <code>.env</code> file and restart the server.
            The app works fully without any keys using intelligent mock data.
          </span>
        </div>
      </div>

      {/* Demo checklist */}
      <div className="settings-section panel animate-fadeUp delay-3">
        <p className="panel-title">DEMO CHECKLIST</p>
        <div className="checklist">
          {[
            { step: "01", title: "Open Live Hunter",         desc: "Navigate to the Live Hunter page" },
            { step: "02", title: "Configure scan",           desc: "Enter content name, keywords, and select platforms" },
            { step: "03", title: "Upload reference clip",    desc: "Optional: drop a video for fingerprint matching" },
            { step: "04", title: "Run Live Scan",            desc: "Hit the scan button and watch telemetry in real time" },
            { step: "05", title: "Review Threat Dossiers",   desc: "Filter by severity, view damage estimates" },
            { step: "06", title: "Generate DMCA Notice",     desc: "One click to draft a legal takedown notice" },
            { step: "07", title: "Show Analytics",           desc: "Demonstrate trend charts and platform radar" },
          ].map((c, i) => (
            <div key={i} className="checklist-item">
              <div className="checklist-num">{c.step}</div>
              <div>
                <div className="checklist-title">{c.title}</div>
                <div className="checklist-desc">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="settings-section panel animate-fadeUp delay-4">
        <p className="panel-title">ABOUT SENTINEL v3</p>
        <div className="about-grid">
          {[
            { label: "VERSION",    val: "3.0.0" },
            { label: "STACK",      val: "React 18 + Vite + Express" },
            { label: "PLATFORMS",  val: "7 (YouTube, X, TikTok, Instagram, Facebook, Twitch, Reddit)" },
            { label: "AI ENGINE",  val: "Perceptual Fingerprinting + Semantic Scoring" },
            { label: "LEGAL",      val: "DMCA 17 U.S.C. 512(c) Compliant Templates" },
            { label: "TEAM",       val: "Ranjeet Kumar, Manjeet Kumar, Mayank Bhaskar, Aakriti Singh" },
            { label: "YEAR",       val: "1st Year B.Tech Students" },
            { label: "BUILD",      val: "Hackathon Edition · April 2026" },
          ].map((a, i) => (
            <div key={i} className="about-row">
              <span className="about-label">{a.label}</span>
              <span className="about-val">{a.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
