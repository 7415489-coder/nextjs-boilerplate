"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, PiggyBank, TrendingUp } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { BudgetCard, type Budget } from "@/components/budgets/BudgetCard";
import { BudgetOverview } from "@/components/budgets/BudgetOverview";
import { AddBudgetDialog } from "@/components/budgets/AddBudgetDialog";
import { Button } from "@/components/ui/button";

const initialBudgets: Budget[] = [
  { id: "1", category: "Housing", limit: 1500, spent: 1200, icon: "home", color: "hsl(168, 76%, 36%)" },
  { id: "2", category: "Food & Dining", limit: 600, spent: 520, icon: "utensils", color: "hsl(199, 89%, 48%)" },
  { id: "3", category: "Transportation", limit: 400, spent: 280, icon: "car", color: "hsl(221, 83%, 53%)" },
  { id: "4", category: "Shopping", limit: 300, spent: 420, icon: "shopping-bag", color: "hsl(280, 65%, 60%)" },
  { id: "5", category: "Entertainment", limit: 200, spent: 145, icon: "gamepad-2", color: "hsl(38, 92%, 50%)" },
  { id: "6", category: "Utilities", limit: 250, spent: 190, icon: "zap", color: "hsl(152, 69%, 40%)" },
  { id: "7", category: "Healthcare", limit: 150, spent: 80, icon: "heart-pulse", color: "hsl(0, 72%, 51%)" },
  { id: "8", category: "Subscriptions", limit: 100, spent: 89, icon: "repeat", color: "hsl(270, 70%, 55%)" },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.limit).length;

  const handleAddBudget = (newBudget: Omit<Budget, "id" | "spent">) => {
    setBudgets((prev) => [
      ...prev,
      { ...newBudget, id: Date.now().toString(), spent: 0 },
    ]);
  };

  const handleUpdateBudget = (id: string, limit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, limit } : b))
    );
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">
              Budget Management
            </h2>
            <p className="text-muted-foreground">
              Set spending limits and track your progress
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Budget
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <BudgetOverview
            title="Total Budget"
            value={`$${totalBudget.toLocaleString()}`}
            subtitle="Monthly allocation"
            icon={PiggyBank}
            delay={0}
          />
          <BudgetOverview
            title="Total Spent"
            value={`$${totalSpent.toLocaleString()}`}
            subtitle={`${Math.round((totalSpent / totalBudget) * 100)}% of budget used`}
            icon={TrendingUp}
            variant={totalSpent > totalBudget ? "danger" : "default"}
            delay={0.05}
          />
          <BudgetOverview
            title="Remaining"
            value={`$${(totalBudget - totalSpent).toLocaleString()}`}
            subtitle={overBudgetCount > 0 ? `${overBudgetCount} categories over budget` : "All categories on track"}
            icon={PiggyBank}
            variant={totalBudget - totalSpent < 0 ? "danger" : "success"}
            delay={0.1}
          />
        </div>

        {/* Budget Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-6"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">
            Category Budgets
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {budgets.map((budget, index) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              delay={0.2 + index * 0.05}
              onUpdate={handleUpdateBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>

        <AddBudgetDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAdd={handleAddBudget}
          existingCategories={budgets.map((b) => b.category)}
        />
      </main>
    </div>
  );
}

