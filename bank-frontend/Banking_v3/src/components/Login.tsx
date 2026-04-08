import React, { useState } from "react";
import { loginUser } from "../services/BankService";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import AuthFooter from "./AuthFooter";

/**
 * Login Component
 *
 * Handles user authentication for both customers and administrators.
 * Provides a form for email/password login and redirects to appropriate
 * dashboard based on user role.
 *
 * Features:
 * - Email and password input fields
 * - Form validation (required fields)
 * - Error handling and display
 * - Role-based navigation (admin vs customer)
 *
 * State management:
 * - email: User's email input
 * - password: User's password input
 * - error: Error message display
 *
 * Navigation logic:
 * - Admin users (role: "admin") → /admin
 * - Customer users (default) → /customer
 *
 * For backend integration:
 * - Add loading states during authentication
 * - Implement "Remember me" functionality
 * - Add password reset/forgot password link
 * - Use proper form libraries (react-hook-form) for validation
 * - Add CAPTCHA for security
 * - Implement session persistence with refresh tokens
 */
const Login: React.FC = () => {
  const { language } = useAppPreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  const t = {
    en: {
      title: "Client Login",
      back: "Back to Home",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      submit: "Login",
      forgot: "Forgot your password?",
      fail: "Login failed. Please try again.",
      switchText: "Don't have a client account?",
      switchBtn: "Client Signup",
    },
    fr: {
      title: "Connexion client",
      back: "Retour à l'accueil",
      email: "Courriel",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      submit: "Se connecter",
      forgot: "Mot de passe oublié ?",
      fail: "Échec de la connexion. Veuillez réessayer.",
      switchText: "Vous n'avez pas de compte client ?",
      switchBtn: "Inscription client",
    },
  } as const;
  const s = t[language];

  /**
   * Handle Login Form Submission
   *
   * Processes the login form, authenticates the user, and redirects
   * to the appropriate dashboard.
   *
   * @param e - Form submission event
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Authenticate user via service
      const user = await loginUser(email, password);

      // Store user session in localStorage
      // TODO: Replace with secure session management
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based navigation
      // TODO: Use proper type guards instead of 'as any'
      if ((user as any).role === "admin") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    } catch (err: any) {
      // Display authentication errors
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
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{s.password}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
          />
          {s.rememberMe}
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{s.submit}</button>
        <div style={{ marginTop: "0.75rem" }}>
          <a href="#" style={{ color: "#0d47a1", textDecoration: "none" }}>{s.forgot}</a>
        </div>
        <p className="auth-switch-row">
          {s.switchText} <button type="button" onClick={() => navigate("/signup")}>{s.switchBtn}</button>
        </p>
      </form>
      <AuthFooter />
    </div>
  );
};

export default Login;
