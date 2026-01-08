"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

const insights = [
  {
    id: 1,
    type: "prediction",
    icon: TrendingUp,
    title: "Savings potential detected",
    description:
      "Based on your spending patterns, you could save an additional $340/month by optimizing subscription services.",
    color: "text-income",
  },
  {
    id: 2,
    type: "warning",
    icon: AlertTriangle,
    title: "Unusual spending alert",
    description:
      "Your dining expenses are 45% higher than your 3-month average. Consider reviewing recent transactions.",
    color: "text-warning",
  },
  {
    id: 3,
    type: "tip",
    icon: Lightbulb,
    title: "Smart recommendation",
    description:
      "Moving $500 to your high-yield savings account could generate $42 more in annual interest.",
    color: "text-primary",
  },
];

export const AIInsights = () => {
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

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-background ${insight.color}`}>
                <insight.icon className="w-4 h-4" />
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
        ))}
      </div>
    </motion.div>
  );
};

