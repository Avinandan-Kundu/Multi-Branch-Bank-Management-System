import React from "react";
import { useAppPreferences } from "../contexts/AppPreferencesContext";

const AuthFooter: React.FC = () => {
  const { language } = useAppPreferences();

  const t = {
    en: {
      trademark: "PCB® and the PCB logo are trademarks of PCB Bank.",
      accessibility: "Accessibility",
      privacy: "Privacy and Security",
      legal: "Legal",
      copyright: "© 2026 PCB Bank. All rights reserved.",
    },
    fr: {
      trademark: "PCB® et le logo PCB sont des marques de commerce de PCB Bank.",
      accessibility: "Accessibilité",
      privacy: "Confidentialité et sécurité",
      legal: "Mentions légales",
      copyright: "© 2026 PCB Bank. Tous droits réservés.",
    },
  } as const;

  const s = t[language];

  return (
    <footer className="auth-footer">
      <div className="auth-footer-content">
        <div className="auth-footer-trademark">{s.trademark}</div>
        <nav className="auth-footer-nav">
          <a href="#">{s.accessibility}</a>
          <span className="auth-footer-divider">•</span>
          <a href="#">{s.privacy}</a>
          <span className="auth-footer-divider">•</span>
          <a href="#">{s.legal}</a>
        </nav>
        <div className="auth-footer-copyright">{s.copyright}</div>
      </div>
    </footer>
  );
};

export default AuthFooter;
