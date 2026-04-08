import React, { useState, useEffect } from "react";
import { signupUser, getAllBranches } from "../services/BankService";
import { Branch, User } from "../types";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import AuthFooter from "./AuthFooter";

/**
 * Signup Component
 *
 * Allows new customers to create bank accounts. Provides a registration form
 * with branch selection and automatic login after successful signup.
 *
 * Features:
 * - User registration form (name, email, password, branch selection)
 * - Branch dropdown populated from available branches
 * - Form validation (required fields)
 * - Automatic login and redirection after signup
 * - Error handling and display
 *
 * State management:
 * - name: User's full name
 * - email: User's email address
 * - pass: User's password
 * - branchId: Selected branch ID
 * - branches: Array of available branches for dropdown
 * - error: Error message display
 *
 * Business logic:
 * - New customers start with a default balance of $5000
 * - Users are assigned the "customer" role by default
 *
 * For backend integration:
 * - Add password strength validation
 * - Implement email verification
 * - Add terms of service agreement
 * - Include CAPTCHA for spam prevention
 * - Add duplicate email checking
 * - Implement proper user onboarding flow
 * - Add profile picture upload
 * - Send welcome email after registration
 */
const Signup: React.FC = () => {
  const { language } = useAppPreferences();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState<string>("");

  // Navigation hook
  const navigate = useNavigate();

  const t = {
    en: {
      title: "Client Signup",
      back: "Back to Home",
      name: "Name",
      email: "Email",
      password: "Password",
      branch: "Branch",
      selectBranch: "Select a branch",
      submit: "Create Account",
      allRequired: "All fields are required.",
      loadBranches: "Failed to load branches",
      signupFailed: "Signup failed.",
      accountText: "Already have a client account?",
      gotoLogin: "Client Login",
    },
    fr: {
      title: "Inscription client",
      back: "Retour à l'accueil",
      name: "Nom",
      email: "Courriel",
      password: "Mot de passe",
      branch: "Agence",
      selectBranch: "Sélectionnez une agence",
      submit: "Créer un compte",
      allRequired: "Tous les champs sont obligatoires.",
      loadBranches: "Impossible de charger les agences",
      signupFailed: "Échec de l'inscription.",
      accountText: "Vous avez déjà un compte client ?",
      gotoLogin: "Connexion client",
    },
  } as const;
  const s = t[language];

  /**
   * Load Available Branches
   *
   * Fetches all branches on component mount to populate the branch selection dropdown.
   */
  useEffect(() => {
    getAllBranches().then(setBranches).catch(() => {
      setError(s.loadBranches);
    });
  }, [s.loadBranches]);

  /**
   * Handle Signup Form Submission
   *
   * Validates form data, creates new user account, and redirects to customer dashboard.
   *
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic form validation
    if (!name || !email || !pass || !branchId) {
      return setError(s.allRequired);
    }

    try {
      // Create new user account
      const user: User = await signupUser({
        name,
        email,
        pass,
        balance: 5000, // Default starting balance for new customers
        branchId,
      });

      // Store user session (for onboarding, if needed)
      localStorage.setItem("user", JSON.stringify(user));

      // After successful account creation, redirect to customer login
      // to enter credentials and proceed.
      navigate("/login");
    } catch (err: any) {
      setError(err.message || s.signupFailed);
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
          <label>{s.branch}</label>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} required>
            <option value="">{s.selectBranch}</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.location}
            </option>
          ))}
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">{s.submit}</button>
        <p className="auth-switch-row">
          {s.accountText} <button type="button" onClick={() => navigate("/login")}>{s.gotoLogin}</button>
        </p>
      </form>
      <AuthFooter />
    </div>
  );
};

export default Signup;
