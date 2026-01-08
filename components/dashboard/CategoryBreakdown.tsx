"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Housing", value: 1200, color: "hsl(168, 76%, 36%)" },
  { name: "Food & Dining", value: 650, color: "hsl(199, 89%, 48%)" },
  { name: "Transportation", value: 380, color: "hsl(221, 83%, 53%)" },
  { name: "Shopping", value: 420, color: "hsl(280, 65%, 60%)" },
  { name: "Entertainment", value: 280, color: "hsl(38, 92%, 50%)" },
  { name: "Utilities", value: 190, color: "hsl(152, 69%, 40%)" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export const CategoryBreakdown = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-card rounded-xl p-6 card-shadow border border-border/50"
    >
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Spending by Category
        </h3>
        <p className="text-sm text-muted-foreground">This month's breakdown</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  ${item.value.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

