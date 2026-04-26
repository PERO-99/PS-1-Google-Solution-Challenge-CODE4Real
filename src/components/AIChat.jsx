import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, Minimize2, Maximize2, Sparkles, Search, Globe, Lightbulb } from "lucide-react";
import "./AIChat.css";

// ── Gemini SVG logo (Google colors) ──
function GeminiLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 2C14 2 16.5 9.5 20 13C23.5 16.5 26 14 26 14C26 14 23.5 16.5 20 20C16.5 23.5 14 26 14 26C14 26 11.5 23.5 8 20C4.5 16.5 2 14 2 14C2 14 4.5 16.5 8 13C11.5 9.5 14 2 14 2Z"
        fill="url(#gemini-grad)" />
      <defs>
        <linearGradient id="gemini-grad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#4285F4" />
          <stop offset="33%"  stopColor="#EA4335" />
          <stop offset="66%"  stopColor="#FBBC05" />
          <stop offset="100%" stopColor="#34A853" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Google "G" logo ──
function GoogleG({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const KNOWLEDGE = {
  greet: [
    "Hi! I'm Gemini, your AI assistant powered by Google. I'm integrated into SENTINEL to help you detect piracy, understand DMCA law, and protect your sports content. What can I help you with?",
    "Hello! Gemini here — Google's most capable AI, now inside SENTINEL. Ask me anything about IP protection, platform policies, or how to use this tool.",
  ],
  dmca: [
    "A DMCA takedown under 17 U.S.C. § 512(c) needs: ① the copyrighted work identified, ② the infringing URL, ③ a good faith belief statement, ④ your contact info + signature. SENTINEL's Legal Forge generates all of this in one click.",
    "DMCA notices typically get actioned within 24–72 hours. YouTube's compliance rate is ~99%. Google Search also de-indexes infringing URLs under DMCA — SENTINEL can help you target both.",
  ],
  scan: [
    "Go to Live Hunter → enter your content name + keywords → select platforms → hit RUN LIVE SCAN. Gemini-powered scoring analyses each result for piracy signals in real time.",
    "SENTINEL scans 7 platforms simultaneously: YouTube, X, TikTok, Instagram, Facebook, Twitch, and Reddit. Results are scored 0–99% using AI pattern matching.",
  ],
  threat: [
    "Risk scores use: exact title match (+18pts), piracy keywords like 'free stream' or 'reupload' (+7pts each), suspicious channel names (+6pts). HIGH ≥ 75%, MEDIUM 45–74%, LOW < 45%.",
    "HIGH severity = act immediately. These have the most views and highest damage estimates. Click GENERATE DMCA on any dossier card to start legal action.",
  ],
  platform: [
    "SENTINEL covers YouTube (Google's platform — highest compliance), X/Twitter, TikTok, Instagram, Facebook, Twitch, and Reddit. Google's own Content ID system is the gold standard — SENTINEL mirrors that approach across all platforms.",
    "YouTube + Google Search are the most effective enforcement channels. Google processes 6M+ DMCA requests per day and de-indexes infringing content from Search results too.",
  ],
  google: [
    "Google's Transparency Report shows they've removed 7+ billion URLs from Search for copyright violations. SENTINEL uses similar signal detection to identify piracy before it spreads.",
    "Google's Content ID on YouTube automatically matches uploaded videos against a database of protected content. SENTINEL extends this concept to 6 other platforms where Content ID doesn't exist.",
  ],
  revenue: [
    "Damage estimates: (risk_score / 100) × ₹6,000 + ₹300 per violation. 15 HIGH threats = ~₹90,000+ exposure. Google's own research shows sports piracy costs broadcasters ₹28B annually.",
    "Every pirated stream costs you ad revenue, subscription revenue, and brand value. SENTINEL quantifies this so you can prioritise enforcement where it matters most.",
  ],
  analytics: [
    "The Analytics page shows monthly violation trends, platform exposure breakdown, damage estimates over time, and a platform risk radar — all updating live after each scan.",
    "Use the enforcement stats panel to track your takedown success rate. Google recommends a 48-hour response window for maximum effectiveness.",
  ],
  default: [
    "I can help with: running scans, DMCA law, threat scoring, platform coverage, analytics, or anything about SENTINEL. What do you need?",
    "Try asking: 'How does Google Content ID work?' or 'What's the fastest way to file a DMCA?' or 'Which platform has the most piracy?'",
    "Powered by Gemini — Google's most capable AI model. I'm here to make IP enforcement faster and smarter for your team.",
  ],
};

function getResponse(input) {
  const q = input.toLowerCase();
  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("start") || q.includes("who are you"))
    return KNOWLEDGE.greet[Math.floor(Math.random() * KNOWLEDGE.greet.length)];
  if (q.includes("google") || q.includes("content id") || q.includes("transparency") || q.includes("search"))
    return KNOWLEDGE.google[Math.floor(Math.random() * KNOWLEDGE.google.length)];
  if (q.includes("dmca") || q.includes("takedown") || q.includes("notice") || q.includes("legal"))
    return KNOWLEDGE.dmca[Math.floor(Math.random() * KNOWLEDGE.dmca.length)];
  if (q.includes("scan") || q.includes("hunt") || q.includes("detect") || q.includes("find"))
    return KNOWLEDGE.scan[Math.floor(Math.random() * KNOWLEDGE.scan.length)];
  if (q.includes("threat") || q.includes("score") || q.includes("severity") || q.includes("risk") || q.includes("high"))
    return KNOWLEDGE.threat[Math.floor(Math.random() * KNOWLEDGE.threat.length)];
  if (q.includes("platform") || q.includes("youtube") || q.includes("tiktok") || q.includes("instagram") || q.includes("twitter"))
    return KNOWLEDGE.platform[Math.floor(Math.random() * KNOWLEDGE.platform.length)];
  if (q.includes("revenue") || q.includes("damage") || q.includes("money") || q.includes("cost") || q.includes("dollar"))
    return KNOWLEDGE.revenue[Math.floor(Math.random() * KNOWLEDGE.revenue.length)];
  if (q.includes("analytic") || q.includes("chart") || q.includes("trend") || q.includes("stat"))
    return KNOWLEDGE.analytics[Math.floor(Math.random() * KNOWLEDGE.analytics.length)];
  return KNOWLEDGE.default[Math.floor(Math.random() * KNOWLEDGE.default.length)];
}

const SUGGESTIONS = [
  { icon: Search,    text: "How do I run a scan?" },
  { icon: Globe,     text: "How does Google Content ID work?" },
  { icon: Lightbulb, text: "What is a DMCA notice?" },
  { icon: Sparkles,  text: "Which platform has most piracy?" },
];

export default function AIChat() {
  const location  = useLocation();
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm Gemini — Google's AI, integrated into SENTINEL. I can help you detect piracy, understand DMCA law, and protect your sports content. What would you like to know?",
      ts: new Date().toLocaleTimeString("en", { hour12: false }),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    const ts = new Date().toLocaleTimeString("en", { hour12: false });
    setMessages(p => [...p, { role: "user", text: msg, ts }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, {
        role: "ai",
        text: getResponse(msg),
        ts: new Date().toLocaleTimeString("en", { hour12: false }),
      }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (location.pathname === "/") return null;

  return (
    <>
      {/* ── FAB ── */}
      {!open && (
        <button className="chat-fab animate-fadeUp" onClick={() => setOpen(true)}>
          <GeminiLogo size={18} />
          <span className="chat-fab-label">Gemini</span>
          <span className="chat-fab-dot" />
        </button>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div className={`chat-window ${expanded ? "chat-window--expanded" : ""} animate-fadeUp`}>

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar-gemini">
                <GeminiLogo size={18} />
              </div>
              <div>
                <div className="chat-title">
                  Gemini
                  <span className="chat-title-badge">AI</span>
                </div>
                <div className="chat-subtitle">
                  <span className="chat-online-dot" />
                  Powered by Google
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="chat-icon-btn" onClick={() => setExpanded(e => !e)}>
                {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button className="chat-icon-btn" onClick={() => setOpen(false)}>
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Google feature strip */}
          <div className="chat-google-strip">
            <div className="chat-google-chip">
              <GoogleG size={11} />
              <span>Google Search</span>
            </div>
            <div className="chat-google-chip">
              <GoogleG size={11} />
              <span>Content ID</span>
            </div>
            <div className="chat-google-chip">
              <GoogleG size={11} />
              <span>DMCA Tools</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "chat-msg--user" : "chat-msg--ai"}`}>
                {m.role === "ai" && (
                  <div className="chat-msg-avatar-gemini">
                    <GeminiLogo size={13} />
                  </div>
                )}
                <div className="chat-msg-bubble">
                  <div className="chat-msg-text">{m.text}</div>
                  <div className="chat-msg-ts">{m.ts}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="chat-msg chat-msg--ai">
                <div className="chat-msg-avatar-gemini"><GeminiLogo size={13} /></div>
                <div className="chat-msg-bubble">
                  <div className="chat-typing">
                    <span style={{ background: "#4285F4" }} />
                    <span style={{ background: "#EA4335" }} />
                    <span style={{ background: "#FBBC05" }} />
                    <span style={{ background: "#34A853" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chat-suggestion" onClick={() => send(s.text)}>
                  <s.icon size={10} />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask Gemini anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="chat-send-btn" onClick={() => send()} disabled={!input.trim()}>
              <Send size={14} />
            </button>
          </div>

          {/* Footer */}
          <div className="chat-footer">
            <GoogleG size={11} />
            <span>Gemini may display inaccurate info. Verify important decisions.</span>
          </div>
        </div>
      )}
    </>
  );
}
