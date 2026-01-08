"use client";

import { motion } from "framer-motion";
import { Bell, Settings, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Transactions", path: "/transactions" },
  { name: "Budgets", path: "/budgets" },
  { name: "Reports", path: "/reports" },
  { name: "Goals", path: "/goals" },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 bg-card border-b border-border"
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="p-2 rounded-xl ai-gradient">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            FinanceAI
          </h1>
          <p className="text-xs text-muted-foreground">
            Smart money management
          </p>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
              pathname === item.path
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center ml-2">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </motion.header>
  );
};

