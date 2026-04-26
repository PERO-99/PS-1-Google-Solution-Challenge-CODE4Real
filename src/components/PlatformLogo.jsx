// Inline SVG logos for all 7 platforms — no external deps needed

const logos = {
  YouTube: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#FF0000" />
      <path d="M19.8 7.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C14.8 4 12 4 12 4s-2.8 0-5 .3c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S4 8.8 4 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C8.8 18 12 18 12 18s2.8 0 5-.3c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C20 8.8 19.8 7.2 19.8 7.2z" fill="white" />
      <path d="M10 14.5v-5l5 2.5-5 2.5z" fill="#FF0000" />
    </svg>
  ),

  X: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path d="M17.75 3h3.08l-6.73 7.7L22 21h-6.2l-4.85-6.35L5.24 21H2.15l7.2-8.23L2 3h6.36l4.38 5.79L17.75 3zm-1.08 16.2h1.71L7.42 4.74H5.6l11.07 14.46z" fill="white" />
    </svg>
  ),

  TikTok: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#010101" />
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" fill="white" />
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" fill="#69C9D0" opacity="0.5" />
    </svg>
  ),

  Instagram: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  ),

  Facebook: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#1877F2" />
      <path d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z" fill="white" />
    </svg>
  ),

  Twitch: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#9146FF" />
      <path d="M5 3L3 7v13h5v3h3l3-3h4l4-4V3H5zm14 11l-3 3h-4l-3 3v-3H6V5h13v9z" fill="white" />
      <rect x="14" y="8" width="2" height="5" rx="1" fill="white" />
      <rect x="10" y="8" width="2" height="5" rx="1" fill="white" />
    </svg>
  ),

  Reddit: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#FF4500" />
      <circle cx="12" cy="13" r="6" fill="white" />
      <circle cx="9.5" cy="13" r="1.2" fill="#FF4500" />
      <circle cx="14.5" cy="13" r="1.2" fill="#FF4500" />
      <path d="M9.5 15.5s.8 1.5 2.5 1.5 2.5-1.5 2.5-1.5" stroke="#FF4500" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="9" r="2" fill="white" />
      <path d="M12 7V4M12 4l-2 2M12 4l2 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="19" cy="9" r="1" fill="#FF4500" />
    </svg>
  ),
};

// Map platform name variants to logo keys
const PLATFORM_MAP = {
  youtube: "YouTube",
  "x": "X",
  "x / twitter": "X",
  twitter: "X",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  twitch: "Twitch",
  reddit: "Reddit",
};

export default function PlatformLogo({ platform, size = 16 }) {
  const key = PLATFORM_MAP[platform?.toLowerCase()] || platform;
  const Logo = logos[key];
  if (!Logo) return null;
  return <Logo size={size} />;
}

export { logos, PLATFORM_MAP };
