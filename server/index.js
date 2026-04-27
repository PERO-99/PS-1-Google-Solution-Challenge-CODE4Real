import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const confidenceSignals = [
  "free",
  "full match",
  "live stream",
  "reupload",
  "mirror",
  "leak",
  "no copyright",
  "highlights",
  "watch online",
  "pirated",
  "unauthorized",
  "bypass",
  "repost",
  "stream",
  "full video",
];

const riskyChannels = [
  "free",
  "mirror",
  "leak",
  "pirate",
  "reupload",
  "sports live",
  "clipzone",
  "viral",
  "hq",
  "tv",
  "hub",
];

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function scoreEntry({ title = "", description = "", channel = "", query = "" }) {
  const t = `${title} ${description}`.toLowerCase();
  const c = channel.toLowerCase();
  const q = query.toLowerCase().trim();

  let score = 30;
  const reasons = [];

  confidenceSignals.forEach((sig) => {
    if (t.includes(sig)) {
      score += 7;
      reasons.push(`Contains piracy signal: \"${sig}\"`);
    }
  });

  riskyChannels.forEach((sig) => {
    if (c.includes(sig)) {
      score += 6;
      reasons.push(`Suspicious channel pattern: \"${sig}\"`);
    }
  });

  if (q && title.toLowerCase().includes(q)) {
    score += 18;
    reasons.push("Exact/near-exact title match with protected query");
  }

  if (title.length > 8 && t.includes("full")) {
    score += 6;
  }

  const bounded = clamp(Math.round(score), 0, 99);
  const severity = bounded >= 75 ? "HIGH" : bounded >= 45 ? "MEDIUM" : "LOW";

  return {
    score: bounded,
    severity,
    reason: reasons.slice(0, 2).join(" | ") || "Pattern risk detected; manual review advised",
  };
}

async function scanYouTube({ query, maxResults }) {
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("type", "video");
  endpoint.searchParams.set("maxResults", String(maxResults));
  endpoint.searchParams.set("key", process.env.YOUTUBE_API_KEY);

  const response = await fetch(endpoint);
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data?.error?.message || "YouTube API request failed");
  }

  return (data.items || []).map((item) => ({
    id: item.id?.videoId || `yt_${Math.random().toString(36).slice(2, 8)}`,
    platform: "YouTube",
    title: item.snippet?.title || "Untitled",
    channel: item.snippet?.channelTitle || "Unknown Channel",
    description: item.snippet?.description || "",
    date: (item.snippet?.publishedAt || "").slice(0, 10),
    url: `https://youtube.com/watch?v=${item.id?.videoId}`,
    thumb: item.snippet?.thumbnails?.medium?.url || "",
  }));
}

async function serpSearch({ query, platform, maxResults }) {
  const platformSite = platform === "X" ? "twitter.com" : "tiktok.com";
  const q = `${query} site:${platformSite}`;

  const endpoint = new URL("https://serpapi.com/search.json");
  endpoint.searchParams.set("engine", "google");
  endpoint.searchParams.set("q", q);
  endpoint.searchParams.set("num", String(maxResults));
  endpoint.searchParams.set("api_key", process.env.SERPAPI_KEY);

  const response = await fetch(endpoint);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${platform} search failed`);
  }

  return (data.organic_results || []).map((result, idx) => ({
    id: `${platform.toLowerCase()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
    platform,
    title: result.title || `${platform} post` ,
    channel: result.source || `${platform} account`,
    description: result.snippet || "",
    date: "",
    url: result.link || "",
    thumb: result.thumbnail || "",
  }));
}

