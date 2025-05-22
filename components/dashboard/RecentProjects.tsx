"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentProjects() {
  // In a real app, these would be fetched from your API
  const projects = [
    {
      id: "1",
      name: "E-commerce Website",
      description:
        "A fully responsive e-commerce platform built with React and Node.js",
      status: "Completed",
      slug: "ecommerce-website",
    },
    {
      id: "2",
      name: "Portfolio Website",
      description: "Personal portfolio showcasing my projects and skills",
      status: "In Progress",
      slug: "portfolio-website",
    },
    {
      id: "3",
      name: "Mobile App",
      description: "React Native app for tracking daily activities",
      status: "Planning",
      slug: "mobile-app",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Planning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-border/50">
        <h2 className="text-lg font-semibold">Recent Projects</h2>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border/50">
        {projects.map((project) => (
          <div key={project.id} className="p-6">
            <div className="flex justify-between items-start mb-2">
              <Link
                href={`/dashboard/projects/${project.slug}`}
                className="text-base font-medium hover:underline"
              >
                {project.name}
              </Link>
              <Badge
                className={getStatusColor(project.status)}
                variant="outline"
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {project.description}
            </p>
            <div className="flex justify-end">
              <Link href={`/dashboard/projects/${project.slug}/edit`}>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
              </Link>
              <Link href={`/projects/${project.slug}`} target="_blank">
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
