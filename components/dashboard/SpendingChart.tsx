"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", income: 4200, expenses: 3100, forecast: null },
  { month: "Feb", income: 4500, expenses: 2900, forecast: null },
  { month: "Mar", income: 4300, expenses: 3200, forecast: null },
  { month: "Apr", income: 4800, expenses: 3400, forecast: null },
  { month: "May", income: 4600, expenses: 3000, forecast: null },
  { month: "Jun", income: 5100, expenses: 3300, forecast: null },
  { month: "Jul", income: null, expenses: null, forecast: 5400 },
  { month: "Aug", income: null, expenses: null, forecast: 5600 },
  { month: "Sep", income: null, expenses: null, forecast: 5800 },
];

export const SpendingChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-xl p-6 card-shadow border border-border/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Income vs Expenses
          </h3>
          <p className="text-sm text-muted-foreground">
            Monthly overview with AI forecast
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-income" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-expense" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-forecast" />
            <span className="text-muted-foreground">Forecast</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number | null) => (value ? [`$${value.toLocaleString()}`, ""] : [])}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(152, 69%, 40%)"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#forecastGradient)"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

