"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Zap,
  HeartPulse,
  Repeat,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  icon: string;
  color: string;
}

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  utensils: Utensils,
  car: Car,
  "shopping-bag": ShoppingBag,
  "gamepad-2": Gamepad2,
  zap: Zap,
  "heart-pulse": HeartPulse,
  repeat: Repeat,
};

interface BudgetCardProps {
  budget: Budget;
  delay?: number;
  onUpdate: (id: string, limit: number) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard = ({ budget, delay = 0, onUpdate, onDelete }: BudgetCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(budget.limit.toString());

  const Icon = iconMap[budget.icon] || ShoppingBag;
  const percentage = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
  const isOverBudget = budget.spent > budget.limit;
  const remaining = budget.limit - budget.spent;

  const handleSave = () => {
    const limit = parseFloat(newLimit);
    if (!isNaN(limit) && limit > 0) {
      onUpdate(budget.id, limit);
      setEditOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-card rounded-xl p-5 card-shadow border border-border/50 hover:card-shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: `${budget.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: budget.color }} />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{budget.category}</h4>
              <p className="text-xs text-muted-foreground">
                ${budget.spent.toLocaleString()} of ${budget.limit.toLocaleString()}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all duration-200">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit limit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(budget.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Progress
              value={percentage}
              className={cn(
                "h-3 rounded-full",
                isOverBudget && "[&>div]:bg-destructive"
              )}
              style={
                !isOverBudget
                  ? { ["--progress-color" as string]: budget.color }
                  : undefined
              }
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span
              className={cn(
                "font-semibold",
                isOverBudget ? "text-destructive" : "text-foreground"
              )}
            >
              {percentage}%
            </span>
            <span
              className={cn(
                "text-sm",
                isOverBudget ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {isOverBudget
                ? `$${Math.abs(remaining).toLocaleString()} over`
                : `$${remaining.toLocaleString()} left`}
            </span>
          </div>
        </div>
      </motion.div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Limit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="limit">Monthly limit for {budget.category}</Label>
            <Input
              id="limit"
              type="number"
              min="1"
              step="10"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

