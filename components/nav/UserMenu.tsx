// components/nav/UserMenu.tsx
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator, // Optional: for visual separation
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react"; // Added Settings icon
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button

/**
 * UserMenu - User avatar with dropdown for profile, settings, and logout.
 * @returns {JSX.Element}
 */
export const UserMenu: React.FC = (): JSX.Element => {
  // Replace with real user data and handlers
  const user = {
    name: "Demo User",
    email: "user@example.com",
    avatar: undefined,
  }; // Added email for display

  // Placeholder actions
  const handleLogout = () => alert("Logout action");
  const handleProfile = () => alert("Profile action");
  const handleSettings = () => alert("Settings action");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-10 w-10 rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Open user menu"
        >
          <Avatar className="h-9 w-9 border border-border hover:opacity-80 transition-opacity">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1 shadow-lg">
        {" "}
        {/* Increased width, added margin-top */}
        {user.name && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        )}
        {user.name && <DropdownMenuSeparator />}
        <DropdownMenuItem
          onClick={handleProfile}
          className="cursor-pointer group"
        >
          <User className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-accent-foreground" />{" "}
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSettings}
          className="cursor-pointer group"
        >
          <Settings className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-accent-foreground" />{" "}
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer group text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2 text-destructive group-hover:text-destructive" />{" "}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
