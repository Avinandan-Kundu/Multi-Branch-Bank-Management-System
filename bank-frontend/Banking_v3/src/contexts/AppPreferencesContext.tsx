import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "fr";
export type Theme = "light" | "dark";

interface AppPreferencesContextProps {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextProps | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "pcb-language";
const THEME_STORAGE_KEY = "pcb-theme";

export const AppPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "fr" ? "fr" : "en";
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.body;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const value = useMemo(
    () => ({
      language,
      theme,
      setLanguage: (next: Language) => setLanguageState(next),
      toggleTheme: () => setThemeState((current) => (current === "light" ? "dark" : "light")),
    }),
    [language, theme]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
};

export const useAppPreferences = () => {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }
  return ctx;
};
