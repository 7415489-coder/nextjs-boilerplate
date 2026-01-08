"use client";

import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { ForecastCard } from "@/components/dashboard/ForecastCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-1">
            Good morning, Alex 👋
          </h2>
          <p className="text-muted-foreground">
            Here's your financial overview for January 2025
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Balance"
            value="$24,562"
            change="+$1,245 from last month"
            changeType="positive"
            icon={Wallet}
            delay={0}
          />
          <MetricCard
            title="Monthly Income"
            value="$5,100"
            change="+8.2% vs last month"
            changeType="positive"
            icon={TrendingUp}
            delay={0.05}
          />
          <MetricCard
            title="Monthly Expenses"
            value="$3,120"
            change="-5.4% vs last month"
            changeType="positive"
            icon={TrendingDown}
            delay={0.1}
          />
          <MetricCard
            title="Savings Rate"
            value="38.8%"
            change="Above target (30%)"
            changeType="positive"
            icon={PiggyBank}
            delay={0.15}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div>
            <ForecastCard />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <AIInsights />
          </div>
          <div>
            <CategoryBreakdown />
          </div>
          <div>
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
}
