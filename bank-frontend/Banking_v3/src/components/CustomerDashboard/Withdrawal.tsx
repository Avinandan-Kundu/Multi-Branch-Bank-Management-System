import React, { useState, useEffect } from "react";
import { withdrawFromAccount, getAllBranches } from "../../services/BankService";
import { Branch } from "../../types";
import { useAppPreferences } from "../../contexts/AppPreferencesContext";

/**
 * Withdrawal Component Props Interface
 *
 * Defines the props required by the Withdrawal component.
 */
interface WithdrawalProps {
  userId: string; // ID of the user making the withdrawal
  setUser: React.Dispatch<React.SetStateAction<any>>; // Function to update parent user state
  currencyCode: string;
  currencySymbol: string;
}

/**
 * Withdrawal Component
 *
 * Allows customers to withdraw money from their accounts. Handles form input,
 * validation, balance checking, and transaction processing.
 *
 * Features:
 * - Amount input with validation
 * - Balance verification before withdrawal
 * - Withdrawal transaction processing
 * - Success/error message display
 * - Automatic form clearing after successful withdrawal
 * - Real-time balance updates in parent component
 *
 * State management:
 * - amount: Withdrawal amount input (string to handle decimal input)
 * - error: Error message display
 * - success: Success message display
 *
 * Business logic:
 * - Withdrawals decrease both customer balance and branch cash reserves
 * - System checks for sufficient account balance
 * - Transactions are recorded with timestamps
 * - Form validates positive numeric input
 *
 * For backend integration:
 * - Add loading states during transaction processing
 * - Implement withdrawal limits and daily caps
 * - Add ATM/location selection for physical withdrawals
 * - Include transaction fees calculation
 * - Add support for different withdrawal methods
 * - Implement fraud detection checks
 * - Add transaction approval workflows for large amounts
 * - Include receipt generation and transaction IDs
 */
const Withdrawal: React.FC<WithdrawalProps> = ({ userId, setUser, currencyCode, currencySymbol }) => {
  const { language } = useAppPreferences();
  // Form input state
  const [amount, setAmount] = useState<string>("");

  // Branch selection state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // UI feedback state
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const t = {
    en: {
      title: "Withdrawal",
      selectBranch: "Select Branch",
      selectBranchPlaceholder: "Select a branch",
      amount: "Amount",
      submit: "Withdraw",
      invalidAmount: "Withdrawal amount must be positive.",
      success: "Withdrawal successful. New balance:",
      branchBalance: "Branch balance",
      genericError: "Something went wrong. Please try again.",
    },
    fr: {
      title: "Retrait",
      selectBranch: "Sélectionner l'agence",
      selectBranchPlaceholder: "Sélectionnez une agence",
      amount: "Montant",
      submit: "Retirer",
      invalidAmount: "Le montant du retrait doit être positif.",
      success: "Retrait réussi. Nouveau solde :",
      branchBalance: "Solde de l'agence",
      genericError: "Une erreur est survenue. Veuillez réessayer.",
    },
  } as const;
  const s = t[language];

  const getAlertType = (message: string): "warning" | "error" => {
    const warningPatterns = [
      s.invalidAmount,
      "does not have enough cash",
      "Please visit",
      "can process this amount",
    ];
    return warningPatterns.some((pattern) => message.includes(pattern)) ? "warning" : "error";
  };

  // Load branches on mount
  useEffect(() => {
    getAllBranches().then(setBranches);
  }, []);

  /**
   * Handle Withdrawal Form Submission
   *
   * Validates input, checks balance, processes the withdrawal transaction, and updates UI.
   *
   * @param e - Form submission event
   */
  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Parse and validate amount
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return setError(s.invalidAmount);
    }

    try {
      // Process withdrawal transaction
      const res = await withdrawFromAccount(userId, parsedAmount, selectedBranch || undefined);

      // Display success message with updated balances
      setSuccess(
        `${s.success} $${res.customer.balance}, ${s.branchBalance}: $${res.branch.balance}`
      );

      // Clear form and update parent state
      setAmount("");
      setUser(JSON.parse(localStorage.getItem("user") || 'null'));
    } catch (err: any) {
      // Display error message
      setError(err.message || s.genericError);
    }
  };

  return (
    <div className="customer-operation-panel">
      <h3>{s.title}</h3>
      <form onSubmit={handleWithdrawal} className="customer-form">
        <div className="customer-field">
          <label>{s.selectBranch}</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} required>
            <option value="">{s.selectBranchPlaceholder}</option>
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>{branch.location}</option>
            ))}
          </select>
        </div>
        <div className="customer-field">
          <label>{s.amount} ({currencySymbol})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${currencyCode} amount`}
            required
          />
        </div>

        {/* Transaction feedback strip */}
        {error && (
          <div className={`customer-alert customer-alert-${getAlertType(error)}`} role="alert" aria-live="polite">
            <span className="customer-alert-icon" aria-hidden="true">
              {getAlertType(error) === "warning" ? "⚠️" : "❌"}
            </span>
            <span className="customer-alert-text">{error}</span>
          </div>
        )}
        {success && (
          <div className="customer-alert customer-alert-success" role="status" aria-live="polite">
            <span className="customer-alert-icon" aria-hidden="true">✅</span>
            <span className="customer-alert-text">{success}</span>
          </div>
        )}
        <button className="customer-action-btn" type="submit">{s.submit}</button>
      </form>
    </div>
  );
};

export default Withdrawal;
