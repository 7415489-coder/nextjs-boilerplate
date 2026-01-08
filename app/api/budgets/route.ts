import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import {
  getBudgetsByUserId,
  createBudget,
  type Budget,
} from "@/lib/database";
import { z } from "zod";

const createBudgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limit: z.number().positive("Limit must be positive"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgets = await getBudgetsByUserId(session.user.id);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
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
    const validatedData = createBudgetSchema.parse(body);

    // Prevent creating budgets for "Income" category
    const INCOME_CATEGORY = "Income";
    if (validatedData.category === INCOME_CATEGORY) {
      return NextResponse.json(
        { error: "Cannot create a budget for the Income category" },
        { status: 400 }
      );
    }

    const budget = await createBudget(session.user.id, {
      category: validatedData.category,
      limit: validatedData.limit,
      icon: validatedData.icon,
      color: validatedData.color,
    });

    // Return with calculated spent
    const budgets = await getBudgetsByUserId(session.user.id);
    const createdBudget = budgets.find((b) => b.id === budget.id);
    
    return NextResponse.json(createdBudget || budget, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

