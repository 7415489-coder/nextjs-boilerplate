"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  notes?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Income: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Food & Dining": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Utilities: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  Health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const TransactionTable = ({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <motion.tr
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{transaction.name}</p>
                  {transaction.notes && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {transaction.notes}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={categoryColors[transaction.category] || "bg-gray-100 text-gray-800"}
                >
                  {transaction.category}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  transaction.type === "income" ? "text-green-600" : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : ""}$
                {Math.abs(transaction.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{transaction.name}"? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(transaction.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

