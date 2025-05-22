import React from "react";
import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { RecentPosts } from "@/components/dashboard/RecentPosts";

export const metadata = {
  title: "Dashboard | Portfolio Manager",
};

/**
 * Dashboard overview page.
 * @returns Dashboard JSX
 */
export default async function DashboardPage(): Promise<React.JSX.Element> {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentProjects />
        <RecentPosts />
      </div>
    </div>
  );
}