function makeMockPlatformData({ query, platform, maxResults }) {
  const nouns = [
    "Final", "Highlights", "Replay", "Live", "Broadcast", "Clip", "Goal", "Stream", 
    "Full Match", "Super Over", "T20 Highlights", "Best Moments", "Wickets", 
    "Batting Show", "Live Score", "Pirated Stream", "Action", "Uncut"
  ];
  const channels = [
    "LeakZone", "MirrorSports", "FastReplay", "SportsBuzz", "UnofficialTV", 
    "MatchHub", "CricketMania", "LiveCric", "Sports365", "StreamPirates", 
    "DailySports", "FreeHit", "StumpMic", "BoundaryTracker", "IPLStreams"
  ];
  const prefixes = ["", "HD ", "4K ", "1080p ", "Watch ", "Free "];

  return Array.from({ length: maxResults }, (_, i) => {
    const noun = nouns[(i + platform.length) % nouns.length];
    const channel = channels[(i * 3 + platform.length) % channels.length];
    const prefix = prefixes[(i * 2) % prefixes.length];
    const isFree = i % 3 === 0 ? "FREE" : "";
    
    return {
      id: `${platform.toLowerCase()}_mock_${i}`,
      platform,
      title: `${prefix}${query} ${noun} ${isFree}`.trim(),
      channel: channel,
      description: "Reposted sports content. No ownership attribution.",
      date: `2026-04-${String(10 + i).padStart(2, "0")}`,
      url: `https://example.com/${platform.toLowerCase()}/${i}`,
      thumb: `https://picsum.photos/seed/${platform}_${i}/320/180`,
    };
  });
}

function createDmcaTemplate({ organizationName, contentName, violation }) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `To: Copyright Agent, ${violation.platform}\nSubject: DMCA Takedown Notice (17 U.S.C. 512(c))\nDate: ${today}\n\nI, [Authorized Representative], am writing on behalf of ${organizationName || "[Rights Holder]"}.\n\n1) Copyrighted Work\nThe copyrighted work at issue is: ${contentName || "[Protected Sports Media Content]"}.\n\n2) Infringing Material\nThe material believed to be infringing appears at:\n- URL: ${violation.url}\n- Platform: ${violation.platform}\n- Account/Channel: ${violation.channel}\n- Title: ${violation.title}\n\n3) Good Faith Statement\nI have a good faith belief that the use of the material described above is not authorized by the copyright owner, its agent, or the law.\n\n4) Accuracy and Authority Statement\nI swear, under penalty of perjury, that the information in this notice is accurate and that I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.\n\n5) Contact Information\nName: [Full Name]\nOrganization: ${organizationName || "[Organization]"}\nAddress: [Mailing Address]\nEmail: [Email Address]\nPhone: [Phone Number]\n\nSignature:\n[Digital Signature]\n`; 
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "sentinel-api",
    timestamp: new Date().toISOString(),
    integrations: {
      youtube: Boolean(process.env.YOUTUBE_API_KEY),
      serpapi: Boolean(process.env.SERPAPI_KEY),
    },
  });
});

