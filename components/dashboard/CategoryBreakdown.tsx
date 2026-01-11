"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import type { Transaction } from "@/components/transactions/TransactionTable";

const categoryColors: Record<string, string> = {
  Housing: "hsl(168, 76%, 36%)",
  "Food & Dining": "hsl(199, 89%, 48%)",
  Transportation: "hsl(221, 83%, 53%)",
  Shopping: "hsl(280, 65%, 60%)",
  Entertainment: "hsl(38, 92%, 50%)",
  Utilities: "hsl(152, 69%, 40%)",
  Health: "hsl(0, 72%, 51%)",
  Healthcare: "hsl(0, 72%, 51%)",
  Subscriptions: "hsl(270, 70%, 55%)",
  Income: "hsl(152, 69%, 40%)",
  Other: "hsl(220, 13%, 45%)",
};

interface CategoryBreakdownProps {
  transactions: Transaction[];
  loading?: boolean;
}

export const CategoryBreakdown = ({ transactions, loading = false }: CategoryBreakdownProps) => {
  // Calculate category breakdown from transactions (only expenses)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const categoryTotals = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === "expense" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    })
    .reduce((acc, t) => {
      const category = t.category;
      const amount = Math.abs(t.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors.Other,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Show top 6 categories

  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-card rounded-xl p-6 card-shadow border border-border/50"
    >
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Spending by Category
        </h3>
        <p className="text-sm text-muted-foreground">This month's breakdown</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : total === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No expenses this month</p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="h-[180px] w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    ${item.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((item.value / total) * 100)}%)
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

