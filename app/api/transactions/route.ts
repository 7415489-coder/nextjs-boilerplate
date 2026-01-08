import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import {
  getTransactionsByUserId,
  createTransaction,
  getBudgetsByUserId,
} from "@/lib/database";
import { z } from "zod";

const createTransactionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  type: z.enum(["income", "expense"]),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await getTransactionsByUserId(session.user.id);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTransactionSchema.parse(body);

    // Income transactions always use "Income" category (not configurable)
    // Expense transactions must match a budget category
    const INCOME_CATEGORY = "Income";
    if (validatedData.type === "income") {
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

    const transaction = await createTransaction(session.user.id, {
      name: validatedData.name.trim(),
      category: validatedData.category,
      amount: validatedData.type === "expense"
        ? -Math.abs(validatedData.amount)
        : Math.abs(validatedData.amount),
      date: validatedData.date,
      type: validatedData.type,
      notes: validatedData.notes?.trim(),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

