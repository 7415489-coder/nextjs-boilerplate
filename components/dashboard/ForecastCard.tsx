"use client";

import { motion } from "framer-motion";
import { Brain, ArrowUpRight, Calendar } from "lucide-react";

export const ForecastCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-gradient-to-br from-primary via-primary to-forecast rounded-xl p-6 card-shadow text-primary-foreground relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-white/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold">AI Forecast</h3>
            <p className="text-sm opacity-80">Next 3 months prediction</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Projected Savings</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold">$2,840</span>
              <div className="flex items-center text-sm bg-white/20 rounded-full px-2 py-0.5">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>+12%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Calendar className="w-4 h-4" />
              <span>Confidence: 87% • Updated today</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

