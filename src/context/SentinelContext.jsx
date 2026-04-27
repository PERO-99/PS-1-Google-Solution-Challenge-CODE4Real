import { createContext, useContext, useState, useEffect, useCallback } from "react";

const Ctx = createContext(null);

export function SentinelProvider({ children }) {
  const [threats, setThreats]           = useState([]);
  const [logs, setLogs]                 = useState([]);
  const [feed, setFeed]                 = useState([
    { t: "00:00:01", type: "ok",   m: "SENTINEL v3 initialized" },
    { t: "00:00:02", type: "info", m: "All systems nominal" },
    { t: "00:00:03", type: "info", m: "Awaiting scan command" },
  ]);
  const [status, setStatus]             = useState("idle");
  const [progress, setProgress]         = useState(0);
  const [scanError, setScanError]       = useState("");
  const [apiHealth, setApiHealth]       = useState(null);
  const [dmcaTarget, setDmcaTarget]     = useState(null);
  const [dmcaText, setDmcaText]         = useState("");
  const [dmcaLoading, setDmcaLoading]   = useState(false);
  const [contentName, setContentName]   = useState("");
  const [keywords, setKeywords]         = useState("");
  const [orgName, setOrgName]           = useState("");
  const [maxResults, setMaxResults]     = useState(8);
  const [includePlatforms, setIncludePlatforms] = useState({
    youtube: true, x: true, tiktok: true,
    instagram: true, facebook: false, twitch: false, reddit: false,
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("sentinel-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sentinel-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(t => t === "dark" ? "light" : "dark"), []);

  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(d => setApiHealth(d))
      .catch(() => setApiHealth({ ok: false, integrations: {} }));
  }, []);

  const addFeed = useCallback((m, type = "info") => {
    const t = new Date().toLocaleTimeString("en", { hour12: false });
    setFeed(p => [...p.slice(-30), { t, m, type }]);
  }, []);

  const addLog = useCallback((m, type = "info") => {
    const t = new Date().toLocaleTimeString("en", { hour12: false });
    setLogs(p => [...p, { t, m, type }]);
    addFeed(m, type);
  }, [addFeed]);

  const togglePlatform = useCallback((name) => {
    setIncludePlatforms(prev => {
      const next = { ...prev, [name]: !prev[name] };
      const anyOn = Object.values(next).some(Boolean);
      return anyOn ? next : prev;
    });
  }, []);

  const runScan = useCallback(async (file) => {
    setStatus("scanning");
    setProgress(0);
    setScanError("");
    setThreats([]);
    setLogs([]);
    addLog("Booting SENTINEL hunt engine v3", "info");

    // Animated progress ticker
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 4 + 1;
      if (currentProgress < 75) setProgress(Math.round(currentProgress));
    }, 200);

    try {
      let finalContentName = contentName;
      let finalKeywords = keywords;

      if (file) {
        addLog(`Analyzing ${file.name} with Vision AI...`, "warn");
        
        const toBase64 = (f) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = error => reject(error);
        });
        
        try {
          const base64 = await toBase64(file);
          const visionRes = await fetch("/api/vision", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
          });
          
          if (!visionRes.ok) {
            const errData = await visionRes.json();
            throw new Error(errData.error || "Vision analysis failed");
          }
          
          const visionData = await visionRes.json();
          finalContentName = visionData.contentName || finalContentName;
          finalKeywords = visionData.keywords || finalKeywords;
          setContentName(finalContentName);
          setKeywords(finalKeywords);
          
          addLog(`Vision AI identified: ${finalContentName}`, "ok");
          if (visionData.broadcaster) {
            addLog(`Detected Broadcaster: ${visionData.broadcaster}`, "info");
          }
        } catch (e) {
          addLog(`Vision AI Error: ${e.message}`, "error");
          addLog("Falling back to manual inputs...", "warn");
        }
      }
      
      if (!finalContentName.trim() && !finalKeywords.trim()) {
        throw new Error("Content Name or Keywords are required (either manual or via AI Vision)");
      }

      addLog("Deploying hunters across 7 platforms", "info");

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentName: finalContentName, keywords: finalKeywords, maxResults, includePlatforms }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Scan failed");

      clearInterval(progressInterval);
      setProgress(90);

      const iplImages = [
        "/rcb_vs_csk_1_1777312368881.png",
        "/rcb_vs_csk_2_1777312394936.png",
        "/rcb_vs_csk_3_1777312418387.png"
      ];
      const found = (payload.violations || []).map((v, idx) => ({
        ...v,
        thumb: v.thumb || iplImages[idx % iplImages.length],
      }));
      setThreats(found);
      addLog(`Threat engine found ${found.length} violations`, "ok");

      // Final progress animation
      setTimeout(() => setProgress(100), 200);
      setTimeout(() => {
        setStatus("complete");
        addLog("Scan complete. Ready for legal action.", "ok");
      }, 400);

    } catch (err) {
      clearInterval(progressInterval);
      setStatus("error");
      setScanError(err.message);
      addLog(`Fatal: ${err.message}`, "error");
    }
  }, [contentName, keywords, maxResults, includePlatforms, addLog]);

  const generateDmca = useCallback(async (threat) => {
    setDmcaTarget(threat);
    setDmcaText("");
    setDmcaLoading(true);
    addFeed(`Generating legal notice for ${threat.platform}`, "warn");
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
      setDmcaText(payload.notice || "No notice returned");
      addFeed("DMCA notice ready", "ok");
    } catch (err) {
      setDmcaText(`Error: ${err.message}`);
    }
    setDmcaLoading(false);
  }, [orgName, contentName, keywords, addFeed]);

  return (
    <Ctx.Provider value={{
      threats, logs, feed, status, progress, scanError,
      apiHealth, dmcaTarget, dmcaText, dmcaLoading,
      contentName, setContentName,
      keywords, setKeywords,
      orgName, setOrgName,
      maxResults, setMaxResults,
      includePlatforms, togglePlatform,
      runScan, generateDmca, addFeed, addLog,
      theme, toggleTheme,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSentinel = () => useContext(Ctx);
