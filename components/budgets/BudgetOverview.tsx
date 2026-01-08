"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetOverviewProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger";
  delay?: number;
}

export const BudgetOverview = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  delay = 0,
}: BudgetOverviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "rounded-xl p-6 card-shadow border",
        variant === "default" && "bg-card border-border/50",
        variant === "success" && "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
        variant === "danger" && "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              "text-3xl font-display font-bold",
              variant === "default" && "text-foreground",
              variant === "success" && "text-success",
              variant === "danger" && "text-destructive"
            )}
          >
            {value}
          </p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            variant === "default" && "bg-accent",
            variant === "success" && "bg-success/20",
            variant === "danger" && "bg-destructive/20"
          )}
        >
          <Icon
            className={cn(
              "w-6 h-6",
              variant === "default" && "text-primary",
              variant === "success" && "text-success",
              variant === "danger" && "text-destructive"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

