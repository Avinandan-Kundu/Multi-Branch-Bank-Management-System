import React from "react";
import { Branch } from "../../types";
import { resetBranchBalance } from "../../services/BankService";
import { useAppPreferences } from "../../contexts/AppPreferencesContext";

/**
 * Branch Management Component Props Interface
 *
 * Defines the props required by the BranchManagement component.
 */
interface BranchManagementProps {
  branches: Branch[]; // Array of all bank branches
  setBranches: (branches: Branch[]) => void; // Function to update branches state
}

/**
 * Branch Management Component
 *
 * Administrative interface for managing bank branch cash reserves.
 * Allows administrators to top up branches to their minimum cash requirements.
 *
 * Features:
 * - Branch selection dropdown
 * - Minimum cash top-up functionality
 * - Real-time branch list updates
 * - Success/error message display
 * - Automatic selection of first branch on load
 *
 * State management:
 * - selectedBranchId: Currently selected branch for reset operation
 * - message: Status message for user feedback
 *
 * Business logic:
 * - Top-up operation raises branch balance to cash_limit only when below minimum
 * - Updates local state to reflect changes immediately
 * - Provides user feedback on operation success/failure
 *
 * For backend integration:
 * - Add branch creation/editing capabilities
 * - Implement bulk reset operations
 * - Add branch performance analytics
 * - Include cash replenishment tracking
 * - Add branch status monitoring (open/closed)
 * - Implement automated low-cash alerts
 * - Add branch location management
 * - Include transaction volume reporting
 * - Add security features (audit logs, approval workflows)
 */
const BranchManagement: React.FC<BranchManagementProps> = ({ branches, setBranches }) => {
  const { language } = useAppPreferences();
  // Selected branch state for reset operations
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>("");

  // Status message state
  const [message, setMessage] = React.useState<string>("");
  const [messageType, setMessageType] = React.useState<"success" | "error" | "warning">("success");

  const t = {
    en: {
      title: "Branch Minimum Cash Top-Up",
      selectBranch: "Select Branch",
      button: "Top Up Branch to Minimum Cash",
      notFound: "Branch not found.",
      failed: "Failed to reset branch.",
      addedPrefix: "Added",
      addedMid: "to",
      addedSuffix: "to meet the minimum cash requirement of",
      meetsPrefix: "already meets the minimum cash requirement of",
    },
    fr: {
      title: "Approvisionnement minimal des agences",
      selectBranch: "Sélectionner l'agence",
      button: "Approvisionner l'agence au minimum requis",
      notFound: "Agence introuvable.",
      failed: "Échec de la mise à niveau de l'agence.",
      addedPrefix: "Ajout de",
      addedMid: "à",
      addedSuffix: "pour atteindre l'exigence minimale de liquidités de",
      meetsPrefix: "respecte déjà l'exigence minimale de liquidités de",
    },
  } as const;
  const s = t[language];

  /**
   * Initialize Default Branch Selection
   *
   * Automatically selects the first branch when branches data loads.
   */
  React.useEffect(() => {
    if (branches.length > 0) {
      setSelectedBranchId(branches[0]._id);
    }
  }, [branches]);

  /**
  * Handle Branch Minimum Cash Top-Up
   *
  * Processes the branch cash top-up operation and updates the UI.
   *
   * @param e - Form submission event
   */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("success");

    if (!selectedBranchId) return;

    try {
      // Top up branch balance via service
      const result = await resetBranchBalance(selectedBranchId);

      if (!result.branch) {
        setMessageType("error");
        setMessage(s.notFound);
        return;
      }
      const updatedBranch = result.branch;

      // Update local branches state
      const updated = branches.map((b) =>
        b._id === selectedBranchId ? updatedBranch : b
      );
      setBranches(updated);

      // Display success message
      if (result.toppedUpBy > 0) {
        setMessageType("success");
        setMessage(
          `${s.addedPrefix} $${result.toppedUpBy.toLocaleString()} ${s.addedMid} ${updatedBranch.location} ${s.addedSuffix} $${updatedBranch.cash_limit.toLocaleString()}.`
        );
      } else {
        setMessageType("warning");
        setMessage(
          `${updatedBranch.location} ${s.meetsPrefix} $${updatedBranch.cash_limit.toLocaleString()}.`
        );
      }
    } catch (err: any) {
      // Display error message
      setMessageType("error");
      setMessage(err.message || s.failed);
    }
  };

  return (
    <div className="admin-section">
      <h3 style={{ margin: "0 0 1.5rem 0" }}>{s.title}</h3>
      <form onSubmit={handleReset} className="customer-form">
        <div className="customer-field">
          <label htmlFor="branch-select">{s.selectBranch}</label>
          <select
            id="branch-select"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
          >
            {branches.length === 0 ? (
              <option value="">No branches available</option>
            ) : (
              branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.location}
                </option>
              ))
            )}
          </select>
        </div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
          <button type="submit" className="customer-action-btn">
            {s.button}
          </button>
        </div>
      </form>
      {message && (
        <div className={`admin-alert admin-alert-${messageType}`} role="status" aria-live="polite">
          <span className="admin-alert-icon" aria-hidden="true">
            {messageType === "success" ? "✅" : messageType === "warning" ? "⚠️" : "❌"}
          </span>
          <span className="admin-alert-text">{message}</span>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
