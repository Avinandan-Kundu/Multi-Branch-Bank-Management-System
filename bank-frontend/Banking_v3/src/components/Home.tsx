import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import ProfileMenu from "./ProfileMenu";
import "./Home.css";

/**
 * Home Component - Landing Page
 *
 * This is the main landing page of the banking application. It provides
 * navigation to authentication pages (login/signup) and displays the
 * bank branding.
 *
 * Features:
 * - Bank logo display
 * - Welcome message
 * - Navigation buttons for Login and Sign Up
 *
 * Navigation:
 * - Login button: Redirects to /login
 * - Sign Up button: Redirects to /signup
 *
 * For backend integration:
 * - Could add dynamic content like news/announcements
 * - Implement user session check to auto-redirect logged-in users
 * - Add marketing content or promotional banners
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language, theme, setLanguage, toggleTheme } = useAppPreferences();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(Boolean(localStorage.getItem("user")));
  }, []);

  const t = {
    en: {
      adminLogin: "Admin Login",
      adminSignup: "Admin Sign Up",
      clientLogin: "Client Login",
      clientSignup: "Client Sign Up",
      welcome: "Welcome to People's Choice Bank",
      heroTag: "Your trusted financial partner for modern banking solutions.",
      forClients: "For Clients",
      forAdmins: "For Admins",
      clientCard: "Deposits, withdrawals, and personal finances at your fingertips!",
      adminCard: "Manage branches, review transaction history, and oversee cash limits.",
      featuresTitle: "Everything you need in one WebApp!",
      cashDepositTitle: "Cash Deposit",
      cashDepositDesc: "Deposit money to your account instantly and track the balance update in real time.",
      cashWithdrawalTitle: "Cash Withdrawal",
      cashWithdrawalDesc: "Withdraw cash through any branch and get immediate confirmation of your transaction.",
      transactionHistoryTitle: "Transaction History",
      transactionHistoryDesc: "View deposit and withdrawal records with transaction type, amount, and date/timestamp.",
      branchLimitsTitle: "Branch Cash Limits",
      branchLimitsDesc: "Monitor branch limits (e.g., Branch 1: $100K, Branch 2: $50K). Exceeding limit prompts a recommendation to switch to another branch.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      applyNow: "Apply Now",
      bookMeeting: "Book a Meeting",
      branchLocator: "Branch Locator",
      products: "Products",
      mortgagesRates: "Mortgages and Other Rates",
      personalBanking: "Personal Banking",
      businessBanking: "Business Banking",
      savingsAccounts: "Savings Accounts",
      support: "Support",
      specialOffers: "Special Offers",
      helpCenter: "Help Center",
      security: "Security",
      legalPrivacy: "Legal & Privacy",
      corporate: "Corporate",
      meetWithUs: "Meet with Us",
      investorRelations: "Investor Relations",
      aboutBank: "About People's Choice Bank",
      canadaEnglish: "Canada English",
      copyright: "People's Choice Bank | Copyright © PCB All Rights Reserved 2026",
      themeToggle: theme === "light" ? "Dark mode" : "Light mode",
      languageLabel: "Language",
      toggleLabel: "Toggle Language",
    },
    fr: {
      adminLogin: "Connexion administrateur",
      adminSignup: "Inscription administrateur",
      clientLogin: "Connexion client",
      clientSignup: "Inscription client",
      welcome: "Bienvenue à la Banque People's Choice",
      heroTag: "Votre partenaire financier de confiance pour des solutions bancaires modernes.",
      forClients: "Pour les clients",
      forAdmins: "Pour les administrateurs",
      clientCard: "Dépôts, retraits et finances personnelles à portée de main !",
      adminCard: "Gérez les agences, consultez l'historique des transactions et superviser les limites de trésorerie.",
      featuresTitle: "Tout ce dont vous avez besoin dans une seule application Web !",
      cashDepositTitle: "Dépôt d'argent",
      cashDepositDesc: "Déposez de l'argent dans votre compte instantanément et suivez la mise à jour du solde en temps réel.",
      cashWithdrawalTitle: "Retrait d'argent",
      cashWithdrawalDesc: "Retirez de l'argent dans n'importe quelle agence et obtenez une confirmation immédiate de votre transaction.",
      transactionHistoryTitle: "Historique des transactions",
      transactionHistoryDesc: "Consultez les enregistrements de dépôts et de retraits avec le type de transaction, le montant et la date/l'heure.",
      branchLimitsTitle: "Limites de trésorerie des agences",
      branchLimitsDesc: "Surveillez les limites des agences (p. ex., agence 1 : 100 k$, agence 2 : 50 k$). En cas de dépassement, une recommandation de changement d'agence est proposée.",
      quickLinks: "Liens rapides",
      contactUs: "Contactez-nous",
      applyNow: "Postuler maintenant",
      bookMeeting: "Prendre un rendez-vous",
      branchLocator: "Localisateur d'agences",
      products: "Produits",
      mortgagesRates: "Hypothèques et autres taux",
      personalBanking: "Services bancaires personnels",
      businessBanking: "Services bancaires aux entreprises",
      savingsAccounts: "Comptes d'épargne",
      support: "Assistance",
      specialOffers: "Offres spéciales",
      helpCenter: "Centre d'aide",
      security: "Sécurité",
      legalPrivacy: "Mentions légales et confidentialité",
      corporate: "Entreprise",
      meetWithUs: "Rencontrez-nous",
      investorRelations: "Relations avec les investisseurs",
      aboutBank: "À propos de la Banque People's Choice",
      canadaEnglish: "Canada anglais",
      copyright: "Banque People's Choice | Droits d'auteur © PCB Tous droits réservés 2026",
      themeToggle: theme === "light" ? "Passer en mode sombre" : "Passer en mode clair",
      languageLabel: "Langue",
      toggleLabel: "Changer la langue",
    },
  } as const;

  const s = t[language];

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">
            <img src="/bank_logo.png" alt="People's Choice Bank Logo" />
          </div>
          <div>
            <h1>People's Choice Bank</h1>
            <small>Modern Digital Banking</small>
          </div>
        </div>
        <div className="pref-controls">
          <div className="lang-toggle" role="group" aria-label={s.toggleLabel}>
            <button
              className={`toggle-btn ${language === "en" ? "active" : ""}`}
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
            <button
              className={`toggle-btn ${language === "fr" ? "active" : ""}`}
              onClick={() => setLanguage("fr")}
              aria-pressed={language === "fr"}
            >
              FR
            </button>
          </div>
          <button className="toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {hasSession ? (
            <ProfileMenu />
          ) : (
            <nav className="nav-buttons">
              <button onClick={() => navigate("/admin/login")}>{s.adminLogin}</button>
              <button className="primary" onClick={() => navigate("/admin/signup")}>{s.adminSignup}</button>
              <button onClick={() => navigate("/login")}>{s.clientLogin}</button>
              <button className="primary" onClick={() => navigate("/signup")}>{s.clientSignup}</button>
            </nav>
          )}
        </div>
      </header>

      <main className="welcome-section">
        <section className="hero" role="region" aria-label="Welcome section">
          <div className="hero-content">
            <h2>{s.welcome}</h2>
            <p>{s.heroTag}</p>
            <div className="secondary-actions">
              <div className="user-type-card client">
                <h3>{s.forClients}</h3>
                <p>{s.clientCard}</p>
                {!hasSession && (
                  <div className="user-action-buttons">
                    <button onClick={() => navigate("/login")}>{s.clientLogin}</button>
                    <button className="secondary" onClick={() => navigate("/signup")}>{s.clientSignup}</button>
                  </div>
                )}
              </div>
              <div className="user-type-card admin">
                <h3>{s.forAdmins}</h3>
                <p>{s.adminCard}</p>
                {!hasSession && (
                  <div className="user-action-buttons">
                    <button onClick={() => navigate("/admin/login")}>{s.adminLogin}</button>
                    <button className="secondary" onClick={() => navigate("/admin/signup")}>{s.adminSignup}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img src="/homepage_1.png" alt="Banking Services" className="hero-image" />
          </div>
        </section>

        <section className="features" aria-label="Banking features">
          <h3>{s.featuresTitle}</h3>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-image">
                <img src="/homepage_2.png" alt="Cash Deposit" />
              </div>
              <div className="feature-text">
                <h4>{s.cashDepositTitle}</h4>
                <p>{s.cashDepositDesc}</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-image">
                <img src="/homepage_3.png" alt="Cash Withdrawal" />
              </div>
              <div className="feature-text">
                <h4>{s.cashWithdrawalTitle}</h4>
                <p>{s.cashWithdrawalDesc}</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-image">
                <img src="/homepage_4.png" alt="Transaction History" />
              </div>
              <div className="feature-text">
                <h4>{s.transactionHistoryTitle}</h4>
                <p>{s.transactionHistoryDesc}</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-image">
                <img src="/homepage_5.png" alt="Branch Cash Limits" />
              </div>
              <div className="feature-text">
                <h4>{s.branchLimitsTitle}</h4>
                <p>{s.branchLimitsDesc}</p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4>{s.quickLinks}</h4>
            <ul>
              <li>{s.contactUs}</li>
              <li>{s.applyNow}</li>
              <li>{s.bookMeeting}</li>
              <li>{s.branchLocator}</li>
            </ul>
          </div>
          <div>
            <h4>{s.products}</h4>
            <ul>
              <li>{s.mortgagesRates}</li>
              <li>{s.personalBanking}</li>
              <li>{s.businessBanking}</li>
              <li>{s.savingsAccounts}</li>
            </ul>
          </div>
          <div>
            <h4>{s.support}</h4>
            <ul>
              <li>{s.specialOffers}</li>
              <li>{s.helpCenter}</li>
              <li>{s.security}</li>
              <li>{s.legalPrivacy}</li>
            </ul>
          </div>
          <div>
            <h4>{s.corporate}</h4>
            <ul>
              <li>{s.meetWithUs}</li>
              <li>{s.investorRelations}</li>
              <li>{s.aboutBank}</li>
              <li>{s.canadaEnglish}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{s.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
