// components/nav/SiteNavBar.tsx
"use client"; // Keep this if any child components use client-side hooks like useState/useEffect

import React from "react";
import { Logo } from "@/components/nav/Logo";
import { NavLinks } from "@/components/nav/NavLinks";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { UserMenu } from "@/components/nav/UserMenu";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { cn } from "@/lib/utils";

/**
 * SiteNavBar - A responsive, accessible, and visually overhauled navigation bar.
 * @returns {JSX.Element}
 */
export const SiteNavBar: React.FC = (): JSX.Element => {
  return (
    <header
      className={cn(
        "w-full bg-background/80 backdrop-blur-lg border-b border-border shadow-sm sticky top-0 z-40 transition-all duration-300" // Added backdrop-blur and slightly transparent background
      )}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20 px-4 md:px-6">
        {" "}
        {/* Increased height slightly on desktop */}
        {/* Left Section: Logo and Desktop NavLinks */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Logo />
          <div className="hidden md:flex">
            <NavLinks />
          </div>
        </div>
        {/* Right Section: Theme Toggle, User Menu, and Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle />
          <UserMenu />
          <div className="md:hidden">
            {" "}
            {/* MobileMenu trigger shown only on smaller screens */}
            <MobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};
