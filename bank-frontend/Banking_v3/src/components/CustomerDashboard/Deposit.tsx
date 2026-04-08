import React, { useEffect, useState } from "react";
import { depositToAccount, getAllBranches } from "../../services/BankService";
import { Branch } from "../../types";
import { useAppPreferences } from "../../contexts/AppPreferencesContext";

/**
 * Deposit Component Props Interface
 *
 * Defines the props required by the Deposit component.
 */
interface DepositProps {
  userId: string; // ID of the user making the deposit
  setUser: React.Dispatch<React.SetStateAction<any>>; // Function to update parent user state
  currencyCode: string;
  currencySymbol: string;
}

/**
 * Deposit Component
 *
 * Allows customers to deposit money into their accounts. Handles form input,
 * validation, and transaction processing with real-time balance updates.
 *
 * Features:
 * - Amount input with validation
 * - Deposit transaction processing
 * - Success/error message display
 * - Automatic form clearing after successful deposit
 * - Real-time balance updates in parent component
 *
 * State management:
 * - amount: Deposit amount input (string to handle decimal input)
 * - error: Error message display
 * - success: Success message display
 *
 * Business logic:
 * - Deposits increase both customer balance and branch cash reserves
 * - Transactions are recorded with timestamps
 * - Form validates positive numeric input
 *
 * For backend integration:
 * - Add loading states during transaction processing
 * - Implement transaction confirmation dialogs
 * - Add receipt generation/printing
 * - Include transaction limits and daily caps
 * - Add support for different deposit methods (cash, check, transfer)
 * - Implement transaction fees if applicable
 * - Add audit trail and transaction IDs
 */
const Deposit: React.FC<DepositProps> = ({ userId, setUser, currencyCode, currencySymbol }) => {
  const { language } = useAppPreferences();
  // Form input state
  const [amount, setAmount] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // UI feedback state
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const t = {
    en: {
      title: "Deposit",
      selectBranch: "Select Branch",
      selectBranchPlaceholder: "Select a branch",
      amount: "Amount",
      submit: "Deposit",
      invalidAmount: "Deposit amount must be a positive number.",
      success: "Deposit successful. New balance:",
      branchBalance: "Branch balance",
      genericError: "Something went wrong. Please try again.",
    },
    fr: {
      title: "Dépôt",
      selectBranch: "Sélectionner l'agence",
      selectBranchPlaceholder: "Sélectionnez une agence",
      amount: "Montant",
      submit: "Déposer",
      invalidAmount: "Le montant du dépôt doit être un nombre positif.",
      success: "Dépôt réussi. Nouveau solde :",
      branchBalance: "Solde de l'agence",
      genericError: "Une erreur est survenue. Veuillez réessayer.",
    },
  } as const;
  const s = t[language];

  const getAlertType = (message: string): "warning" | "error" => {
    if (message === s.invalidAmount) {
      return "warning";
    }
    return "error";
  };

  useEffect(() => {
    getAllBranches().then(setBranches).catch(() => {
      setError(s.genericError);
    });
  }, [s.genericError]);

  /**
   * Handle Deposit Form Submission
   *
   * Validates input, processes the deposit transaction, and updates UI.
   *
   * @param e - Form submission event
   */
  const handleDeposit = async (e: React.FormEvent) => {
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
      // Process deposit transaction
      const res = await depositToAccount(userId, parsedAmount, selectedBranch || undefined);

      // Display success message with updated balances
      setSuccess(
        `${s.success} $${res.customer.balance}, ${s.branchBalance}: $${res.branch.balance}`
      );

      // Clear form and update parent state
      setAmount("");
      setSelectedBranch("");
      setUser(JSON.parse(localStorage.getItem("user") || 'null'));
    } catch (err: any) {
      // Display error message
      setError(err.message || s.genericError);
    }
  };

  return (
    <div className="customer-operation-panel">
      <h3>{s.title}</h3>
      <form onSubmit={handleDeposit} className="customer-form">
        <div className="customer-field">
          <label>{s.selectBranch}</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} required>
            <option value="">{s.selectBranchPlaceholder}</option>
            {branches.map((branch) => (
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

export default Deposit;
