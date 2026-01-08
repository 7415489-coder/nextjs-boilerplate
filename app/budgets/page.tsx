"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, PiggyBank, TrendingUp, Loader2 } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { BudgetCard, type Budget } from "@/components/budgets/BudgetCard";
import { BudgetOverview } from "@/components/budgets/BudgetOverview";
import { AddBudgetDialog } from "@/components/budgets/AddBudgetDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch budgets on mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/budgets");
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast({
        title: "Error",
        description: "Failed to load budgets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.limit).length;

  const handleAddBudget = async (newBudget: Omit<Budget, "id" | "spent">) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newBudget.category,
          limit: newBudget.limit,
          icon: newBudget.icon,
          color: newBudget.color,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create budget");
      }

      const createdBudget = await response.json();
      setBudgets([...budgets, createdBudget]);
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Budget added successfully",
      });
    } catch (error) {
      console.error("Error creating budget:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBudget = async (id: string, limit: number) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update budget");
      }

      const updatedBudget = await response.json();
      setBudgets(budgets.map((b) => (b.id === id ? updatedBudget : b)));
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete budget");
      }

      setBudgets(budgets.filter((b) => b.id !== id));
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete budget",
        variant: "destructive",
      });
    }
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
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
                subtitle={totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% of budget used` : "No budgets set"}
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

            {budgets.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground mb-4">No budgets set yet</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first budget
                </Button>
              </div>
            ) : (
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
            )}
          </>
        )}

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

