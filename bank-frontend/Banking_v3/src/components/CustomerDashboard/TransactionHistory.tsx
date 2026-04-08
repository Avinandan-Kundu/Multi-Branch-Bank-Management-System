import React from "react";
import { Transaction } from "../../types";
import { useAppPreferences } from "../../contexts/AppPreferencesContext";
import "./TransactionHistory.css";

/**
 * Transaction History Component Props Interface
 *
 * Defines the props required by the TransactionHistory component.
 */
interface TransactionHistoryProps {
  transactions: Transaction[]; // Array of user's transactions to display
  currencyCode: string;
  currencySymbol: string;
}

/**
 * Transaction History Component
 *
 * Displays a table of the user's banking transaction history.
 * Shows deposits and withdrawals with amounts, types, and timestamps.
 *
 * Features:
 * - Transaction table with sortable columns
 * - Formatted date display
 * - Empty state handling
 * - Responsive table design
 *
 * Data structure:
 * - # : Sequential transaction number
 * - Type : "deposit" or "withdrawal"
 * - Amount : Transaction amount with 2 decimal places
 * - Date : Localized date and time string
 *
 * For backend integration:
 * - Add pagination for large transaction lists
 * - Implement sorting by date, amount, or type
 * - Add filtering options (date range, transaction type)
 * - Include search functionality
 * - Add export to CSV/PDF options
 * - Implement infinite scroll or load more
 * - Add transaction details modal/expandable rows
 * - Include transaction status (pending, completed, failed)
 * - Add transaction categories or tags
 * - Implement transaction reversal/cancellation options
 */
const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, currencyCode, currencySymbol }) => {
  const { language } = useAppPreferences();
  const t = {
    en: {
      title: "Transaction History",
      empty: "No transactions completed yet.",
      type: "Type",
      amount: "Amount",
      date: "Date & Time",
      branch: "Branch",
      export: "Export",
      exportExcel: "Excel",
      exportCsv: "CSV",
      exportPdf: "PDF",
      deposit: "deposit",
      withdrawal: "withdrawal",
    },
    fr: {
      title: "Historique des transactions",
      empty: "Aucune transaction effectuée pour le moment.",
      type: "Type",
      amount: "Montant",
      date: "Date et heure",
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

  return (
    <div className="transaction-history">
      <div className="history-header-row">
        <h3>{s.title}</h3>
        <div className="history-export-wrap">
          <span>{s.export}</span>
          <button type="button" className="export-btn excel"><span className="export-icon">XLS</span>{s.exportExcel}</button>
          <button type="button" className="export-btn csv"><span className="export-icon">CSV</span>{s.exportCsv}</button>
          <button type="button" className="export-btn pdf"><span className="export-icon">PDF</span>{s.exportPdf}</button>
        </div>
      </div>

      {/* Empty state for users with no transactions */}
      {transactions.length === 0 ? (
        <p>{s.empty}</p>
      ) : (
        <table className="transaction-table">
          {/* Table header with column labels */}
          <thead>
            <tr>
              <th>{s.type}</th>
              <th>{s.date}</th>
              <th>{s.amount} ({currencySymbol})</th>
              <th>{s.branch}</th>
            </tr>
          </thead>

          {/* Table body with transaction data */}
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                {/* Transaction type (deposit/withdrawal) */}
                <td>{tx.type === "deposit" ? s.deposit : s.withdrawal}</td>

                {/* Localized date and time */}
                <td>
                  {tx.date
                    ? new Date(tx.date).toLocaleString(language === "fr" ? "fr-CA" : "en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    : "-"}
                </td>

                {/* Formatted amount with 2 decimal places */}
                <td>{tx.amount.toFixed(2)} {currencyCode}</td>

                {/* Branch name */}
                <td>{tx.branch || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;
