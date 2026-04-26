import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const T = {
  bg0: "#070b15",
  bg1: "#0d1326",
  panel: "rgba(10, 17, 34, 0.82)",
  panelSoft: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.12)",
  edge: "rgba(72, 195, 255, 0.34)",
  cyan: "#48c3ff",
  mint: "#1fe6a8",
  amber: "#ffbc57",
  red: "#ff567d",
  txt: "#d9e8ff",
  txtSoft: "#7e95bb",
  txtDim: "#475c80",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@500;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

* { box-sizing: border-box; }
html, body, #root { margin: 0; width: 100%; height: 100%; overflow: hidden; }
body {
  font-family: 'Space Grotesk', sans-serif;
  color: ${T.txt};
  background:
    radial-gradient(1200px 700px at -5% -10%, rgba(72,195,255,0.16), transparent 50%),
    radial-gradient(900px 550px at 110% -20%, rgba(255,86,125,0.14), transparent 46%),
    radial-gradient(900px 620px at 60% 130%, rgba(31,230,168,0.12), transparent 48%),
    linear-gradient(160deg, ${T.bg0}, ${T.bg1});
}

@keyframes pulse {
  0% { opacity: 0.35; transform: scale(0.96); }
  50% { opacity: 0.95; transform: scale(1.02); }
  100% { opacity: 0.35; transform: scale(0.96); }
}

@keyframes slide {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.app-shell {
  position: relative;
  display: grid;
  grid-template-rows: 62px 1fr;
  width: 100%;
  height: 100%;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  border-bottom: 1px solid ${T.border};
  background: rgba(7, 11, 21, 0.72);
  backdrop-filter: blur(14px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-badge {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  border: 1px solid ${T.edge};
  background: linear-gradient(140deg, rgba(72,195,255,0.18), rgba(31,230,168,0.14));
  display: grid;
  place-items: center;
  box-shadow: 0 10px 30px rgba(72,195,255,0.24);
}

.brand-title {
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.brand-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: ${T.txtDim};
  letter-spacing: 1.2px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  border: 1px solid ${T.border};
  background: ${T.panelSoft};
  border-radius: 999px;
  padding: 5px 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: ${T.txtSoft};
}

.workspace {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 320px;
  min-height: 0;
}

.left-rail, .right-rail {
  min-height: 0;
  overflow: auto;
  border-right: 1px solid ${T.border};
  background: rgba(6, 12, 24, 0.56);
}

.right-rail {
  border-right: 0;
  border-left: 1px solid ${T.border};
}

.rail-inner { padding: 16px 14px 20px; }

.section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: ${T.txtDim};
  letter-spacing: 1.3px;
  margin: 0 0 10px;
}

.nav-btn {
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  background: transparent;
  color: ${T.txtSoft};
  border-radius: 11px;
  padding: 11px 12px;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  transition: 0.18s ease;
  cursor: pointer;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.03);
  border-color: ${T.border};
}

.nav-btn.active {
  color: ${T.txt};
  background: linear-gradient(130deg, rgba(72,195,255,0.17), rgba(255,86,125,0.1));
  border-color: ${T.edge};
}

.metric-stack {
  display: grid;
  gap: 10px;
}

.metric-card {
  border: 1px solid ${T.border};
  background: ${T.panelSoft};
  border-radius: 12px;
  padding: 11px 12px;
}

.metric-k {
  margin: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: ${T.txtDim};
  letter-spacing: 1.1px;
}

.metric-v {
  margin: 6px 0 0;
  font-family: 'Sora', sans-serif;
  font-size: 21px;
  font-weight: 800;
}

.main-stage {
  min-height: 0;
  overflow: auto;
  padding: 20px;
}

.hero {
  border: 1px solid ${T.edge};
  background:
    radial-gradient(600px 180px at 0% 0%, rgba(72,195,255,0.16), transparent 55%),
    radial-gradient(600px 180px at 100% 0%, rgba(255,86,125,0.14), transparent 55%),
    linear-gradient(145deg, rgba(13,20,40,0.92), rgba(7,12,25,0.86));
  border-radius: 18px;
  padding: 20px 20px;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
  animation: reveal 0.45s ease both;
}

.hero::after {
  content: '';
  position: absolute;
  left: -120px;
  top: 0;
  width: 120px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(72,195,255,0.18), transparent);
  animation: slide 4.2s linear infinite;
}

