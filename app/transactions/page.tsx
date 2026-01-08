"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { TransactionTable, type Transaction } from "@/components/transactions/TransactionTable";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialTransactions: Transaction[] = [
  { id: "1", name: "Salary", category: "Income", amount: 5000, date: "2024-01-15", type: "income" },
  { id: "2", name: "Grocery Shopping", category: "Food & Dining", amount: -156.32, date: "2024-01-14", type: "expense" },
  { id: "3", name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "2024-01-13", type: "expense" },
  { id: "4", name: "Gas Station", category: "Transportation", amount: -45.00, date: "2024-01-12", type: "expense" },
  { id: "5", name: "Freelance Project", category: "Income", amount: 1200, date: "2024-01-11", type: "income" },
  { id: "6", name: "Electric Bill", category: "Utilities", amount: -89.50, date: "2024-01-10", type: "expense" },
  { id: "7", name: "Restaurant Dinner", category: "Food & Dining", amount: -67.80, date: "2024-01-09", type: "expense" },
  { id: "8", name: "Online Shopping", category: "Shopping", amount: -234.99, date: "2024-01-08", type: "expense" },
  { id: "9", name: "Investment Return", category: "Income", amount: 350, date: "2024-01-07", type: "income" },
  { id: "10", name: "Gym Membership", category: "Health", amount: -49.99, date: "2024-01-06", type: "expense" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return Math.abs(b.amount) - Math.abs(a.amount);
        case "amount-asc":
          return Math.abs(a.amount) - Math.abs(b.amount);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setIsAddDialogOpen(false);
  };

  const handleEditTransaction = (transaction: Omit<Transaction, "id">) => {
    if (!editingTransaction) return;
    setTransactions(
      transactions.map((t) =>
        t.id === editingTransaction.id ? { ...transaction, id: t.id } : t
      )
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage your income and expenses
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  +${totalIncome.toLocaleString()}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-500">
                  -${totalExpenses.toLocaleString()}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-500"}`}>
                  ${(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-primary/10" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="amount-desc">Amount (High)</SelectItem>
                    <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showFilters && (
              <TransactionFilters
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
              />
            )}
          </div>

          {/* Transactions Table */}
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">No transactions found</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddTransaction}
        categories={categories}
      />

      {/* Edit Transaction Dialog */}
      <AddTransactionDialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSubmit={handleEditTransaction}
        categories={categories}
        initialData={editingTransaction || undefined}
        isEditing
      />
    </div>
  );
}

