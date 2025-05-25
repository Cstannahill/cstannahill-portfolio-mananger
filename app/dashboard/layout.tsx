import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Sidebar as NavigationSidebar } from "@/components/dashboard/Sidebar";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This ensures that only authenticated users can access dashboard pages
  const session = await requireAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Left column for Navigation and Chat. Hidden on md and below, shown on larger screens */}
      <div className="hidden md:flex flex-col w-72 border-r border-border/50 bg-card shadow-md">
        <NavigationSidebar /> {/* Takes its natural height based on content */}
        {/* ChatSidebar will take the remaining vertical space, with a top border for separation */}
        <ChatSidebar className="flex-1 border-t border-border/40" />{" "}
        {/* flex-1 to grow, adjusted border */}
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
