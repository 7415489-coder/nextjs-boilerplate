"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Budget } from "./BudgetCard";

const categoryOptions = [
  { name: "Housing", icon: "home", color: "hsl(168, 76%, 36%)" },
  { name: "Food & Dining", icon: "utensils", color: "hsl(199, 89%, 48%)" },
  { name: "Transportation", icon: "car", color: "hsl(221, 83%, 53%)" },
  { name: "Shopping", icon: "shopping-bag", color: "hsl(280, 65%, 60%)" },
  { name: "Entertainment", icon: "gamepad-2", color: "hsl(38, 92%, 50%)" },
  { name: "Utilities", icon: "zap", color: "hsl(152, 69%, 40%)" },
  { name: "Healthcare", icon: "heart-pulse", color: "hsl(0, 72%, 51%)" },
  { name: "Subscriptions", icon: "repeat", color: "hsl(270, 70%, 55%)" },
];

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (budget: Omit<Budget, "id" | "spent">) => void;
  existingCategories: string[];
}

export const AddBudgetDialog = ({
  open,
  onOpenChange,
  onAdd,
  existingCategories,
}: AddBudgetDialogProps) => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const { toast } = useToast();

  const availableCategories = categoryOptions.filter(
    (c) => !existingCategories.includes(c.name)
  );

  const handleAdd = () => {
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your budget.",
        variant: "destructive",
      });
      return;
    }

    const limitValue = parseFloat(limit);
    if (isNaN(limitValue) || limitValue <= 0) {
      toast({
        title: "Invalid limit",
        description: "Please enter a valid budget limit greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const selected = categoryOptions.find((c) => c.name === category);
    if (selected) {
      onAdd({
        category: selected.name,
        limit: limitValue,
        icon: selected.icon,
        color: selected.color,
      });
      setCategory("");
      setLimit("");
      onOpenChange(false);
      toast({
        title: "Budget added",
        description: `${selected.name} budget of $${limitValue.toLocaleString()} has been created.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Budget</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    All categories have budgets
                  </SelectItem>
                ) : (
                  availableCategories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit ($)</Label>
            <Input
              id="limit"
              type="number"
              min="1"
              step="10"
              placeholder="e.g., 500"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={availableCategories.length === 0}>
            Add Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