app.post("/api/scan", async (req, res) => {
  try {
    const {
      contentName = "",
      keywords = "",
      maxResults = 8,
      includePlatforms = { youtube: true, x: true, tiktok: true, instagram: false, facebook: false, twitch: false, reddit: false },
    } = req.body || {};

    const query = `${contentName} ${keywords}`.trim();
    if (!query) {
      return res.status(400).json({ error: "Content name or keywords are required" });
    }

    const normalizedMax = clamp(Number(maxResults) || 8, 3, 20);
    const tasks = [];

    if (includePlatforms.youtube) {
      tasks.push(process.env.YOUTUBE_API_KEY
        ? scanYouTube({ query, maxResults: normalizedMax })
          .catch(() => makeMockPlatformData({ query, platform: "YouTube", maxResults: normalizedMax }))
        : Promise.resolve(makeMockPlatformData({ query, platform: "YouTube", maxResults: normalizedMax }))
      );
    }

    if (includePlatforms.x) {
      tasks.push(process.env.SERPAPI_KEY
        ? serpSearch({ query, platform: "X", maxResults: normalizedMax })
          .catch(() => makeMockPlatformData({ query, platform: "X", maxResults: normalizedMax }))
        : Promise.resolve(makeMockPlatformData({ query, platform: "X", maxResults: normalizedMax }))
      );
    }

    if (includePlatforms.tiktok) {
      tasks.push(process.env.SERPAPI_KEY
        ? serpSearch({ query, platform: "TikTok", maxResults: normalizedMax })
          .catch(() => makeMockPlatformData({ query, platform: "TikTok", maxResults: normalizedMax }))
        : Promise.resolve(makeMockPlatformData({ query, platform: "TikTok", maxResults: normalizedMax }))
      );
    }

    if (includePlatforms.instagram) {
      tasks.push(Promise.resolve(makeMockPlatformData({ query, platform: "Instagram", maxResults: Math.min(normalizedMax, 5) })));
    }
    if (includePlatforms.facebook) {
      tasks.push(Promise.resolve(makeMockPlatformData({ query, platform: "Facebook", maxResults: Math.min(normalizedMax, 5) })));
    }
    if (includePlatforms.twitch) {
      tasks.push(Promise.resolve(makeMockPlatformData({ query, platform: "Twitch", maxResults: Math.min(normalizedMax, 4) })));
    }
    if (includePlatforms.reddit) {
      tasks.push(Promise.resolve(makeMockPlatformData({ query, platform: "Reddit", maxResults: Math.min(normalizedMax, 4) })));
    }

    const settled = await Promise.all(tasks);

    const violations = settled
      .flat()
      .map((item) => {
        const scored = scoreEntry({
          title: item.title,
          description: item.description,
          channel: item.channel,
          query,
        });
        return {
          ...item,
          ...scored,
          viewsEstimate: Math.round((scored.score / 100) * 150000 + 1200),
          damageEstimateUsd: Math.round((scored.score / 100) * 6000 + 300),
        };
      })
      .filter((v) => v.score >= 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    const counts = violations.reduce((acc, v) => {
      acc[v.platform] = (acc[v.platform] || 0) + 1;
      return acc;
    }, {});

    res.json({
      query,
      violations,
      summary: {
        total: violations.length,
        high: violations.filter((v) => v.severity === "HIGH").length,
        medium: violations.filter((v) => v.severity === "MEDIUM").length,
        low: violations.filter((v) => v.severity === "LOW").length,
        byPlatform: counts,
      },
      sourceMode: {
        youtube: process.env.YOUTUBE_API_KEY ? "live_or_fallback" : "fallback",
        x: process.env.SERPAPI_KEY ? "live_or_fallback" : "fallback",
        tiktok: process.env.SERPAPI_KEY ? "live_or_fallback" : "fallback",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Scan failed" });
  }
});

app.post("/api/dmca", (req, res) => {
  try {
    const { organizationName = "", contentName = "", violation } = req.body || {};
    if (!violation?.url) {
      return res.status(400).json({ error: "Violation payload is required" });
    }

    const notice = createDmcaTemplate({
      organizationName,
      contentName,
      violation,
    });

    res.json({ notice });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate DMCA" });
  }
});

app.post("/api/vision", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a Sports IP Forensic Analyst. 
Examine the following image from a pirated stream or sports broadcast.
Identify the sport, the teams or players involved, and any broadcaster logos or watermarks.
Return ONLY a strictly valid JSON object with the following structure (no markdown tags, no extra text):
{
  "contentName": "string, e.g. 'Manchester United vs Arsenal'",
  "keywords": "string, e.g. 'Manchester United Arsenal Premier League Sky Sports stream'",
  "broadcaster": "string or null, e.g. 'Sky Sports'"
}`;

    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up any potential markdown code blocks
    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (text.startsWith("\`\`\`")) {
      text = text.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse AI response as JSON", raw: text });
    }

  } catch (error) {
    res.status(500).json({ error: error.message || "Vision analysis failed" });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SENTINEL API running on http://127.0.0.1:${PORT}`);
  });
}

export default app;
