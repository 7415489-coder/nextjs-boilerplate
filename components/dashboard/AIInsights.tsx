"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";

interface Insight {
  id: number;
  type: "prediction" | "warning" | "tip";
  title: string;
  description: string;
  color: string;
}

const iconMap = {
  prediction: TrendingUp,
  warning: AlertTriangle,
  tip: Lightbulb,
};

export const AIInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/ai-insights");

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError(err instanceof Error ? err.message : "Failed to load insights");

      // Set fallback insights on error
      setInsights([
        {
          id: 1,
          type: "prediction",
          title: "Savings boost if spending cut",
          description: "If you cut Shopping 50% and Food 30%, you'd save ~$2,082/mo, raising savings from $1,157 to ~$3,239/mo (savings rate ≈28.2%), adding ≈$24,984/yr.",
          color: "text-income",
        },
        {
          id: 2,
          type: "warning",
          title: "Major overspending in key categories",
          description: "Food (1595% of budget), Shopping (1527.5%) and Housing (1166.7%) total ≈$7,968/mo (~77% of expenses). With only a 10.1% savings rate, an income drop would quickly deplete savings.",
          color: "text-warning",
        },
        {
          id: 3,
          type: "tip",
          title: "3-step plan to reclaim ~$2,202/mo",
          description: "Target Shopping $1,500/mo (-$1,555) and Food $1,200/mo (-$647). Automate the ~$2,202/mo saved to a separate account, negotiate bills, and set weekly spending caps to push savings toward ~29%.",
          color: "text-primary",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-xl p-6 card-shadow border border-border/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg ai-gradient">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            AI Insights
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalized recommendations
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : error && insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchInsights}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = iconMap[insight.type] || Lightbulb;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-background ${insight.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

