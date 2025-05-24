"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { ProjectDashboard } from "@/types";

const ProjectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  </svg>
);

const BlogPostIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
      clipRule="evenodd"
    />
    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
  </svg>
);

const PageViewsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

const VisitorsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
  </svg>
);

export function DashboardStats() {
  const [projectCount, setProjectCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjectStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        let projectsArray: ProjectDashboard[] = [];
        if (Array.isArray(data)) {
          projectsArray = data;
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as any).projects)
        ) {
          projectsArray = (data as any).projects;
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as any).data)
        ) {
          projectsArray = (data as any).data;
        }
        setProjectCount(projectsArray.length);
      } catch (error) {
        console.error("Error fetching project stats:", error);
        setProjectCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectStats();
  }, []);

  const stats = [
    {
      name: "Projects",
      value: loading ? "-" : projectCount.toString(),
      change: "",
      changeType: "increase",
      icon: <ProjectIcon />,
    },
    {
      name: "Blog Posts",
      value: "0",
      change: "",
      changeType: "increase",
      icon: <BlogPostIcon />,
    },
    {
      name: "Page Views",
      value: "0",
      change: "",
      changeType: "increase",
      icon: <PageViewsIcon />,
    },
    {
      name: "Visitors",
      value: "0",
      change: "",
      changeType: "increase",
      icon: <VisitorsIcon />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.name}
          className="p-6 flex flex-col space-y-2 overflow-hidden relative"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{stat.name}</span>
            <span className="p-1.5 rounded-full bg-primary/10 text-primary">
              {stat.icon}
            </span>
          </div>
          <div className="text-3xl font-bold">{stat.value}</div>
          {stat.change && (
            <div className="flex items-center text-sm">
              <span
                className={
                  stat.changeType === "increase"
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }
              >
                {stat.change}{" "}
                {stat.changeType === "increase" ? (
                  <span className="inline-block">↑</span>
                ) : (
                  <span className="inline-block">↓</span>
                )}
              </span>
              <span className="ml-1 text-muted-foreground">
                since last month
              </span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
