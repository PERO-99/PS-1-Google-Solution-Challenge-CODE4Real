# 🛡️ SENTINEL - Sports IP Protection Engine

**Stop Sports Piracy Before It Costs You.**

SENTINEL is the world's most advanced sports content protection platform built to detect unauthorized broadcasts, generate legal takedowns, and protect millions in revenue — all in under 3 seconds. 

Built by a team of 1st-year engineering students who decided piracy was a problem worth solving.

---

## ✨ Features

- **👁️ AI-Powered Detection:** Perceptual fingerprinting + semantic analysis (powered by Google Gemini) catches re-encoded, cropped, or speed-altered pirated content across all major platforms.
- **🌐 7-Platform Coverage:** Monitor YouTube, X (Twitter), TikTok, Instagram, Facebook, Twitch, and Reddit simultaneously in real-time with a single scan command.
- **⚖️ One-Click Legal Forge:** AI-drafted DMCA takedown notices, platform-specific complaint templates, and legal dossiers generated in seconds.
- **📊 Revenue Intelligence:** Estimate ad revenue lost per violation, total damage exposure, and ROI of enforcement.
- **⚡ Real-Time Alerts:** Live activity feed with severity scoring, threat trajectory charts, and instant notifications when new violations surface.
- **📈 Analytics Command Center:** Platform pressure maps, violation trends, and enforcement success rates.

---

## 🚀 Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Vanilla CSS (AAA-Quality UI)

**Backend:**
- Node.js & Express
- Google Generative AI (Gemini Vision API)
- YouTube API (Live data ingestion)
- SerpApi (Web search integration)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API Keys:
  - Google Gemini API Key
  - YouTube API Key (Optional, for live YouTube scans)
  - SerpApi Key (Optional, for live X/TikTok/Web scans)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd "Prompt war project"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   PORT=8787
   GEMINI_API_KEY=your_gemini_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   SERPAPI_KEY=your_serpapi_key_here
   ```
   *Note: If API keys are missing, the backend will gracefully fall back to mock data for demonstration purposes.*

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   This will start both the Vite development server (frontend) and the Express API server (backend) concurrently.

5. **Open in Browser:**
   Navigate to `http://localhost:5173` (or the port Vite provides) to access the application.

---

## 👨‍💻 Meet the Team

We are a group of passionate 1st Year B.Tech students:
- **Ranjeet Kumar** - Team Lead · Full Stack
- **Manjeet Kumar** - Backend · API Systems
- **Mayank Bhaskar** - Frontend · UI/UX
- **Aakriti Singh** - Research · Legal Strategy

---

## 📜 License

This project is proprietary and built as part of an academic/competitive initiative. All rights reserved by the original creators.
