"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Transaction } from "./TransactionTable";

const transactionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.date({ required_error: "Date is required" }),
  type: z.enum(["income", "expense"]),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  budgetCategories: string[];
  initialData?: Transaction;
  isEditing?: boolean;
}

export const AddTransactionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  budgetCategories,
  initialData,
  isEditing = false,
}: AddTransactionDialogProps) => {

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      category: "",
      amount: 0,
      date: new Date(),
      type: "expense",
      notes: "",
    },
  });

  const transactionType = form.watch("type");
  const INCOME_CATEGORY = "Income";

  // Auto-set category to "Income" when type changes to income
  useEffect(() => {
    if (transactionType === "income") {
      const currentCategory = form.getValues("category");
      if (currentCategory !== INCOME_CATEGORY) {
        form.setValue("category", INCOME_CATEGORY);
      }
    }
  }, [transactionType, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        category: initialData.category,
        amount: Math.abs(initialData.amount),
        date: new Date(initialData.date),
        type: initialData.type,
        notes: initialData.notes || "",
      });
    } else {
      form.reset({
        name: "",
        category: "",
        amount: 0,
        date: new Date(),
        type: "expense",
        notes: "",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = (data: TransactionFormData) => {
    const transaction: Omit<Transaction, "id"> = {
      name: data.name.trim(),
      category: data.category,
      amount: data.type === "expense" ? -Math.abs(data.amount) : Math.abs(data.amount),
      date: format(data.date, "yyyy-MM-dd"),
      type: data.type,
      notes: data.notes?.trim(),
    };
    onSubmit(transaction);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the transaction details below."
              : "Enter the details for your new transaction."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === "expense" ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === "expense" && "bg-red-500 hover:bg-red-600"
                      )}
                      onClick={() => field.onChange("expense")}
                    >
                      Expense
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "income" ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === "income" && "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={() => field.onChange("income")}
                    >
                      Income
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grocery Shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const isIncome = transactionType === "income";
                
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={isIncome ? INCOME_CATEGORY : field.value} 
                      disabled={isIncome || (budgetCategories.length === 0 && !isIncome)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={
                              isIncome 
                                ? INCOME_CATEGORY 
                                : budgetCategories.length === 0 
                                  ? "No budgets available" 
                                  : "Select a category"
                            } 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isIncome ? (
                          <SelectItem value={INCOME_CATEGORY}>
                            {INCOME_CATEGORY}
                          </SelectItem>
                        ) : budgetCategories.length === 0 ? (
                          <SelectItem value="_none" disabled>
                            Create a budget first to add expense transactions
                          </SelectItem>
                        ) : (
                          budgetCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {isIncome ? (
                      <p className="text-sm text-muted-foreground">
                        Income transactions use the "Income" category automatically.
                      </p>
                    ) : budgetCategories.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You need to create a budget before adding expense transactions.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