.hero-title {
  margin: 0;
  font-family: 'Sora', sans-serif;
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.8px;
  background: linear-gradient(90deg, #f3f8ff 10%, #7ad8ff 50%, #42ffc2 90%);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-sub {
  margin: 8px 0 0;
  color: ${T.txtSoft};
  font-size: 14px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.panel {
  border: 1px solid ${T.border};
  background: ${T.panel};
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(12px);
}

.panel-title {
  margin: 0 0 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.2px;
  color: ${T.txtDim};
}

.row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.input {
  width: 100%;
  border-radius: 11px;
  border: 1px solid ${T.border};
  padding: 10px 12px;
  background: rgba(255,255,255,0.02);
  color: ${T.txt};
  font-size: 13px;
}

.input:focus {
  outline: none;
  border-color: ${T.edge};
  box-shadow: 0 0 0 3px rgba(72,195,255,0.12);
}

.btn {
  border: 1px solid ${T.border};
  background: rgba(255,255,255,0.02);
  color: ${T.txt};
  border-radius: 11px;
  padding: 10px 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: 0.18s ease;
}

.btn:hover { border-color: ${T.edge}; }

.btn-primary {
  border-color: ${T.edge};
  background: linear-gradient(140deg, rgba(72,195,255,0.25), rgba(31,230,168,0.14));
}

.btn-danger {
  border-color: rgba(255,86,125,0.4);
  background: rgba(255,86,125,0.14);
}

.toggle {
  border: 1px solid ${T.border};
  padding: 7px 10px;
  border-radius: 999px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: ${T.txtSoft};
  background: transparent;
}

.toggle.on {
  color: ${T.txt};
  border-color: ${T.edge};
  background: rgba(72,195,255,0.12);
}

.dropzone {
  border: 1px dashed ${T.edge};
  border-radius: 13px;
  padding: 16px;
  text-align: center;
  background: rgba(72,195,255,0.06);
}

.progress {
  height: 7px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

.progress > div {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, ${T.cyan}, ${T.mint});
  transition: width 0.25s ease;
}

.threat-list {
  display: grid;
  gap: 10px;
}

.threat-item {
  border: 1px solid ${T.border};
  border-left-width: 3px;
  border-radius: 13px;
  padding: 11px;
  background: rgba(255,255,255,0.02);
  display: grid;
  grid-template-columns: minmax(0,1fr) auto;
  gap: 10px;
  align-items: center;
}

.feed {
  display: grid;
  gap: 8px;
}

.feed-item {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 11px;
  padding: 8px 9px;
  background: rgba(255,255,255,0.02);
}

.feed-time {
  margin: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: ${T.txtDim};
}

.feed-text {
  margin: 4px 0 0;
  font-size: 12px;
}

.codebox {
  width: 100%;
  min-height: 380px;
  border: 1px solid ${T.border};
  border-radius: 12px;
  background: rgba(2, 6, 14, 0.9);
  color: #b3d7ff;
  padding: 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  line-height: 1.75;
  resize: vertical;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 3px;
}

.map-dot {
  aspect-ratio: 1;
  border-radius: 3px;
  background: rgba(72,195,255,0.08);
}

.map-dot.hot {
  background: rgba(255,86,125,0.55);
  box-shadow: 0 0 12px rgba(255,86,125,0.5);
  animation: pulse 1.6s ease infinite;
}

@media (max-width: 1460px) {
  .workspace { grid-template-columns: 220px minmax(0, 1fr) 280px; }
  .hero-title { font-size: 29px; }
}

@media (max-width: 1200px) {
  .workspace { grid-template-columns: 1fr; }
  .left-rail, .right-rail { border: 0; border-top: 1px solid ${T.border}; }
  .grid-3 { grid-template-columns: 1fr; }
}
`;

function sevColor(severity) {
  if (severity === "HIGH") return T.red;
  if (severity === "MEDIUM") return T.amber;
  return T.mint;
}

function toGray(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function pHash(imgData) {
  const px = [];
  for (let i = 0; i < imgData.data.length; i += 4) {
    px.push(toGray(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]));
  }
  const avg = px.reduce((a, b) => a + b, 0) / px.length;
  return px.map((v) => (v >= avg ? 1 : 0));
}

function Counter({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const duration = 700;
    const start = Date.now();
    const from = 0;
    const to = Number(value) || 0;
    let raf = 0;

    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{n}</>;
}

export default function Sentinel() {
  const [tab, setTab] = useState("overview");
  const [clock, setClock] = useState("");
  const [contentName, setContentName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [orgName, setOrgName] = useState("");
  const [maxResults, setMaxResults] = useState(8);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [apiHealth, setApiHealth] = useState(null);
  const [scanError, setScanError] = useState("");
  const [threats, setThreats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [feed, setFeed] = useState([
    { t: "09:00:01", type: "ok", m: "SENTINEL stack initialized" },
    { t: "09:00:02", type: "info", m: "Waiting for scan commands" },
  ]);
  const [includePlatforms, setIncludePlatforms] = useState({ youtube: true, x: true, tiktok: true });
  const [file, setFile] = useState(null);
  const [fingerprintBits, setFingerprintBits] = useState([]);
  const [dmcaTarget, setDmcaTarget] = useState(null);
  const [dmcaLoading, setDmcaLoading] = useState(false);
  const [dmcaText, setDmcaText] = useState("");
  const [copied, setCopied] = useState(false);

  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setApiHealth(d);
      })
      .catch(() => {
        if (alive) setApiHealth({ ok: false, integrations: { youtube: false, serpapi: false } });
      });
    return () => {
      alive = false;
    };
  }, []);

  const addFeed = (m, type = "info") => {
    const t = new Date().toLocaleTimeString("en", { hour12: false });
    setFeed((p) => [...p.slice(-20), { t, m, type }]);
  };

  const addLog = (m, type = "info") => {
    const t = new Date().toLocaleTimeString("en", { hour12: false });
    setLogs((p) => [...p, { t, m, type }]);
    addFeed(m, type);
  };

  const togglePlatform = (name) => {
    setIncludePlatforms((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      if (!next.youtube && !next.x && !next.tiktok) return prev;
      return next;
    });
  };

  const extractFingerprint = (f) =>
    new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 32;
      canvas.height = 8;
      video.src = URL.createObjectURL(f);

      video.onloadedmetadata = () => {
        const points = [0.1, 0.3, 0.5, 0.7, 0.9].map((v) => v * video.duration);
        const all = [];
        let i = 0;

        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, 32, 8);
          all.push(...pHash(ctx.getImageData(0, 0, 32, 8)));
          i += 1;
          if (i < points.length) video.currentTime = points[i];
          else resolve(all);
        };

        video.currentTime = points[0];
      };
    });

  const runScan = async () => {
    if (!contentName.trim() && !keywords.trim() && !file) return;

    setStatus("scanning");
    setProgress(0);
    setScanError("");
    setThreats([]);
    setLogs([]);
    addLog("Booting hunt engine", "info");

    try {
      if (file) {
        addLog(`Extracting perceptual fingerprint from ${file.name}`, "info");
        const bits = await extractFingerprint(file);
        setFingerprintBits(bits);
        addLog(`Fingerprint locked: ${bits.filter(Boolean).length} high-signal bits`, "ok");
      } else {
        setFingerprintBits([]);
        addLog("No reference clip uploaded. Running metadata-only hunt", "warn");
      }

      setProgress(30);
      addLog("Deploying platform hunters across YouTube, X, and TikTok", "info");

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentName,
          keywords,
          maxResults,
          includePlatforms,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Scan failed");
      }

      setProgress(78);
      const found = (payload.violations || []).map((v) => ({
        ...v,
        thumb: v.thumb || `https://picsum.photos/seed/${v.id}/360/200`,
      }));
      setThreats(found);
      addLog(`Threat engine produced ${found.length} dossiers`, "ok");

      setProgress(100);
      setStatus("complete");
      addLog("Scan complete. Ready for legal action.", "ok");
      setTab("dossiers");
    } catch (err) {
      setStatus("error");
      setScanError(err.message);
      addLog(`Fatal: ${err.message}`, "error");
    }
  };

  const generateDmca = async (threat) => {
    setDmcaTarget(threat);
    setDmcaText("");
    setDmcaLoading(true);
    setTab("legal");
    addFeed(`Generating legal notice for ${threat.platform} entry`, "warn");

    try {
      const res = await fetch("/api/dmca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: orgName,
          contentName: contentName || keywords,
          violation: threat,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "DMCA generation failed");
      setDmcaText(payload.notice || "No DMCA notice returned");
      addFeed("DMCA notice ready", "ok");
    } catch (err) {
      setDmcaText(`Error: ${err.message}`);
    }

    setDmcaLoading(false);
  };

  const severityCounts = useMemo(() => {
    return {
      high: threats.filter((t) => t.severity === "HIGH").length,
      medium: threats.filter((t) => t.severity === "MEDIUM").length,
      low: threats.filter((t) => t.severity === "LOW").length,
    };
  }, [threats]);

  const platformSummary = useMemo(() => {
    return threats.reduce((acc, t) => {
      const k = t.platform || "YouTube";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  }, [threats]);

  const avgScore = useMemo(() => {
    if (!threats.length) return 0;
    return Math.round(threats.reduce((a, b) => a + b.score, 0) / threats.length);
  }, [threats]);

  const trendData = useMemo(() => {
    const base = [2, 3, 5, 4, 8, 6];
    return base.map((n, idx) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx],
      count: n + Math.floor((threats.length || 0) / 4),
    }));
  }, [threats.length]);

  const platformData = useMemo(() => {
    return Object.entries(platformSummary).map(([name, value]) => ({ name, value }));
  }, [platformSummary]);

  const nav = [
    { id: "overview", label: "Mission Control" },
    { id: "hunt", label: "Live Hunter" },
    { id: "dossiers", label: "Threat Dossiers", count: threats.length },
    { id: "legal", label: "Legal Forge" },
    { id: "settings", label: "System Config" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-badge">S</div>
            <div>
              <div className="brand-title">SENTINEL STUDIO</div>
              <div className="brand-sub">LIVE SPORTS ASSET PROTECTION ENGINE</div>
            </div>
          </div>

          <div className="topbar-right">
            <span className="badge">TIME {clock}</span>
            <span className="badge">STATUS {status.toUpperCase()}</span>
            <span className="badge">THREATS {threats.length}</span>
          </div>
        </header>

        <div className="workspace">
          <aside className="left-rail">
            <div className="rail-inner">
              <p className="section-label">NAVIGATION</p>
              {nav.map((n) => (
                <button
                  key={n.id}
                  className={`nav-btn ${tab === n.id ? "active" : ""}`}
                  onClick={() => setTab(n.id)}
                >
                  <span>{n.label}</span>
                  {n.count ? <span>{n.count}</span> : null}
                </button>
              ))}

              <p className="section-label" style={{ marginTop: 18 }}>VIOLATION SNAPSHOT</p>
              <div className="metric-stack">
                <div className="metric-card">
                  <p className="metric-k">HIGH PRIORITY</p>
                  <p className="metric-v" style={{ color: T.red }}><Counter value={severityCounts.high} /></p>
                </div>
                <div className="metric-card">
                  <p className="metric-k">MEDIUM PRIORITY</p>
                  <p className="metric-v" style={{ color: T.amber }}><Counter value={severityCounts.medium} /></p>
                </div>
                <div className="metric-card">
                  <p className="metric-k">LOW PRIORITY</p>
                  <p className="metric-v" style={{ color: T.mint }}><Counter value={severityCounts.low} /></p>
                </div>
                <div className="metric-card">
                  <p className="metric-k">AVERAGE SCORE</p>
                  <p className="metric-v"><Counter value={avgScore} />%</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="main-stage">
            <section className="hero">
              <h1 className="hero-title">Live Content Bounty Hunter</h1>
              <p className="hero-sub">
                Find unauthorized sports media across platforms, score risk, and deploy legal response in one command chain.
              </p>
            </section>

            {tab === "overview" && (
              <div style={{ animation: "reveal 0.35s ease both" }}>
                <div className="grid-3">
                  <div className="panel">
                    <p className="panel-title">THREAT TRAJECTORY</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="lineA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={T.cyan} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={T.cyan} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fill: T.txtDim, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: T.txtDim, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b1225", border: `1px solid ${T.border}`, borderRadius: 10 }} />
                        <Area type="monotone" dataKey="count" stroke={T.cyan} fill="url(#lineA)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="panel">
                    <p className="panel-title">PLATFORM PRESSURE</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={platformData.length ? platformData : [{ name: "None", value: 0 }] }>
                        <XAxis dataKey="name" tick={{ fill: T.txtDim, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: T.txtDim, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b1225", border: `1px solid ${T.border}`, borderRadius: 10 }} />
                        <Bar dataKey="value" fill={T.amber} radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="panel">
                    <p className="panel-title">LEAK HEAT MAP</p>
                    <div className="map-grid">
                      {Array.from({ length: 140 }).map((_, i) => {
                        const hot = threats.length > 0 && (i % 17 === 0 || i % 29 === 0 || i % 41 === 0);
                        return <div key={i} className={`map-dot ${hot ? "hot" : ""}`} />;
                      })}
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <p className="panel-title">HOW YOU WIN THE ROOM</p>
                  <p style={{ margin: 0, color: T.txtSoft, lineHeight: 1.8, fontSize: 14 }}>
                    Open Live Hunter, run a multi-platform scan, show threat dossiers with confidence and damage estimates, then generate a legal notice in one click.
                    That demo arc feels real, high-stakes, and memorable to judges.
                  </p>
                </div>
              </div>
            )}

            {tab === "hunt" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12, animation: "reveal 0.35s ease both" }}>
                <div className="panel">
                  <p className="panel-title">SCAN CONFIGURATION</p>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <input className="input" value={contentName} onChange={(e) => setContentName(e.target.value)} placeholder="Protected content name" />
                  </div>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <input className="input" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords and hashtags" />
                  </div>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <input className="input" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Organization / rights holder" />
                  </div>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <input className="input" type="number" min={3} max={20} value={maxResults} onChange={(e) => setMaxResults(Math.max(3, Math.min(20, Number(e.target.value) || 8)))} />
                  </div>

                  <div className="row" style={{ marginBottom: 12 }}>
                    <button className={`toggle ${includePlatforms.youtube ? "on" : ""}`} onClick={() => togglePlatform("youtube")}>YOUTUBE</button>
                    <button className={`toggle ${includePlatforms.x ? "on" : ""}`} onClick={() => togglePlatform("x")}>X</button>
                    <button className={`toggle ${includePlatforms.tiktok ? "on" : ""}`} onClick={() => togglePlatform("tiktok")}>TIKTOK</button>
                  </div>

                  <div className="dropzone" onClick={() => fileRef.current?.click()}>
                    {file ? `Reference clip loaded: ${file.name}` : "Drop or click to add reference sports clip"}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div className="progress"><div style={{ width: `${progress}%` }} /></div>
                  </div>

                  {scanError ? (
                    <div style={{ marginTop: 10, color: T.red, fontFamily: "IBM Plex Mono", fontSize: 11 }}>{scanError}</div>
                  ) : null}

                  <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn btn-primary" onClick={runScan} disabled={status === "scanning"}>
                      {status === "scanning" ? `SCANNING ${progress}%` : "RUN LIVE SCAN"}
                    </button>
                    <button className="btn" onClick={() => setTab("dossiers")}>OPEN DOSSIERS</button>
                  </div>
                </div>

                <div className="panel">
                  <p className="panel-title">SCAN TELEMETRY</p>
                  <div style={{ maxHeight: 380, overflow: "auto", border: `1px solid ${T.border}`, borderRadius: 11, padding: 10, background: "rgba(0,0,0,0.2)" }}>
                    {logs.length === 0 ? (
                      <p style={{ margin: 0, color: T.txtDim, fontFamily: "IBM Plex Mono", fontSize: 11 }}>No telemetry yet.</p>
                    ) : (
                      logs.map((l, idx) => (
                        <div key={`${l.t}_${idx}`} style={{ marginBottom: 6, fontFamily: "IBM Plex Mono", fontSize: 11, color: l.type === "error" ? T.red : l.type === "warn" ? T.amber : l.type === "ok" ? T.mint : T.cyan }}>
                          <span style={{ color: T.txtDim, marginRight: 6 }}>{l.t}</span>{l.m}
                        </div>
                      ))
                    )}
                  </div>

                  {fingerprintBits.length > 0 ? (
                    <div style={{ marginTop: 12 }}>
                      <p className="panel-title">FINGERPRINT MATRIX</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(32, 1fr)", gap: 2 }}>
                        {fingerprintBits.slice(0, 256).map((b, i) => (
                          <div key={i} style={{ aspectRatio: 1, borderRadius: 1, background: b ? T.cyan : "rgba(72,195,255,0.07)" }} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {tab === "dossiers" && (
              <div className="panel" style={{ animation: "reveal 0.35s ease both" }}>
                <p className="panel-title">THREAT DOSSIERS</p>
                {threats.length === 0 ? (
                  <p style={{ margin: 0, color: T.txtSoft }}>No threats yet. Run a scan in Live Hunter.</p>
                ) : (
                  <div className="threat-list">
                    {threats.map((t) => (
                      <div key={t.id} className="threat-item" style={{ borderLeftColor: sevColor(t.severity) }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t.title}</div>
                          <div style={{ color: T.txtSoft, fontSize: 12, marginBottom: 6 }}>{t.channel} | {t.platform} | {t.date || "N/A"}</div>
                          <div style={{ color: T.txtDim, fontSize: 12 }}>{t.reason}</div>
                          <div className="row" style={{ marginTop: 7 }}>
                            <span className="badge">SCORE {t.score}%</span>
                            <span className="badge">VIEWS {(t.viewsEstimate || 0).toLocaleString()}</span>
                            <span className="badge">DAMAGE ${(t.damageEstimateUsd || 0).toLocaleString()}</span>
                            <span className="badge" style={{ color: sevColor(t.severity) }}>{t.severity}</span>
                          </div>
                        </div>

                        <div className="row" style={{ justifyContent: "flex-end" }}>
                          <a className="btn" href={t.url} target="_blank" rel="noreferrer">OPEN</a>
                          <button className="btn btn-primary" onClick={() => generateDmca(t)}>GENERATE DMCA</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "legal" && (
              <div className="panel" style={{ animation: "reveal 0.35s ease both" }}>
                <p className="panel-title">LEGAL FORGE</p>
                {!dmcaTarget ? (
                  <p style={{ margin: 0, color: T.txtSoft }}>Select a threat in Threat Dossiers and click Generate DMCA.</p>
                ) : (
                  <>
                    <div className="row" style={{ marginBottom: 10 }}>
                      <span className="badge">TARGET {dmcaTarget.platform}</span>
                      <span className="badge">SCORE {dmcaTarget.score}%</span>
                      <span className="badge">CHANNEL {dmcaTarget.channel}</span>
                    </div>

                    {dmcaLoading ? (
                      <p style={{ color: T.cyan, fontFamily: "IBM Plex Mono", fontSize: 12 }}>Drafting legal notice...</p>
                    ) : null}

                    <textarea className="codebox" value={dmcaText} readOnly />

                    <div className="row" style={{ marginTop: 10 }}>
                      <button
                        className="btn"
                        onClick={() => {
                          navigator.clipboard.writeText(dmcaText || "");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1200);
                        }}
                      >
                        {copied ? "COPIED" : "COPY NOTICE"}
                      </button>
                      <button className="btn btn-danger" onClick={() => generateDmca(dmcaTarget)}>REGENERATE</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "settings" && (
              <div className="grid-3" style={{ animation: "reveal 0.35s ease both" }}>
                <div className="panel">
                  <p className="panel-title">SYSTEM HEALTH</p>
                  <p style={{ margin: "0 0 8px", color: apiHealth?.ok ? T.mint : T.red }}>
                    API {apiHealth?.ok ? "ONLINE" : "OFFLINE"}
                  </p>
                  <p style={{ margin: 0, color: T.txtSoft, fontSize: 13 }}>
                    Endpoint: 127.0.0.1:8787
                  </p>
                </div>

                <div className="panel">
                  <p className="panel-title">INTEGRATIONS</p>
                  <p style={{ margin: "0 0 8px", color: apiHealth?.integrations?.youtube ? T.mint : T.amber }}>
                    YouTube: {apiHealth?.integrations?.youtube ? "Live" : "Fallback"}
                  </p>
                  <p style={{ margin: 0, color: apiHealth?.integrations?.serpapi ? T.mint : T.amber }}>
                    X / TikTok intel: {apiHealth?.integrations?.serpapi ? "Live" : "Fallback"}
                  </p>
                </div>

                <div className="panel">
                  <p className="panel-title">DEMO CHECKLIST</p>
                  <ol style={{ margin: 0, paddingLeft: 18, color: T.txtSoft, fontSize: 13, lineHeight: 1.7 }}>
                    <li>Load reference clip</li>
                    <li>Run live scan</li>
                    <li>Open threat dossier</li>
                    <li>Generate DMCA notice</li>
                  </ol>
                </div>
              </div>
            )}
          </main>

          <aside className="right-rail">
            <div className="rail-inner">
              <p className="section-label">LIVE ACTIVITY FEED</p>
              <div className="feed">
                {feed.slice().reverse().map((f, idx) => (
                  <div key={`${f.t}_${idx}`} className="feed-item">
                    <p className="feed-time">{f.t}</p>
                    <p className="feed-text" style={{ color: f.type === "error" ? T.red : f.type === "warn" ? T.amber : f.type === "ok" ? T.mint : T.cyan }}>{f.m}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
