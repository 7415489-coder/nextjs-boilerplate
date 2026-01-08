import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getBudgetsByUserId,
} from "@/lib/database";
import { z } from "zod";

const updateTransactionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  category: z.string().min(1, "Category is required").optional(),
  amount: z.number().positive("Amount must be positive").optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  type: z.enum(["income", "expense"]).optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transaction = await getTransactionById(session.user.id, params.id);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await getTransactionById(session.user.id, params.id);
    if (!existingTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateTransactionSchema.parse(body);

    // Income transactions always use "Income" category (not configurable)
    // Expense transactions must match a budget category
    const INCOME_CATEGORY = "Income";
    const transactionType = validatedData.type ?? existingTransaction.type;

    if (validatedData.category !== undefined) {
      if (transactionType === "income") {
        // Force income category for income transactions
        validatedData.category = INCOME_CATEGORY;
      } else {
        // Validate that expense category exists in user's budgets
        const budgets = await getBudgetsByUserId(session.user.id);
        const budgetCategories = budgets.map((b) => b.category);

        if (!budgetCategories.includes(validatedData.category)) {
          return NextResponse.json(
            { error: "Category must match an existing budget category" },
            { status: 400 }
          );
        }
      }
    }

    // If type is being changed to income, also update category
    if (validatedData.type === "income" && validatedData.category === undefined) {
      validatedData.category = INCOME_CATEGORY;
    }

    const updates: Partial<{
      name: string;
      category: string;
      amount: number;
      date: string;
      type: "income" | "expense";
      notes?: string;
    }> = {};

    if (validatedData.name !== undefined) {
      updates.name = validatedData.name.trim();
    }
    if (validatedData.category !== undefined) {
      updates.category = validatedData.category;
    }
    if (validatedData.amount !== undefined) {
      const type = validatedData.type ?? existingTransaction.type;
      updates.amount = type === "expense"
        ? -Math.abs(validatedData.amount)
        : Math.abs(validatedData.amount);
    }
    if (validatedData.date !== undefined) {
      updates.date = validatedData.date;
    }
    if (validatedData.type !== undefined) {
      updates.type = validatedData.type;
      // If type changes, update amount sign
      if (validatedData.amount === undefined) {
        updates.amount = validatedData.type === "expense"
          ? -Math.abs(existingTransaction.amount)
          : Math.abs(existingTransaction.amount);
      }
    }
    if (validatedData.notes !== undefined) {
      updates.notes = validatedData.notes?.trim();
    }

    const updatedTransaction = await updateTransaction(session.user.id, params.id, updates);
    if (!updatedTransaction) {
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await getTransactionById(session.user.id, params.id);
    if (!existingTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const deleted = await deleteTransaction(session.user.id, params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

