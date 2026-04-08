import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/BankService";
import { User } from "../types";
import { useAppPreferences } from "../contexts/AppPreferencesContext";

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAppPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const t = {
    en: {
      dashboard: "Your Dashboard",
      accountInformation: "Account Information",
      logout: "Logout",
      profileMenu: "Open profile menu",
    },
    fr: {
      dashboard: "Votre tableau de bord",
      accountInformation: "Informations du compte",
      logout: "Se déconnecter",
      profileMenu: "Ouvrir le menu du profil",
    },
  } as const;

  const s = t[language];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
    navigate(user.role === "admin" ? "/admin/login" : "/login");
  };

  const handleAccountInformation = () => {
    setIsOpen(false);
    navigate("/account");
  };

  const handleDashboard = () => {
    setIsOpen(false);
    navigate(user.role === "admin" ? "/admin" : "/customer");
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-menu-trigger"
        aria-label={s.profileMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {initials}
      </button>
      {isOpen && (
        <div className="profile-menu-dropdown" role="menu">
          <button type="button" className="profile-menu-item" onClick={handleDashboard}>
            {s.dashboard}
          </button>
          <button type="button" className="profile-menu-item" onClick={handleAccountInformation}>
            {s.accountInformation}
          </button>
          <button type="button" className="profile-menu-item danger" onClick={handleLogout}>
            {s.logout}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
