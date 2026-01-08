import { promises as fs } from "fs";
import path from "path";

export interface Transaction {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number; // negative for expenses, positive for income
  date: string; // ISO date string
  type: "income" | "expense";
  notes?: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number; // calculated from transactions
  icon: string;
  color: string;
}

// File storage paths
const DATA_DIR = path.join(process.cwd(), "data");
const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json");
const BUDGETS_FILE = path.join(DATA_DIR, "budgets.json");

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
    throw error;
  }
}

// Read transactions from file
async function readTransactions(): Promise<Transaction[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TRANSACTIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array
      return [];
    }
    console.error("Error reading transactions:", error);
    throw error;
  }
}

// Write transactions to file
async function writeTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(
      TRANSACTIONS_FILE,
      JSON.stringify(transactions, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing transactions:", error);
    throw error;
  }
}

// Read budgets from file
async function readBudgets(): Promise<Budget[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BUDGETS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array
      return [];
    }
    console.error("Error reading budgets:", error);
    throw error;
  }
}

// Write budgets to file
async function writeBudgets(budgets: Budget[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(
      BUDGETS_FILE,
      JSON.stringify(budgets, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing budgets:", error);
    throw error;
  }
}

// Transaction functions
export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  const allTransactions = await readTransactions();
  return allTransactions.filter((t) => t.userId === userId);
}

export async function createTransaction(
  userId: string,
  transaction: Omit<Transaction, "id" | "userId">
): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    userId,
  };

  const allTransactions = await readTransactions();
  allTransactions.push(newTransaction);
  await writeTransactions(allTransactions);

  return newTransaction;
}

export async function updateTransaction(
  userId: string,
  id: string,
  updates: Partial<Omit<Transaction, "id" | "userId">>
): Promise<Transaction | null> {
  const allTransactions = await readTransactions();
  const userTransactions = allTransactions.filter((t) => t.userId === userId);
  const index = userTransactions.findIndex((t) => t.id === id);

  if (index === -1) {
    return null;
  }

  // Find the index in the full array
  const fullIndex = allTransactions.findIndex(
    (t) => t.userId === userId && t.id === id
  );

  allTransactions[fullIndex] = {
    ...allTransactions[fullIndex],
    ...updates,
  };
  await writeTransactions(allTransactions);

  return allTransactions[fullIndex];
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  const allTransactions = await readTransactions();
  const index = allTransactions.findIndex(
    (t) => t.userId === userId && t.id === id
  );

  if (index === -1) {
    return false;
  }

  allTransactions.splice(index, 1);
  await writeTransactions(allTransactions);

  return true;
}

export async function getTransactionById(
  userId: string,
  id: string
): Promise<Transaction | null> {
  const allTransactions = await readTransactions();
  return (
    allTransactions.find((t) => t.userId === userId && t.id === id) || null
  );
}

// Budget functions
export async function getBudgetsByUserId(userId: string): Promise<Budget[]> {
  const allBudgets = await readBudgets();
  const budgets = allBudgets.filter((b) => b.userId === userId);
  // Calculate spent for each budget from transactions
  const transactions = await getTransactionsByUserId(userId);
  return budgets.map((budget) => ({
    ...budget,
    spent: calculateBudgetSpentFromTransactions(transactions, budget.category),
  }));
}

export async function createBudget(
  userId: string,
  budget: Omit<Budget, "id" | "userId" | "spent">
): Promise<Budget> {
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    userId,
    spent: 0, // Will be calculated when fetched
  };

  const allBudgets = await readBudgets();
  allBudgets.push(newBudget);
  await writeBudgets(allBudgets);

  return newBudget;
}

export async function updateBudget(
  userId: string,
  id: string,
  updates: Partial<Omit<Budget, "id" | "userId" | "spent">>
): Promise<Budget | null> {
  const allBudgets = await readBudgets();
  const index = allBudgets.findIndex(
    (b) => b.userId === userId && b.id === id
  );

  if (index === -1) {
    return null;
  }

  allBudgets[index] = {
    ...allBudgets[index],
    ...updates,
  };
  await writeBudgets(allBudgets);

  // Return with calculated spent
  const transactions = await getTransactionsByUserId(userId);
  return {
    ...allBudgets[index],
    spent: calculateBudgetSpentFromTransactions(
      transactions,
      allBudgets[index].category
    ),
  };
}

export async function deleteBudget(userId: string, id: string): Promise<boolean> {
  const allBudgets = await readBudgets();
  const index = allBudgets.findIndex(
    (b) => b.userId === userId && b.id === id
  );

  if (index === -1) {
    return false;
  }

  allBudgets.splice(index, 1);
  await writeBudgets(allBudgets);

  return true;
}

export async function getBudgetById(userId: string, id: string): Promise<Budget | null> {
  const allBudgets = await readBudgets();
  const budget = allBudgets.find((b) => b.userId === userId && b.id === id);
  if (!budget) {
    return null;
  }

  // Return with calculated spent
  const transactions = await getTransactionsByUserId(userId);
  return {
    ...budget,
    spent: calculateBudgetSpentFromTransactions(transactions, budget.category),
  };
}

// Calculate spent amount for a budget category from transactions
export function calculateBudgetSpent(userId: string, category: string): Promise<number> {
  return getTransactionsByUserId(userId).then((transactions) => {
    return calculateBudgetSpentFromTransactions(transactions, category);
  });
}

// Helper function to calculate spent from transaction array
function calculateBudgetSpentFromTransactions(
  transactions: Transaction[],
  category: string
): number {
  // Get current month's date range (from 1st of current month to today)
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const categoryTransactions = transactions.filter((t) => {
    if (t.category !== category || t.type !== "expense") {
      return false;
    }

    // Filter by current month's date range
    const transactionDate = new Date(t.date);
    return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
  });

  return Math.abs(
    categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
  );
}

