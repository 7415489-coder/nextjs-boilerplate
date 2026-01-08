"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Coffee, Home, Car, Zap, Utensils, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import type { Transaction } from "@/components/transactions/TransactionTable";

const categoryIconMap: Record<string, typeof ShoppingBag> = {
  Shopping: ShoppingBag,
  "Food & Dining": Coffee,
  "Food & Drinks": Coffee,
  Housing: Home,
  Transportation: Car,
  Income: Zap,
  Utilities: Zap,
  Entertainment: Utensils,
};

const getCategoryIcon = (category: string) => {
  return categoryIconMap[category] || ShoppingBag;
};

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
}

export const TransactionList = ({ transactions, loading = false }: TransactionListProps) => {
  // Get the 6 most recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return formatDistanceToNow(date, { addSuffix: false });
    return format(date, "MMM d");
  };
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet
          </p>
        ) : (
          recentTransactions.map((transaction, index) => {
            const Icon = getCategoryIcon(transaction.category);
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    <Icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "font-semibold",
                    transaction.type === "income" ? "text-green-600" : "text-foreground"
                  )}
                >
                  {transaction.type === "income" ? "+" : ""}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

