import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSentinel } from "../context/SentinelContext.jsx";
import { Crosshair, Upload, ChevronRight, Radio } from "lucide-react";
import PlatformLogo from "../components/PlatformLogo.jsx";
import "./Hunter.css";

const PLATFORMS = [
  { key: "youtube",   label: "YouTube",     color: "#ff0000" },
  { key: "x",         label: "X / Twitter", color: "#1da1f2" },
  { key: "tiktok",    label: "TikTok",      color: "#69c9d0" },
  { key: "instagram", label: "Instagram",   color: "#e1306c" },
  { key: "facebook",  label: "Facebook",    color: "#1877f2" },
  { key: "twitch",    label: "Twitch",      color: "#9146ff" },
  { key: "reddit",    label: "Reddit",      color: "#ff4500" },
];

export default function Hunter() {
  const {
    contentName, setContentName,
    keywords, setKeywords,
    orgName, setOrgName,
    maxResults, setMaxResults,
    includePlatforms, togglePlatform,
    runScan, status, progress, scanError, logs,
  } = useSentinel();

  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleScan = () => {
    runScan(file);
  };

  const scanning = status === "scanning";

  return (
    <div className="hunter animate-fadeUp">
      <input
        ref={fileRef}
        type="file"
        accept="video/*,image/*"
        style={{ display: "none" }}
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <div className="hunter-grid">
        {/* ── Config panel ── */}
        <div className="panel hunter-config animate-fadeUp delay-1">
          <p className="panel-title">SCAN CONFIGURATION</p>

          <div className="form-group">
            <label className="form-label">PROTECTED CONTENT NAME</label>
            <input
              className="input"
              value={contentName}
              onChange={e => setContentName(e.target.value)}
              placeholder="e.g. IPL 2026 Final — Mumbai vs Chennai"
            />
          </div>

          <div className="form-group">
            <label className="form-label">KEYWORDS & HASHTAGS</label>
            <input
              className="input"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="e.g. IPL final live stream free watch"
            />
          </div>

          <div className="form-group">
            <label className="form-label">RIGHTS HOLDER / ORGANIZATION</label>
            <input
              className="input"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              placeholder="e.g. Star Sports India Pvt. Ltd."
            />
          </div>

          <div className="form-group">
            <label className="form-label">MAX RESULTS PER PLATFORM</label>
            <input
              className="input"
              type="number"
              min={3}
              max={20}
              value={maxResults}
              onChange={e => setMaxResults(Math.max(3, Math.min(20, Number(e.target.value) || 8)))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">TARGET PLATFORMS</label>
            <div className="platform-toggles">
              {PLATFORMS.map(({ key, label, color }) => (
                <button
                  key={key}
                  className={`platform-toggle ${includePlatforms[key] ? "on" : ""}`}
                  style={includePlatforms[key] ? { borderColor: color, color, background: `${color}18` } : {}}
                  onClick={() => togglePlatform(key)}
                >
                  <PlatformLogo platform={key} size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">REFERENCE CLIP (OPTIONAL)</label>
            <div
              className={`dropzone ${file ? "dropzone--loaded" : ""}`}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={20} style={{ marginBottom: 8, opacity: 0.5 }} />
              {file ? (
                <div>
                  <div className="dropzone-filename">{file.name}</div>
                  <div className="dropzone-sub">Click to replace</div>
                </div>
              ) : (
                <div>
                  <div className="dropzone-title">Drop reference clip here</div>
                  <div className="dropzone-sub">Video or image · Used for perceptual fingerprinting</div>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {scanning && (
            <div className="scan-progress">
              <div className="scan-progress-header">
                <span>SCANNING {progress.toFixed(0)}%</span>
                <span className="scan-spinner" />
              </div>
              <div className="progress-bar">
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {scanError && (
            <div className="scan-error">{scanError}</div>
          )}

          <div className="hunter-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleScan}
              disabled={scanning}
              style={{ flex: 1 }}
            >
              {scanning ? (
                <><span className="scan-spinner" /> SCANNING...</>
              ) : (
                <><Crosshair size={14} /> RUN LIVE SCAN</>
              )}
            </button>
            {status === "complete" && (
              <button className="btn btn-lg" onClick={() => navigate("/dossiers")}>
                VIEW DOSSIERS <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Telemetry panel ── */}
        <div className="panel hunter-telemetry animate-fadeUp delay-2">
          <p className="panel-title">SCAN TELEMETRY</p>
          <div className="telemetry-log">
            {logs.length === 0 ? (
              <div className="telemetry-empty">
                <Radio size={24} style={{ opacity: 0.2, marginBottom: 8 }} />
                <p>Awaiting scan command...</p>
              </div>
            ) : (
              logs.map((l, i) => (
                <div key={i} className="telemetry-line">
                  <span className="telemetry-time">{l.t}</span>
                  <span className="telemetry-icon" style={{
                    color: l.type === "error" ? "#ff6b8a" : l.type === "warn" ? "#ffcc44" : l.type === "ok" ? "#00ffb3" : "var(--cyan)"
                  }}>
                    {l.type === "error" ? "✗" : l.type === "ok" ? "✓" : l.type === "warn" ? "⚠" : "›"}
                  </span>
                  <span className="telemetry-msg" style={{
                    color: l.type === "error" ? "#ff6b8a" : l.type === "warn" ? "#ffcc44" : l.type === "ok" ? "#00ffb3" : "var(--txt-soft)"
                  }}>{l.m}</span>
                </div>
              ))
            )}
          </div>

          {/* Platform scan status */}
          <div style={{ marginTop: 16 }}>
            <p className="panel-title">PLATFORM STATUS</p>
            <div className="platform-status-grid">
              {PLATFORMS.map(({ key, label, color }) => {
                const active = includePlatforms[key];
                const done = status === "complete" && active;
                const running = scanning && active;
                return (
                  <div key={key} className={`platform-status-item ${!active ? "disabled" : ""}`}>
                    <PlatformLogo platform={key} size={14} />
                    <span>{label}</span>
                    <div className="platform-status-dot" style={{
                      background: done ? "#00ffb3" : running ? "#ffcc44" : active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                      animation: running ? "pulse 1s ease infinite" : "none",
                    }} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
