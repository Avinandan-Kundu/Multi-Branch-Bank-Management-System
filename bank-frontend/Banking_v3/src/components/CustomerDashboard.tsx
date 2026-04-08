import React, { useState, useEffect } from "react";
import Deposit from "./CustomerDashboard/Deposit";
import Withdrawal from "./CustomerDashboard/Withdrawal";
import TransactionHistory from "./CustomerDashboard/TransactionHistory";
import AuthFooter from "./AuthFooter";

import { User } from "../types";
import { logoutUser } from "../services/BankService";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import "./CustomerDashboard.css";

/**
 * Customer Dashboard Component
 *
 * Main interface for bank customers to manage their accounts. Provides
 * access to deposit, withdrawal, and transaction history features.
 *
 * Features:
 * - User welcome header with balance display
 * - Tabbed navigation between different banking operations
 * - Conditional rendering based on active tab
 * - Automatic redirect to login if no user session
 * - Logout functionality
 *
 * State management:
 * - user: Current authenticated user object
 * - activeTab: Currently selected tab ("deposit", "withdrawal", "history")
 *
 * Component structure:
 * - Header: User greeting and balance
 * - Navigation: Tab buttons
 * - Content: Dynamic content based on selected tab
 *
 * Child components:
 * - Deposit: Handles money deposits
 * - Withdrawal: Handles money withdrawals
 * - TransactionHistory: Displays user's transaction history
 *
 * For backend integration:
 * - Add real-time balance updates (WebSocket/SSE)
 * - Implement pagination for transaction history
 * - Add account summary widgets (recent transactions, alerts)
 * - Include profile management section
 * - Add multi-account support
 * - Implement transaction search/filtering
 * - Add export functionality for statements
 * - Include notifications for important account events
 */
const CustomerDashboard: React.FC = () => {
  const { language } = useAppPreferences();
  // User state - stores current authenticated user
  const [user, setUser] = useState<User | null>(null);

  // UI state - controls which tab/content is displayed
  const [activeTab, setActiveTab] = useState("deposit");
  const [currency, setCurrency] = useState("CAD");

  // Navigation hook for redirects
  const navigate = useNavigate();

  const t = {
    en: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      welcomeBack: "Welcome back!",
      balance: "Account Balance",
      chooseCurrency: "Display currency",
      logout: "Logout",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      history: "Transaction History",
    },
    fr: {
      morning: "Bonjour",
      afternoon: "Bon après-midi",
      evening: "Bonsoir",
      welcomeBack: "Bon retour !",
      balance: "Solde",
      chooseCurrency: "Devise d'affichage",
      logout: "Se déconnecter",
      deposit: "Dépôt",
      withdrawal: "Retrait",
      history: "Historique des transactions",
    },
  } as const;
  const s = t[language];

  /**
   * Load User Session on Mount
   *
   * Checks for existing user session in localStorage and loads user data.
   * Redirects to login if no valid session exists.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      // No valid session - redirect to login
      navigate("/login");
    }
  }, [navigate]);

  /**
   * Handle User Logout
   *
   * Clears user session and redirects to login page.
   */
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const currencyMeta: Record<string, { symbol: string }> = {
    CAD: { symbol: "CAD $" },
    USD: { symbol: "USD $" },
    AUD: { symbol: "AUD $" },
    EUR: { symbol: "EUR €" },
    GBP: { symbol: "GBP £" },
    JPY: { symbol: "JPY ¥" },
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? s.morning : currentHour < 18 ? s.afternoon : s.evening;
  const selectedCurrencyLabel = `${s.balance} (${currency})`;
  const selectedCurrencySymbol = currencyMeta[currency]?.symbol || "CAD $";

  return (
    <div className="dashboard-container customer-page">
      {/* User header - only shown when user is loaded */}
      {user && (
        <>
          <div className="dashboard-greeting-row">
            <h2>{greeting}, {user.name}. {s.welcomeBack}</h2>
            <button className="customer-logout-btn" onClick={handleLogout}>{s.logout}</button>
          </div>
          <header className="dashboard-header">
            <div className="dashboard-balance-row">
              <p>{selectedCurrencyLabel}: ${user.balance.toFixed(2)}</p>
              <div className="dashboard-header-actions">
                <label htmlFor="currency-select">{s.chooseCurrency}</label>
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="AUD">AUD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>
          </header>
        </>
      )}

      {/* Navigation tabs */}
      <div className="dashboard-nav">
        <button onClick={() => setActiveTab("deposit")}>{s.deposit}</button>
        <button onClick={() => setActiveTab("withdrawal")}>{s.withdrawal}</button>
        <button onClick={() => setActiveTab("history")}>{s.history}</button>
      </div>

      {/* Dynamic content based on active tab */}
      <div className="dashboard-content">
        {/* Deposit tab - pass userId and setUser for state updates */}
        {activeTab === "deposit" && <Deposit userId={user?._id!} setUser={setUser} currencyCode={currency} currencySymbol={selectedCurrencySymbol} />}

        {/* Withdrawal tab - pass userId and setUser for state updates */}
        {activeTab === "withdrawal" && <Withdrawal userId={user?._id!} setUser={setUser} currencyCode={currency} currencySymbol={selectedCurrencySymbol} />}

        {/* Transaction history tab - pass user's transactions */}
        {activeTab === "history" && <TransactionHistory transactions={user?.transactions || []} currencyCode={currency} currencySymbol={selectedCurrencySymbol} />}
      </div>
      <AuthFooter />
      </div>
  );
};

export default CustomerDashboard;
