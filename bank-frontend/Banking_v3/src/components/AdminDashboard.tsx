import React, { useState, useEffect } from "react";
import BranchManagement from "./AdminDashboard/BranchManagement";
import AuthFooter from "./AuthFooter";
import { getAllBranches as getBranches, getAllTransactions, logoutUser } from "../services/BankService";
import { Transaction, Branch, User } from "../types";
import { useNavigate } from "react-router-dom";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import "./AdminDashboard.css";

/**
 * Admin Dashboard Component
 *
 * Administrative interface for bank managers and administrators.
 * Provides oversight of branches, transactions, and system management tools.
 *
 * Features:
 * - Role-based access control (admin only)
 * - Branch management interface
 * - Transaction monitoring (currently simulated)
 * - Automatic redirect for unauthorized access
 *
 * State management:
 * - branches: Array of all bank branches
 * - transactions: Array of recent transactions (currently mock data)
 *
 * Component structure:
 * - Access control check
 * - Transaction overview table
 * - Branch management section
 *
 * For backend integration:
 * - Replace mock transaction data with real API calls
 * - Add comprehensive transaction filtering/search
 * - Implement real-time transaction monitoring
 * - Add user management (view/edit customer accounts)
 * - Include system health monitoring
 * - Add audit logs and security events
 * - Implement bulk operations for branches
 * - Add reporting and analytics dashboards
 * - Include notification system for alerts
 */
const AdminDashboard: React.FC = () => {
  const { language } = useAppPreferences();
  // Branch data state
  const [branches, setBranches] = useState<Branch[]>([]);

  // Transaction data state (currently mock)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState("CAD");
  const [user, setUser] = useState<User | null>(null);

  // Navigation hook
  const navigate = useNavigate();

  const t = {
    en: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      welcomeBack: "Welcome back!",
      accountBalance: "Account Balance",
      chooseCurrency: "Display currency",
      logout: "Logout",
      title: "Admin Dashboard",
      branchInfo: "Branch Information",
      noBranches: "No branches available.",
      location: "Location",
      minCash: "Minimum Cash Requirement ($)",
      currentBalance: "Current Balance ($)",
      allTransactions: "All Transactions",
      noTransactions: "No transactions available.",
      date: "Date",
      type: "Type",
      amount: "Amount ($)",
      branch: "Branch",
      export: "Export",
      exportExcel: "Excel",
      exportCsv: "CSV",
      exportPdf: "PDF",
      deposit: "deposit",
      withdrawal: "withdrawal",
    },
    fr: {
      morning: "Bonjour",
      afternoon: "Bon après-midi",
      evening: "Bonsoir",
      welcomeBack: "Bon retour !",
      accountBalance: "Solde du compte",
      chooseCurrency: "Devise d'affichage",
      logout: "Se déconnecter",
      title: "Tableau de bord administrateur",
      branchInfo: "Informations des agences",
      noBranches: "Aucune agence disponible.",
      location: "Emplacement",
      minCash: "Exigence minimale de liquidités ($)",
      currentBalance: "Solde actuel ($)",
      allTransactions: "Toutes les transactions",
      noTransactions: "Aucune transaction disponible.",
      date: "Date",
      type: "Type",
      amount: "Montant ($)",
      branch: "Agence",
      export: "Exporter",
      exportExcel: "Excel",
      exportCsv: "CSV",
      exportPdf: "PDF",
      deposit: "dépôt",
      withdrawal: "retrait",
    },
  } as const;
  const s = t[language];

  /**
   * Initialize Admin Dashboard
   *
   * Performs access control check and loads initial data.
   * Redirects non-admin users to login.
   */
  useEffect(() => {
    // Access control: Verify admin role
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        navigate("/login");
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate("/login");
    }

    // Load branch data
    getBranches().then(setBranches).catch(console.error);

    // Load transaction data
    getAllTransactions().then(setTransactions).catch(console.error);
  }, [navigate]);

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
  const selectedCurrencySymbol = currencyMeta[currency]?.symbol || "CAD $";

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  return (
    <div className="admin-page dashboard-container">
      {user && (
        <>
          <div className="dashboard-greeting-row">
            <h2>{greeting}, {user.name}. {s.welcomeBack}</h2>
            <button className="customer-logout-btn" onClick={handleLogout}>{s.logout}</button>
          </div>
          <header className="dashboard-header">
            <div className="dashboard-balance-row">
              <p>{s.accountBalance} ({currency}): ${user.balance.toFixed(2)}</p>
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

      {/* Branch Overview Section */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3>{s.branchInfo}</h3>
          <div className="history-export-wrap">
            <span>{s.export}</span>
            <button type="button" className="export-btn excel"><span className="export-icon">XLS</span>{s.exportExcel}</button>
            <button type="button" className="export-btn csv"><span className="export-icon">CSV</span>{s.exportCsv}</button>
            <button type="button" className="export-btn pdf"><span className="export-icon">PDF</span>{s.exportPdf}</button>
          </div>
        </div>
        {branches.length === 0 ? (
          <p style={{ padding: "1rem" }}>{s.noBranches}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{s.location}</th>
                <th>{s.minCash}</th>
                <th>{s.currentBalance}</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch._id}>
                  <td>{branch.location}</td>
                  <td>${branch.cash_limit.toLocaleString()}</td>
                  <td>${branch.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <BranchManagement branches={branches} setBranches={setBranches} />

      {/* Transaction Overview Section */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3>{s.allTransactions}</h3>
          <div className="history-export-wrap">
            <span>{s.export}</span>
            <button type="button" className="export-btn excel"><span className="export-icon">XLS</span>{s.exportExcel}</button>
            <button type="button" className="export-btn csv"><span className="export-icon">CSV</span>{s.exportCsv}</button>
            <button type="button" className="export-btn pdf"><span className="export-icon">PDF</span>{s.exportPdf}</button>
          </div>
        </div>
        {transactions.length === 0 ? (
          <p style={{ padding: "1rem" }}>{s.noTransactions}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{s.date}</th>
                <th>{s.type}</th>
                <th>{s.amount} ({selectedCurrencySymbol})</th>
                <th>{s.branch}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={index}>
                  <td>{t.date ? new Date(t.date).toLocaleString(language === "fr" ? "fr-CA" : "en-CA", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : "-"}</td>
                  <td>{t.type === "deposit" ? s.deposit : s.withdrawal}</td>
                  <td>{t.amount.toFixed(2)}</td>
                  <td>{t.branch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AuthFooter />
    </div>
  );
};

export default AdminDashboard;
