import React, { useState } from "react";
import { loginUser } from "../services/BankService";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import AuthFooter from "./AuthFooter";

const AdminLogin: React.FC = () => {
  const { language } = useAppPreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const t = {
    en: {
      title: "Admin Login",
      back: "Back to Home",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      submit: "Admin Login",
      roleError: "Please use the customer login for non-admin accounts.",
      fail: "Admin login failed. Please try again.",
      forgot: "Forgot your password?",
      reset: "Reset here",
      switchText: "Don't have an admin account?",
      switchBtn: "Admin Signup",
    },
    fr: {
      title: "Connexion administrateur",
      back: "Retour à l'accueil",
      email: "Courriel",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      submit: "Connexion administrateur",
      roleError: "Veuillez utiliser la connexion client pour les comptes non administrateurs.",
      fail: "Échec de la connexion administrateur. Veuillez réessayer.",
      forgot: "Mot de passe oublié ?",
      reset: "Réinitialiser ici",
      switchText: "Vous n'avez pas de compte administrateur ?",
      switchBtn: "Inscription administrateur",
    },
  } as const;
  const s = t[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(email, password);
      if ((user as any).role !== "admin") {
        setError(s.roleError);
        return;
      }
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || s.fail);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-header">
        <button type="button" className="auth-back-btn" onClick={() => navigate("/")}>{s.back}</button>
      </div>
      <h2>{s.title}</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div>
          <label>{s.email}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label>{s.password}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          {s.rememberMe}
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="primary">{s.submit}</button>
        <p className="auth-help">{s.forgot} <a href="#">{s.reset}</a></p>
        <p className="auth-switch-row">
          {s.switchText} <button type="button" onClick={() => navigate("/admin/signup")}>{s.switchBtn}</button>
        </p>
      </form>
      <AuthFooter />
    </div>
  );
};

export default AdminLogin;
