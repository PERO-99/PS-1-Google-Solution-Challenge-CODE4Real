import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSentinel } from "../context/SentinelContext.jsx";
import {
  Scale, Copy, Check, RefreshCw, FileText,
  AlertTriangle, Download, Send
} from "lucide-react";
import PlatformLogo from "../components/PlatformLogo.jsx";
import "./LegalForge.css";

export default function LegalForge() {
  const { dmcaTarget, dmcaText, dmcaLoading, generateDmca } = useSentinel();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dmcaText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([dmcaText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DMCA_Notice_${dmcaTarget?.platform || "Unknown"}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="legal-forge animate-fadeUp">
      {!dmcaTarget ? (
        <div className="legal-empty panel animate-fadeUp">
          <Scale size={48} style={{ opacity: 0.15, marginBottom: 16 }} />
          <h2>Legal Forge</h2>
          <p>Select a threat from Threat Dossiers and click "Generate DMCA" to draft a legal notice here.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/dossiers")}>
            <FileText size={14} /> Go to Dossiers
          </button>
        </div>
      ) : (
        <div className="legal-grid">
          {/* ── Target info ── */}
          <div className="panel legal-target animate-fadeUp delay-1">
            <p className="panel-title">TARGET VIOLATION</p>
            <div className="target-info">
              <div className="target-row">
                <span className="target-label">PLATFORM</span>
                <span className="badge" style={{ color: "var(--cyan)", borderColor: "rgba(72,195,255,0.3)", gap: 6 }}>
                  <PlatformLogo platform={dmcaTarget.platform} size={13} />
                  {dmcaTarget.platform}
                </span>
              </div>
              <div className="target-row">
                <span className="target-label">CHANNEL</span>
                <span className="target-val">{dmcaTarget.channel}</span>
              </div>
              <div className="target-row">
                <span className="target-label">RISK SCORE</span>
                <span className="target-val" style={{ color: dmcaTarget.severity === "HIGH" ? "#ff6b8a" : dmcaTarget.severity === "MEDIUM" ? "var(--amber)" : "#00ffb3" }}>
                  {dmcaTarget.score}% — {dmcaTarget.severity}
                </span>
              </div>
              <div className="target-row">
                <span className="target-label">DAMAGE EST.</span>
                <span className="target-val" style={{ color: "var(--amber)" }}>
                  ₹{(dmcaTarget.damageEstimateUsd || 0).toLocaleString()}
                </span>
              </div>
              <div className="target-row">
                <span className="target-label">URL</span>
                <a href={dmcaTarget.url} target="_blank" rel="noreferrer" className="target-url">
                  {dmcaTarget.url?.slice(0, 40)}...
                </a>
              </div>
            </div>

            <div className="target-title-box">
              <p className="panel-title">INFRINGING CONTENT</p>
              <p className="target-content-title">{dmcaTarget.title}</p>
              <p className="target-reason">{dmcaTarget.reason}</p>
            </div>

            <div className="legal-actions-side">
              <button className="btn btn-danger" onClick={() => generateDmca(dmcaTarget)}>
                <RefreshCw size={12} /> REGENERATE
              </button>
              <button className="btn" onClick={() => navigate("/dossiers")}>
                ← BACK TO DOSSIERS
              </button>
            </div>
          </div>

          {/* ── Notice editor ── */}
          <div className="panel legal-notice animate-fadeUp delay-2">
            <div className="notice-header">
              <p className="panel-title">DMCA TAKEDOWN NOTICE</p>
              <div className="notice-actions">
                <button className="btn" onClick={handleCopy} disabled={!dmcaText}>
                  {copied ? <><Check size={12} /> COPIED</> : <><Copy size={12} /> COPY</>}
                </button>
                <button className="btn btn-primary" onClick={handleDownload} disabled={!dmcaText}>
                  <Download size={12} /> DOWNLOAD
                </button>
                <button className="btn" disabled={!dmcaText}>
                  <Send size={12} /> SEND
                </button>
              </div>
            </div>

            {dmcaLoading ? (
              <div className="notice-loading">
                <div className="notice-loading-spinner" />
                <p>Drafting legal notice with AI...</p>
                <div className="notice-loading-bars">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="loading-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <textarea
                className="notice-textarea"
                value={dmcaText}
                readOnly
                spellCheck={false}
              />
            )}

            <div className="notice-footer">
              <AlertTriangle size={12} style={{ color: "var(--amber)" }} />
              <span>This notice is AI-generated. Review with legal counsel before sending.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
