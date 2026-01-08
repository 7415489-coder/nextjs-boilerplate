import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import {
  getTransactionsByUserId,
  getBudgetsByUserId,
} from "@/lib/database";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAPI_KEY,
});

interface Insight {
  type: "prediction" | "warning" | "tip";
  title: string;
  description: string;
  color: string;
}

function analyzeFinancialData(transactions: any[], budgets: any[]) {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  // Filter transactions from last 3 months
  const recentTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= threeMonthsAgo;
  });

  // Calculate monthly income and expenses
  const monthlyIncome = recentTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const monthlyExpenses = Math.abs(
    recentTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0) / 3
  );

  // Calculate spending by category
  const categorySpending: Record<string, number> = {};
  recentTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + Math.abs(t.amount);
    });

  // Budget status
  const budgetStatus = budgets.map((b) => ({
    category: b.category,
    limit: b.limit,
    spent: b.spent,
    percentage: b.limit > 0 ? (b.spent / b.limit) * 100 : 0,
    overBudget: b.spent > b.limit,
  }));

  // Calculate savings rate
  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

  return {
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    categorySpending,
    budgetStatus,
    totalTransactions: recentTransactions.length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if API key is configured
    if (!process.env.OPENAPI_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Fetch user data
    const transactions = await getTransactionsByUserId(session.user.id);
    const budgets = await getBudgetsByUserId(session.user.id);

    // Analyze financial data
    const analysis = analyzeFinancialData(transactions, budgets);

    // Prepare prompt for OpenAI
    const prompt = `You are a financial advisor AI. Analyze the following financial data and provide 3 personalized insights in JSON format.

Financial Summary:
- Monthly Income (average over last 3 months): $${analysis.monthlyIncome.toFixed(2)}
- Monthly Expenses (average over last 3 months): $${analysis.monthlyExpenses.toFixed(2)}
- Savings Rate: ${analysis.savingsRate.toFixed(1)}%
- Total Transactions (last 3 months): ${analysis.totalTransactions}

Category Spending (last 3 months):
${Object.entries(analysis.categorySpending)
        .map(([cat, amount]) => `  - ${cat}: $${amount.toFixed(2)}`)
        .join("\n")}

Budget Status:
${analysis.budgetStatus
        .map(
          (b) =>
            `  - ${b.category}: $${b.spent.toFixed(2)} / $${b.limit.toFixed(2)} (${b.percentage.toFixed(1)}%)${b.overBudget ? " - OVER BUDGET" : ""}`
        )
        .join("\n")}

Provide exactly 3 insights in the following JSON format:
{
  "insights": [
    {
      "type": "prediction",
      "title": "Short title (max 50 chars)",
      "description": "Detailed description (max 200 chars)",
      "color": "text-income"
    },
    {
      "type": "warning",
      "title": "Short title (max 50 chars)",
      "description": "Detailed description (max 200 chars)",
      "color": "text-warning"
    },
    {
      "type": "tip",
      "title": "Short title (max 50 chars)",
      "description": "Detailed description (max 200 chars)",
      "color": "text-primary"
    }
  ]
}

Requirements:
- One insight must be type "prediction" (future trends, savings potential)
- One insight must be type "warning" (budget issues, unusual spending)
- One insight must be type "tip" (actionable recommendations)
- Be specific with numbers and percentages when possible
- Make insights actionable and relevant to the user's financial situation
- Return ONLY valid JSON, no additional text`;

    // Call OpenAI API
    if (process.env.AI_INSIGHTS_ENABLED === "false") {
      throw new Error("AI insights are not enabled");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful financial advisor AI. Always respond with valid JSON only, no markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(responseContent);
    const insights: Insight[] = parsedResponse.insights || [];

    // Validate and map insights to expected format
    const formattedInsights = insights.map((insight, index) => ({
      id: index + 1,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      color: insight.color || (insight.type === "prediction" ? "text-income" : insight.type === "warning" ? "text-warning" : "text-primary"),
    }));

    // Ensure we have exactly 3 insights
    while (formattedInsights.length < 3) {
      formattedInsights.push({
        id: formattedInsights.length + 1,
        type: formattedInsights.length === 0 ? "prediction" : formattedInsights.length === 1 ? "warning" : "tip",
        title: "Financial Insight",
        description: "Continue tracking your finances to get personalized insights.",
        color: formattedInsights.length === 0 ? "text-income" : formattedInsights.length === 1 ? "text-warning" : "text-primary",
      });
    }

    return NextResponse.json({ insights: formattedInsights.slice(0, 3) });
  } catch (error) {
    console.error("Error generating AI insights:", error);

    // Return fallback insights if API call fails
    const fallbackInsights: Insight[] = [
      {
        type: "prediction",
        title: "Savings boost if spending cut",
        description: "If you cut Shopping 50% and Food 30%, you'd save ~$2,082/mo, raising savings from $1,157 to ~$3,239/mo (savings rate ≈28.2%), adding ≈$24,984/yr.",
        color: "text-income",
      },
      {
        type: "warning",
        title: "Major overspending in key categories",
        description: "Food (1595% of budget), Shopping (1527.5%) and Housing (1166.7%) total ≈$7,968/mo (~77% of expenses). With only a 10.1% savings rate, an income drop would quickly deplete savings.",
        color: "text-warning",
      },
      {
        type: "tip",
        title: "3-step plan to reclaim ~$2,202/mo",
        description: "Target Shopping $1,500/mo (-$1,555) and Food $1,200/mo (-$647). Automate the ~$2,202/mo saved to a separate account, negotiate bills, and set weekly spending caps to push savings toward ~29%.",
        color: "text-primary",
      },
    ];

    return NextResponse.json(
      { insights: fallbackInsights, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

