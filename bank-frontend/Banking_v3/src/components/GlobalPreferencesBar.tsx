import React from "react";
import { Link } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import ProfileMenu from "./ProfileMenu";

const GlobalPreferencesBar: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme } = useAppPreferences();

  return (
    <header className="global-topbar">
      <Link to="/" className="global-brand" aria-label="Go to home page">
        <img src="/bank_logo.png" alt="People's Choice Bank Logo" className="global-brand-logo" />
        <div className="global-brand-text">
          <strong>People's Choice Bank</strong>
          <span>Modern Digital Banking</span>
        </div>
      </Link>

      <div className="global-topbar-actions">
        <div className="global-pref-bar" role="group" aria-label="Global app preferences">
          <div className="global-lang-toggle" role="group" aria-label="Language">
            <button
              className={`global-toggle-btn ${language === "en" ? "active" : ""}`}
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
            <button
              className={`global-toggle-btn ${language === "fr" ? "active" : ""}`}
              onClick={() => setLanguage("fr")}
              aria-pressed={language === "fr"}
            >
              FR
            </button>
          </div>
          <button className="global-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙 Dark" : "☀ Light"}
          </button>
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
};

export default GlobalPreferencesBar;
