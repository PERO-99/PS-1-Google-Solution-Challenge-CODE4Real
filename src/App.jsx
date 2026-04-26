import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Hunter from "./pages/Hunter.jsx";
import Dossiers from "./pages/Dossiers.jsx";
import LegalForge from "./pages/LegalForge.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import AppShell from "./components/AppShell.jsx";
import AIChat from "./components/AIChat.jsx";
import ParticleField from "./components/ParticleField.jsx";
import { SentinelProvider } from "./context/SentinelContext.jsx";

export default function App() {
  const location = useLocation();
  const isAuthLayout = ["/", "/login"].includes(location.pathname);

  return (
    <SentinelProvider>
      <div className="noise" />
      <ParticleField />
      {isAuthLayout ? (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <AppShell>
          <Routes>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/hunter"     element={<Hunter />} />
            <Route path="/dossiers"   element={<Dossiers />} />
            <Route path="/legal"      element={<LegalForge />} />
            <Route path="/analytics"  element={<Analytics />} />
            <Route path="/settings"   element={<Settings />} />
          </Routes>
        </AppShell>
      )}
      <AIChat />
    </SentinelProvider>
  );
}
