"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Coffee, Home, Car, Zap, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    name: "Grocery Store",
    category: "Shopping",
    amount: -89.5,
    date: "Today",
    icon: ShoppingBag,
  },
  {
    id: 2,
    name: "Salary Deposit",
    category: "Income",
    amount: 4500.0,
    date: "Yesterday",
    icon: Zap,
  },
  {
    id: 3,
    name: "Coffee Shop",
    category: "Food & Drinks",
    amount: -12.4,
    date: "Yesterday",
    icon: Coffee,
  },
  {
    id: 4,
    name: "Rent Payment",
    category: "Housing",
    amount: -1200.0,
    date: "Jan 1",
    icon: Home,
  },
  {
    id: 5,
    name: "Gas Station",
    category: "Transportation",
    amount: -45.0,
    date: "Jan 1",
    icon: Car,
  },
  {
    id: 6,
    name: "Restaurant",
    category: "Food & Drinks",
    amount: -67.8,
    date: "Dec 31",
    icon: Utensils,
  },
];

export const TransactionList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-xl p-6 card-shadow border border-border/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Recent Transactions
          </h3>
          <p className="text-sm text-muted-foreground">Your latest activity</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <transaction.icon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
            </div>
            <p
              className={cn(
                "font-semibold",
                transaction.amount > 0 ? "text-income" : "text-foreground"
              )}
            >
              {transaction.amount > 0 ? "+" : ""}
              ${Math.abs(transaction.amount).toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

