import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSentinel } from "../context/SentinelContext.jsx";
import {
  AlertTriangle, ExternalLink, Scale, Filter,
  TrendingUp, Eye, DollarSign, Search
} from "lucide-react";
import PlatformLogo from "../components/PlatformLogo.jsx";
import "./Dossiers.css";

const SEV_COLOR = { HIGH: "#ff6b8a", MEDIUM: "#ffcc44", LOW: "#00ffb3" };
const SEV_BG    = { HIGH: "rgba(255,107,138,0.14)", MEDIUM: "rgba(255,204,68,0.12)", LOW: "rgba(0,255,179,0.12)" };

export default function Dossiers() {
  const { threats, generateDmca } = useSentinel();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score");

  const filtered = useMemo(() => {
    let list = [...threats];
    if (filter !== "ALL") list = list.filter(t => t.severity === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.channel?.toLowerCase().includes(q) ||
        t.platform?.toLowerCase().includes(q)
      );
    }
    if (sort === "score")   list.sort((a, b) => b.score - a.score);
    if (sort === "damage")  list.sort((a, b) => (b.damageEstimateUsd || 0) - (a.damageEstimateUsd || 0));
    if (sort === "views")   list.sort((a, b) => (b.viewsEstimate || 0) - (a.viewsEstimate || 0));
    return list;
  }, [threats, filter, search, sort]);

  const handleDmca = (t) => {
    generateDmca(t);
    navigate("/legal");
  };

  return (
    <div className="dossiers animate-fadeUp">
      {/* ── Toolbar ── */}
      <div className="dossiers-toolbar panel animate-fadeUp delay-1">
        <div className="toolbar-search">
          <Search size={14} style={{ color: "var(--txt-dim)" }} />
          <input
            className="toolbar-input"
            placeholder="Search threats..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-filters">
          {["ALL", "HIGH", "MEDIUM", "LOW"].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              style={filter === f && f !== "ALL" ? { borderColor: SEV_COLOR[f], color: SEV_COLOR[f], background: SEV_BG[f] } : {}}
              onClick={() => setFilter(f)}
            >
              {f}
              {f !== "ALL" && (
                <span className="filter-count">
                  {threats.filter(t => t.severity === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="toolbar-sort">
          <Filter size={12} style={{ color: "var(--txt-dim)" }} />
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="score">Sort: Risk Score</option>
            <option value="damage">Sort: Damage $</option>
            <option value="views">Sort: Views</option>
          </select>
        </div>
        <span className="badge">{filtered.length} RESULTS</span>
      </div>

      {/* ── Empty state ── */}
      {threats.length === 0 && (
        <div className="dossiers-empty panel animate-fadeUp delay-2">
          <AlertTriangle size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
          <h3>No threats detected yet</h3>
          <p>Run a scan in Live Hunter to populate threat dossiers.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/hunter")}>
            Go to Live Hunter
          </button>
        </div>
      )}

      {/* ── Threat cards ── */}
      <div className="dossiers-grid">
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className={`dossier-card animate-fadeUp delay-${Math.min(i + 1, 8)}`}
            style={{ borderLeftColor: SEV_COLOR[t.severity] }}
          >
            {/* Thumbnail */}
            {t.thumb && (
              <div className="dossier-thumb">
                <img src={t.thumb} alt={t.title} loading="lazy" />
                <div className="dossier-thumb-overlay">
                  <span className="dossier-sev-badge" style={{ background: SEV_BG[t.severity], color: SEV_COLOR[t.severity], borderColor: SEV_COLOR[t.severity] }}>
                    {t.severity}
                  </span>
                </div>
              </div>
            )}

            <div className="dossier-body">
              <div className="dossier-platform">
                <span className="badge" style={{ borderColor: "rgba(72,195,255,0.2)", color: "var(--cyan)", gap: 6 }}>
                  <PlatformLogo platform={t.platform} size={13} />
                  {t.platform}
                </span>
                {t.date && <span className="dossier-date">{t.date}</span>}
              </div>

              <h3 className="dossier-title">{t.title}</h3>
              <p className="dossier-channel">{t.channel}</p>
              <p className="dossier-reason">{t.reason}</p>

              <div className="dossier-metrics">
                <div className="dossier-metric">
                  <TrendingUp size={11} />
                  <span>RISK</span>
                  <span style={{ color: SEV_COLOR[t.severity], fontWeight: 700 }}>{t.score}%</span>
                </div>
                <div className="dossier-metric">
                  <Eye size={11} />
                  <span>VIEWS</span>
                  <span>{(t.viewsEstimate || 0).toLocaleString()}</span>
                </div>
                <div className="dossier-metric">
                  <DollarSign size={11} />
                  <span>DAMAGE</span>
                  <span style={{ color: "var(--amber)" }}>₹{(t.damageEstimateUsd || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Score bar */}
              <div className="dossier-score-bar">
                <div style={{ width: `${t.score}%`, background: SEV_COLOR[t.severity] }} />
              </div>

              <div className="dossier-actions">
                <a className="btn" href={t.url} target="_blank" rel="noreferrer">
                  <ExternalLink size={12} /> OPEN
                </a>
                <button className="btn btn-primary" onClick={() => handleDmca(t)}>
                  <Scale size={12} /> GENERATE DMCA
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
