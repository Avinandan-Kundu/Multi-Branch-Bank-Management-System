import React, { useState } from "react";
import { signupUser } from "../services/BankService";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import AuthFooter from "./AuthFooter";

const AdminSignup: React.FC = () => {
  const { language } = useAppPreferences();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [accessLevel, setAccessLevel] = useState("Level 1");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const t = {
    en: {
      title: "Admin Signup",
      back: "Back to Home",
      name: "Name",
      email: "Email",
      password: "Password",
      employeeId: "Employee ID",
      accessLevel: "Access Level",
      required: "All fields are required.",
      failed: "Admin signup failed.",
      submit: "Register Admin",
      accountText: "Already have an admin account?",
      gotoLogin: "Admin Login",
    },
    fr: {
      title: "Inscription administrateur",
      back: "Retour à l'accueil",
      name: "Nom",
      email: "Courriel",
      password: "Mot de passe",
      employeeId: "ID employé",
      accessLevel: "Niveau d'accès",
      required: "Tous les champs sont obligatoires.",
      failed: "Échec de l'inscription administrateur.",
      submit: "Créer le compte admin",
      accountText: "Vous avez déjà un compte ?",
      gotoLogin: "Aller à la connexion admin",
    },
  } as const;
  const s = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !pass || !employeeId) {
      setError(s.required);
      return;
    }

    try {
      await signupUser({
        name,
        email,
        pass,
        balance: 0,
        role: "admin",
        employeeId,
        accessLevel,
      });

      // After account creation, send to admin login.
      navigate("/admin/login");
    } catch (err: any) {
      setError(err.message || s.failed);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-header">
        <button type="button" className="auth-back-btn" onClick={() => navigate("/")}>{s.back}</button>
      </div>
      <h2>{s.title}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label>{s.name}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>{s.email}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label>{s.password}</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        </div>

        <div>
          <label>{s.employeeId}</label>
          <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
        </div>

        <div>
          <label>{s.accessLevel}</label>
          <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
          <option>Level 1</option>
          <option>Level 2</option>
          <option>Level 3</option>
          </select>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="primary">{s.submit}</button>
        <p className="auth-help">{s.accountText} <button type="button" onClick={() => navigate("/admin/login")}>{s.gotoLogin}</button></p>
      </form>
      <AuthFooter />
    </div>
  );
};

export default AdminSignup;
