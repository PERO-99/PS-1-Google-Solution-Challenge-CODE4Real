import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  Tooltip, XAxis, YAxis, PieChart, Pie, Cell
} from "recharts";
import { useSentinel } from "../context/SentinelContext.jsx";
import {
  Crosshair, FileWarning, Scale, TrendingUp,
  AlertTriangle, Zap, ArrowRight
} from "lucide-react";
import Counter from "../components/Counter.jsx";
import "./Dashboard.css";

const COLORS = ["#ff567d", "#ffbc57", "#1fe6a8", "#48c3ff", "#a78bfa"];

export default function Dashboard() {
  const { threats, status, feed, progress } = useSentinel();
  const navigate = useNavigate();

  const counts = useMemo(() => ({
    high:   threats.filter(t => t.severity === "HIGH").length,
    medium: threats.filter(t => t.severity === "MEDIUM").length,
    low:    threats.filter(t => t.severity === "LOW").length,
    total:  threats.length,
    avgScore: threats.length ? Math.round(threats.reduce((a, b) => a + b.score, 0) / threats.length) : 0,
    totalDamage: threats.reduce((a, b) => a + (b.damageEstimateUsd || 0), 0),
  }), [threats]);

  const trendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const base  = [3, 5, 4, 8, 6, 11, 9];
    return days.map((day, i) => ({
      day,
      violations: base[i] + Math.floor(counts.total / 5),
      resolved: Math.floor(base[i] * 0.6),
    }));
  }, [counts.total]);

  const platformData = useMemo(() => {
    const map = threats.reduce((acc, t) => {
      acc[t.platform] = (acc[t.platform] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [threats]);

  const severityData = [
    { name: "HIGH",   value: counts.high   || 1, color: "#ff6b8a" },
    { name: "MEDIUM", value: counts.medium || 1, color: "#ffcc44" },
    { name: "LOW",    value: counts.low    || 1, color: "#00ffb3" },
  ];

  const METRIC_CARDS = [
    { label: "TOTAL VIOLATIONS",  val: counts.total,   color: "var(--cyan)",   icon: FileWarning },
    { label: "HIGH SEVERITY",     val: counts.high,    color: "#ff6b8a",       icon: AlertTriangle },
    { label: "AVG RISK SCORE",    val: `${counts.avgScore}%`, color: "var(--amber)", icon: TrendingUp, raw: true },
    { label: "DAMAGE ESTIMATE",   val: `₹${counts.totalDamage.toLocaleString()}`, color: "#00ffb3", icon: Scale, raw: true },
  ];

  return (
    <div className="dashboard animate-fadeUp">
      {/* ── Metric cards ── */}
      <div className="metric-grid">
        {METRIC_CARDS.map((m, i) => (
          <div key={i} className={`metric-card animate-fadeUp delay-${i + 1}`}>
            <div className="metric-card-top">
              <p className="panel-title">{m.label}</p>
              <div className="metric-icon" style={{ color: m.color }}>
                <m.icon size={16} />
              </div>
            </div>
            <div className="metric-val" style={{ color: m.color }}>
              {m.raw ? m.val : <Counter value={m.val} />}
            </div>
            <div className="metric-bar">
              <div style={{ width: `${Math.min((m.val / (counts.total || 1)) * 100, 100)}%`, background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="charts-row">
        <div className="panel chart-panel animate-fadeUp delay-2">
          <p className="panel-title">VIOLATION TRAJECTORY — 7 DAYS</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gViol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff567d" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff567d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1fe6a8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1fe6a8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} />
              <Area type="monotone" dataKey="violations" stroke="#ff567d" fill="url(#gViol)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved"   stroke="#1fe6a8" fill="url(#gRes)"  strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart-panel animate-fadeUp delay-3">
          <p className="panel-title">PLATFORM PRESSURE</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={platformData.length ? platformData : [{ name: "No data", value: 0 }]}>
              <XAxis dataKey="name" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {(platformData.length ? platformData : [{ name: "No data", value: 0 }]).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart-panel animate-fadeUp delay-4">
          <p className="panel-title">SEVERITY BREAKDOWN</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {severityData.map(s => (
              <div key={s.name} className="pie-legend-item">
                <div className="pie-dot" style={{ background: s.color }} />
                <span>{s.name}</span>
                <span style={{ color: s.color, marginLeft: "auto" }}>{s.value === 1 && counts.total === 0 ? 0 : s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions + feed ── */}
      <div className="bottom-row">
        <div className="panel animate-fadeUp delay-3">
          <p className="panel-title">QUICK ACTIONS</p>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => navigate("/hunter")}>
              <div className="qa-icon" style={{ background: "rgba(72,195,255,0.1)", color: "var(--cyan)" }}>
                <Crosshair size={18} />
              </div>
              <div>
                <div className="qa-title">Run New Scan</div>
                <div className="qa-sub">Hunt violations across 7 platforms</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", color: "var(--txt-soft)" }} />
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/dossiers")}>
              <div className="qa-icon" style={{ background: "rgba(255,86,125,0.1)", color: "var(--red)" }}>
                <FileWarning size={18} />
              </div>
              <div>
                <div className="qa-title">View Dossiers</div>
                <div className="qa-sub">{counts.total} threats awaiting review</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", color: "var(--txt-soft)" }} />
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/legal")}>
              <div className="qa-icon" style={{ background: "rgba(167,139,250,0.1)", color: "var(--purple)" }}>
                <Scale size={18} />
              </div>
              <div>
                <div className="qa-title">Legal Forge</div>
                <div className="qa-sub">Generate DMCA takedown notices</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", color: "var(--txt-soft)" }} />
            </button>
          </div>
        </div>

        <div className="panel animate-fadeUp delay-4">
          <p className="panel-title">LIVE ACTIVITY FEED</p>
          <div className="activity-feed">
            {feed.slice().reverse().slice(0, 8).map((f, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{
                  background: f.type === "error" ? "#ff6b8a" : f.type === "warn" ? "#ffcc44" : f.type === "ok" ? "#00ffb3" : "var(--cyan)"
                }} />
                <div className="activity-content">
                  <span className="activity-time">{f.t}</span>
                  <span className="activity-msg" style={{
                    color: f.type === "error" ? "#ff6b8a" : f.type === "warn" ? "#ffcc44" : f.type === "ok" ? "#00ffb3" : "var(--txt-soft)"
                  }}>{f.m}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="panel animate-fadeUp delay-5">
          <p className="panel-title">LEAK HEAT MAP</p>
          <div className="heatmap-grid">
            {Array.from({ length: 168 }).map((_, i) => {
              const hot = counts.total > 0 && (i % 13 === 0 || i % 23 === 0 || i % 37 === 0);
              const warm = counts.total > 0 && (i % 7 === 0 || i % 11 === 0);
              return (
                <div
                  key={i}
                  className="heatmap-cell"
                  style={{
                    background: hot ? "rgba(255,86,125,0.7)" : warm ? "rgba(255,188,87,0.4)" : "rgba(72,195,255,0.06)",
                    boxShadow: hot ? "0 0 8px rgba(255,86,125,0.5)" : "none",
                    animation: hot ? `pulse ${1.2 + (i % 5) * 0.2}s ease infinite` : "none",
                  }}
                />
              );
            })}
          </div>
          <div className="heatmap-legend">
            <div className="heatmap-legend-item"><div style={{ background: "rgba(255,86,125,0.7)", width: 10, height: 10, borderRadius: 2 }} /><span>HIGH</span></div>
            <div className="heatmap-legend-item"><div style={{ background: "rgba(255,188,87,0.4)", width: 10, height: 10, borderRadius: 2 }} /><span>MEDIUM</span></div>
            <div className="heatmap-legend-item"><div style={{ background: "rgba(72,195,255,0.06)", width: 10, height: 10, borderRadius: 2 }} /><span>CLEAN</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
