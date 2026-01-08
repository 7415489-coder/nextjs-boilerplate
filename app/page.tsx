"use client";

import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import type { Transaction } from "@/components/transactions/TransactionTable";

export default function Home() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "there";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from transactions
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === "income" && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = Math.abs(
    transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === "expense" && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const savingsRate = monthlyIncome > 0 
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
    : 0;

  // Get previous month for comparison
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === "income" && 
             date.getMonth() === previousMonth && 
             date.getFullYear() === previousYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const previousMonthExpenses = Math.abs(
    transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === "expense" && 
               date.getMonth() === previousMonth && 
               date.getFullYear() === previousYear;
      })
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const incomeChange = previousMonthIncome > 0
    ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100
    : 0;

  const expensesChange = previousMonthExpenses > 0
    ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-1">
            Good morning, {userName} 👋
          </h2>
          <p className="text-muted-foreground">
            Here's your financial overview for January 2025
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Balance"
            value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change={totalBalance >= 0 ? "Positive balance" : "Negative balance"}
            changeType={totalBalance >= 0 ? "positive" : "negative"}
            icon={Wallet}
            delay={0}
          />
          <MetricCard
            title="Monthly Income"
            value={`$${monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change={incomeChange >= 0 ? `+${incomeChange.toFixed(1)}% vs last month` : `${incomeChange.toFixed(1)}% vs last month`}
            changeType={incomeChange >= 0 ? "positive" : "negative"}
            icon={TrendingUp}
            delay={0.05}
          />
          <MetricCard
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change={expensesChange <= 0 ? `${expensesChange.toFixed(1)}% vs last month` : `+${expensesChange.toFixed(1)}% vs last month`}
            changeType={expensesChange <= 0 ? "positive" : "negative"}
            icon={TrendingDown}
            delay={0.1}
          />
          <MetricCard
            title="Savings Rate"
            value={`${savingsRate.toFixed(1)}%`}
            change={savingsRate >= 30 ? "Above target (30%)" : savingsRate >= 0 ? "Below target (30%)" : "Negative savings"}
            changeType={savingsRate >= 30 ? "positive" : savingsRate >= 0 ? "default" : "negative"}
            icon={PiggyBank}
            delay={0.15}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <SpendingChart transactions={transactions} loading={loading} />
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <AIInsights />
          </div>
          <div>
            <CategoryBreakdown transactions={transactions} loading={loading} />
          </div>
          <div>
            <TransactionList transactions={transactions} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
