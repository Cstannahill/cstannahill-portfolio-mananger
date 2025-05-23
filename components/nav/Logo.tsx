// components/nav/Logo.tsx
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // Ensure this path is correct

/**
 * Logo - Brand logo for the navigation bar.
 * @returns {JSX.Element}
 */
export const Logo: React.FC = (): JSX.Element => (
  <Link
    href="/"
    className={cn(
      "flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-1 py-1" // Adjusted padding and focus
    )}
    tabIndex={0}
    aria-label="Portfolio homepage"
  >
    <Avatar className="w-9 h-9">
      {" "}
      {/* Slightly larger avatar */}
      <AvatarImage
        src="/ctan-dev.png" // Make sure this path is correct in your public folder
        alt="Brand Logo"
        className="rounded-full"
      />
      <AvatarFallback className="bg-primary text-primary-foreground text-base font-semibold">
        P {/* Ensure this is a good fallback, e.g., initials */}
      </AvatarFallback>
    </Avatar>
    <span className="hidden sm:inline text-xl tracking-tight">Portfolio</span>{" "}
    {/* Slightly larger text */}
  </Link>
);
