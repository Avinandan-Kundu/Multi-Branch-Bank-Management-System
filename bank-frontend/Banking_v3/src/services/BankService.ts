import axios from "axios";
import { User, Branch, Transaction } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

const mapBranch = (branch: any): Branch => ({
  _id: String(branch._id),
  location: branch.location || branch.branchName || "Unknown",
  cash_limit: Number(branch.cashLimit ?? branch.cash_limit ?? 0),
  balance: Number(branch.cashReserve ?? branch.balance ?? 0),
});

const mapTransaction = (transaction: any): Transaction => ({
  type: transaction.transactionType,
  amount: Number(transaction.amount),
  date: transaction.createdAt || transaction.date,
  branch:
    typeof transaction.branchId === "object"
      ? transaction.branchId?.location || "-"
      : transaction.branch || "-",
});

const withUserTransactions = async (user: User): Promise<User> => {
  try {
    const response = await api.get(`/transactions/user/${user._id}`);
    const transactions = (response.data || []).map(mapTransaction);
    return { ...user, transactions };
  } catch {
    return { ...user, transactions: [] };
  }
};

const resolveBranchForTransaction = async (branchId?: string): Promise<string> => {
  if (branchId) {
    return branchId;
  }

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser) as User;
    if (parsedUser.branchId) {
      return parsedUser.branchId;
    }
  }

  const branches = await getAllBranches();
  if (!branches.length) {
    throw new Error("No branches available");
  }

  return branches[0]._id;
};

export const loginUser = async (email: string, pass: string): Promise<User> => {
  try {
    const response = await api.post("/auth/login", { email, pass });
    const rawUser = response.data;

    const user: User = {
      _id: String(rawUser._id),
      name: rawUser.name,
      email: rawUser.email,
      pass: rawUser.pass,
      balance: Number(rawUser.balance || 0),
      branchId: rawUser.branchId ? String(rawUser.branchId) : "",
      role: rawUser.role || "customer",
      transactions: [],
    };

    const enrichedUser = await withUserTransactions(user);
    localStorage.setItem("user", JSON.stringify(enrichedUser));
    return enrichedUser;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Invalid credentials");
  }
};

export const signupUser = async (userData: {
  name: string;
  email: string;
  pass: string;
  balance: number;
  branchId?: string;
  role?: "customer" | "admin";
  employeeId?: string;
  accessLevel?: string;
}): Promise<User> => {
  try {
    const response = await api.post("/auth/signup", userData);
    const rawUser = response.data;

    const user: User = {
      _id: String(rawUser._id),
      name: rawUser.name,
      email: rawUser.email,
      pass: rawUser.pass,
      balance: Number(rawUser.balance || 0),
      branchId: rawUser.branchId ? String(rawUser.branchId) : "",
      role: rawUser.role || "customer",
      transactions: [],
    };

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Signup failed");
  }
};

const refreshCurrentUser = async (userId: string): Promise<User | null> => {
  const current = localStorage.getItem("user");
  if (!current) {
    return null;
  }

  const parsed = JSON.parse(current) as User;
  if (parsed._id !== userId) {
    return parsed;
  }

  const updated = await withUserTransactions(parsed);
  localStorage.setItem("user", JSON.stringify(updated));
  return updated;
};

export const depositToAccount = async (customerId: string, amount: number, branchId?: string) => {
  try {
    const resolvedBranchId = await resolveBranchForTransaction(branchId);
    const response = await api.post("/transactions/deposit", {
      customerId,
      amount,
      branchId: resolvedBranchId,
    });

    const refreshedUser = await refreshCurrentUser(customerId);
    if (refreshedUser) {
      refreshedUser.balance = response.data.customer.balance;
      localStorage.setItem("user", JSON.stringify(refreshedUser));
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Deposit failed");
  }
};

export const withdrawFromAccount = async (customerId: string, amount: number, branchId?: string) => {
  try {
    const resolvedBranchId = await resolveBranchForTransaction(branchId);
    const response = await api.post("/transactions/withdrawal", {
      customerId,
      amount,
      branchId: resolvedBranchId,
    });

    const refreshedUser = await refreshCurrentUser(customerId);
    if (refreshedUser) {
      refreshedUser.balance = response.data.customer.balance;
      localStorage.setItem("user", JSON.stringify(refreshedUser));
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Withdrawal failed");
  }
};

export const getAllBranches = async (): Promise<Branch[]> => {
  const response = await api.get("/branches");
  return (response.data || []).map(mapBranch);
};

export const getLowCashBranches = async (): Promise<Branch[]> => {
  const branches = await getAllBranches();
  return branches.filter((branch) => branch.balance < branch.cash_limit);
};

export const resetBranchBalance = async (branchId: string) => {
  try {
    const response = await api.patch(`/branches/${branchId}/reset`);
    return {
      branch: mapBranch(response.data.branch),
      toppedUpBy: Number(response.data.toppedUpBy || 0),
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to reset branch");
  }
};

export const updateCurrentUserProfile = async (
  userId: string,
  updates: { email?: string; pass?: string }
): Promise<User> => {
  try {
    const response = await api.patch(`/auth/users/${userId}`, updates);
    const current = JSON.parse(localStorage.getItem("user") || "null") as User | null;
    const updated: User = {
      _id: String(response.data._id),
      name: response.data.name,
      email: response.data.email,
      pass: response.data.pass,
      balance: Number(response.data.balance || 0),
      branchId: response.data.branchId ? String(response.data.branchId) : "",
      role: response.data.role || "customer",
      transactions: current?.transactions || [],
    };

    localStorage.setItem("user", JSON.stringify(updated));
    return updated;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update user profile");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("/transactions");
  return (response.data || []).map(mapTransaction);
};
