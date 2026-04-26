import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from "recharts";
import { useSentinel } from "../context/SentinelContext.jsx";
import { TrendingUp, TrendingDown, DollarSign, Shield, Zap } from "lucide-react";
import "./Analytics.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Analytics() {
  const { threats } = useSentinel();

  const totalDamage = threats.reduce((a, b) => a + (b.damageEstimateUsd || 0), 0);
  const avgScore    = threats.length ? Math.round(threats.reduce((a, b) => a + b.score, 0) / threats.length) : 0;

  const monthlyData = useMemo(() => {
    // Seeded base data — stable, won't flicker on re-render
    const base = [8, 12, 7, 15, 11, 18, 14];
    const resolved = [5, 8, 4, 10, 7, 12, 9];
    const baseDamage = [4200, 7800, 3900, 9100, 6500, 11200, 8400];
    return MONTHS.slice(0, 7).map((m, i) => ({
      month: m,
      violations: base[i] + (i === 6 ? threats.length : 0),
      resolved:   resolved[i],
      damage:     baseDamage[i] + (i === 6 ? totalDamage : 0),
    }));
  }, [threats.length, totalDamage]);

  const platformData = useMemo(() => {
    const map = threats.reduce((acc, t) => {
      acc[t.platform] = (acc[t.platform] || 0) + 1;
      return acc;
    }, {});
    const all = ["YouTube", "X", "TikTok", "Instagram", "Facebook", "Twitch", "Reddit"];
    return all.map(p => ({ platform: p, count: map[p] || 0 }));
  }, [threats]);

  const radarData = [
    { subject: "YouTube",   A: 85 },
    { subject: "TikTok",    A: 72 },
    { subject: "Instagram", A: 60 },
    { subject: "X",         A: 55 },
    { subject: "Facebook",  A: 40 },
    { subject: "Twitch",    A: 30 },
    { subject: "Reddit",    A: 25 },
  ];

  const kpiCards = [
    { label: "TOTAL VIOLATIONS",  val: threats.length,  delta: "+12%", up: false, color: "#ff6b8a",    icon: Shield },
    { label: "RESOLVED",          val: Math.floor(threats.length * 0.6), delta: "+34%", up: true, color: "#00ffb3", icon: TrendingUp },
    { label: "TOTAL DAMAGE",      val: `₹${totalDamage.toLocaleString()}`, delta: "+8%", up: false, color: "var(--amber)", icon: DollarSign, raw: true },
    { label: "AVG RISK SCORE",    val: `${avgScore}%`,  delta: "-5%",  up: true, color: "var(--cyan)",   icon: Zap, raw: true },
  ];

  return (
    <div className="analytics animate-fadeUp">
      {/* KPI row */}
      <div className="kpi-row">
        {kpiCards.map((k, i) => (
          <div key={i} className={`kpi-card panel animate-fadeUp delay-${i + 1}`}>
            <div className="kpi-top">
              <p className="panel-title">{k.label}</p>
              <k.icon size={16} style={{ color: k.color }} />
            </div>
            <div className="kpi-val" style={{ color: k.color }}>
              {k.raw ? k.val : k.val}
            </div>
            <div className={`kpi-delta ${k.up ? "up" : "down"}`}>
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.delta} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        <div className="panel chart-wide animate-fadeUp delay-2">
          <p className="panel-title">MONTHLY VIOLATION TREND</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="aViol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff567d" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff567d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1fe6a8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1fe6a8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} />
              <Area type="monotone" dataKey="violations" stroke="#ff567d" fill="url(#aViol)" strokeWidth={2} name="Violations" />
              <Area type="monotone" dataKey="resolved"   stroke="#1fe6a8" fill="url(#aRes)"  strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel animate-fadeUp delay-3">
          <p className="panel-title">PLATFORM EXPOSURE</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformData} layout="vertical">
              <XAxis type="number" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="platform" type="category" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {platformData.map((_, i) => (
                  <Cell key={i} fill={["#ff567d","#ffbc57","#1fe6a8","#48c3ff","#a78bfa","#ff567d","#ffbc57"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="panel animate-fadeUp delay-3">
          <p className="panel-title">DAMAGE ESTIMATE — MONTHLY ($)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={v => [`₹${v.toLocaleString()}`, "Damage"]} />
              <Line type="monotone" dataKey="damage" stroke="#ffbc57" strokeWidth={2} dot={{ fill: "#ffbc57", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel animate-fadeUp delay-4">
          <p className="panel-title">PLATFORM RISK RADAR</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--txt-soft)", fontSize: 10, fontFamily: "IBM Plex Mono" }} />
              <Radar name="Risk" dataKey="A" stroke="#48c3ff" fill="#48c3ff" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "#0b1225", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "IBM Plex Mono", fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel animate-fadeUp delay-5">
          <p className="panel-title">ENFORCEMENT STATS</p>
          <div className="enforcement-stats">
            {[
              { label: "Notices Sent",    val: Math.floor(threats.length * 0.8), color: "var(--cyan)" },
              { label: "Takedowns Won",   val: Math.floor(threats.length * 0.6), color: "#00ffb3" },
              { label: "Pending Review",  val: Math.floor(threats.length * 0.2), color: "var(--amber)" },
              { label: "Escalated",       val: Math.floor(threats.length * 0.1), color: "#ff6b8a" },
            ].map((s, i) => (
              <div key={i} className="enforcement-row">
                <span className="enforcement-label">{s.label}</span>
                <div className="enforcement-bar-wrap">
                  <div className="enforcement-bar">
                    <div style={{
                      width: `${threats.length ? (s.val / threats.length) * 100 : 0}%`,
                      background: s.color,
                    }} />
                  </div>
                  <span className="enforcement-val" style={{ color: s.color }}>{s.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
