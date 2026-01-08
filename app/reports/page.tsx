"use client";

import { Header } from "@/components/dashboard/Header";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-card rounded-xl border border-border p-12 max-w-md">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Reports
            </h2>
            <p className="text-muted-foreground">
              This feature is not yet implemented.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

