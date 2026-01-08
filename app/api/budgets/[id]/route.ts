import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import {
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "@/lib/database";
import { z } from "zod";

const updateBudgetSchema = z.object({
  category: z.string().min(1, "Category is required").optional(),
  limit: z.number().positive("Limit must be positive").optional(),
  icon: z.string().min(1, "Icon is required").optional(),
  color: z.string().min(1, "Color is required").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const budget = await getBudgetById(session.user.id, id);
    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if budget exists and belongs to user
    const { id } = await params;
    const existingBudget = await getBudgetById(session.user.id, id);
    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateBudgetSchema.parse(body);

    const updates: Partial<{
      category: string;
      limit: number;
      icon: string;
      color: string;
    }> = {};

    if (validatedData.category !== undefined) {
      updates.category = validatedData.category;
    }
    if (validatedData.limit !== undefined) {
      updates.limit = validatedData.limit;
    }
    if (validatedData.icon !== undefined) {
      updates.icon = validatedData.icon;
    }
    if (validatedData.color !== undefined) {
      updates.color = validatedData.color;
    }

    const updatedBudget = await updateBudget(session.user.id, id, updates);
    if (!updatedBudget) {
      return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
    }

    return NextResponse.json(updatedBudget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if budget exists and belongs to user
    const { id } = await params;
    const existingBudget = await getBudgetById(session.user.id, id);
    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const deleted = await deleteBudget(session.user.id, id);
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

