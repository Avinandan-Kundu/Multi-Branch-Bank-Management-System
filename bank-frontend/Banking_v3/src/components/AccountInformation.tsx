import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBranches, updateCurrentUserProfile } from "../services/BankService";
import { Branch, User } from "../types";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import AuthFooter from "./AuthFooter";

const AccountInformation: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppPreferences();
  const [user, setUser] = useState<User | null>(null);
  const [branchName, setBranchName] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const t = {
    en: {
      title: "Account Information",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      role: "Role",
      branch: "Home Branch",
      customerId: "Customer ID",
      adminId: "Admin ID",
      customer: "Customer",
      admin: "Administrator",
      unavailable: "Not available",
      changeEmail: "Change Email",
      changePassword: "Change Password",
      save: "Save",
      cancel: "Cancel",
      showPassword: "Show password",
      hidePassword: "Hide password",
      emailUpdated: "Email updated successfully.",
      passwordUpdated: "Password updated successfully.",
      invalidEmail: "Please enter a valid email address.",
      invalidPassword: "Password cannot be empty.",
    },
    fr: {
      title: "Informations du compte",
      fullName: "Nom complet",
      email: "Adresse courriel",
      password: "Mot de passe",
      role: "Rôle",
      branch: "Agence principale",
      customerId: "ID client",
      adminId: "ID administrateur",
      customer: "Client",
      admin: "Administrateur",
      unavailable: "Non disponible",
      changeEmail: "Modifier le courriel",
      changePassword: "Modifier le mot de passe",
      save: "Enregistrer",
      cancel: "Annuler",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      emailUpdated: "Courriel mis à jour avec succès.",
      passwordUpdated: "Mot de passe mis à jour avec succès.",
      invalidEmail: "Veuillez entrer une adresse courriel valide.",
      invalidPassword: "Le mot de passe ne peut pas être vide.",
    },
  } as const;

  const s = t[language];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);
    setEmailDraft(parsedUser.email);
    setPasswordDraft(parsedUser.pass);

    getAllBranches()
      .then((branches: Branch[]) => {
        const branch = branches.find((item) => item._id === parsedUser.branchId);
        setBranchName(branch?.location || s.unavailable);
      })
      .catch(() => setBranchName(s.unavailable));
  }, [navigate, s.unavailable]);

  const handleSaveEmail = async () => {
    const trimmedEmail = emailDraft.trim();
    if (!trimmedEmail.includes("@")) {
      setStatusMessage(s.invalidEmail);
      return;
    }

    if (!user) {
      return;
    }

    try {
      const updatedUser = await updateCurrentUserProfile(user._id, { email: trimmedEmail });
      setUser(updatedUser);
      setStatusMessage(s.emailUpdated);
      setIsEditingEmail(false);
    } catch (error: any) {
      setStatusMessage(error.message || s.invalidEmail);
    }
  };

  const handleSavePassword = async () => {
    if (!passwordDraft.trim()) {
      setStatusMessage(s.invalidPassword);
      return;
    }

    if (!user) {
      return;
    }

    try {
      const updatedUser = await updateCurrentUserProfile(user._id, { pass: passwordDraft });
      setUser(updatedUser);
      setStatusMessage(s.passwordUpdated);
      setIsEditingPassword(false);
    } catch (error: any) {
      setStatusMessage(error.message || s.invalidPassword);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="account-page-wrap">
      <section className="account-page customer-page">
        <div className="account-card-header">
          <h2>{s.title}</h2>
        </div>
        <div className="account-grid">
          <div className="account-field">
            <span>{s.fullName}</span>
            <strong>{user.name}</strong>
          </div>
          <div className="account-field full-width">
            <span>{s.email}</span>
            {isEditingEmail ? (
              <div className="account-inline">
                <input
                  className="account-input"
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                />
                <button type="button" className="account-action-btn" onClick={handleSaveEmail}>{s.save}</button>
                <button
                  type="button"
                  className="account-action-btn secondary"
                  onClick={() => {
                    setEmailDraft(user.email);
                    setIsEditingEmail(false);
                  }}
                >
                  {s.cancel}
                </button>
              </div>
            ) : (
              <div className="account-inline">
                <strong>{user.email}</strong>
                <button type="button" className="account-action-btn" onClick={() => setIsEditingEmail(true)}>{s.changeEmail}</button>
              </div>
            )}
          </div>
          <div className="account-field full-width">
            <span>{s.password}</span>
            {isEditingPassword ? (
              <div className="account-inline">
                <div className="account-password-wrap">
                  <input
                    className="account-input"
                    type={showPassword ? "text" : "password"}
                    value={passwordDraft}
                    onChange={(e) => setPasswordDraft(e.target.value)}
                  />
                  <button
                    type="button"
                    className="account-eye-btn"
                    aria-label={showPassword ? s.hidePassword : s.showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <button type="button" className="account-action-btn" onClick={handleSavePassword}>{s.save}</button>
                <button
                  type="button"
                  className="account-action-btn secondary"
                  onClick={() => {
                    setPasswordDraft(user.pass);
                    setIsEditingPassword(false);
                    setShowPassword(false);
                  }}
                >
                  {s.cancel}
                </button>
              </div>
            ) : (
              <div className="account-inline">
                <strong>{showPassword ? user.pass : "*".repeat(Math.max(user.pass.length, 8))}</strong>
                <button
                  type="button"
                  className="account-eye-btn"
                  aria-label={showPassword ? s.hidePassword : s.showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                <button type="button" className="account-action-btn" onClick={() => setIsEditingPassword(true)}>{s.changePassword}</button>
              </div>
            )}
          </div>
          <div className="account-field">
            <span>{s.role}</span>
            <strong>{user.role === "admin" ? s.admin : s.customer}</strong>
          </div>
          <div className="account-field">
            <span>{s.branch}</span>
            <strong>{branchName}</strong>
          </div>
          <div className="account-field full-width">
            <span>{user.role === "admin" ? s.adminId : s.customerId}</span>
            <strong>{user._id}</strong>
          </div>
        </div>
        {statusMessage && <p className="account-status-message">{statusMessage}</p>}
      </section>
      <AuthFooter />
    </div>
  );
};

export default AccountInformation;
