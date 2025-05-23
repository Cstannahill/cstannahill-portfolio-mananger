// components/nav/ThemeToggle.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle - Switch between light and dark mode.
 * @returns {JSX.Element}
 */
export const ThemeToggle: React.FC = (): JSX.Element => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false; // Default or placeholder for SSR
  });

  React.useEffect(() => {
    setIsMounted(true);
    // Initial check in case localStorage or system preference was already set
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const userPreference = localStorage.getItem("theme");

    if (
      userPreference === "dark" ||
      (!userPreference && darkModeMediaQuery.matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isMounted) return; // Avoid running on initial server render if needed

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode, isMounted]);

  const toggleTheme = () => {
    if (!isMounted) return;
    setIsDarkMode((prevMode) => !prevMode);
  };

  if (!isMounted) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    // Or render a default state that matches the initial client-side check logic
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className={cn(
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
        disabled // Disabled until mounted to prevent interaction before hydration
      >
        <Sun className="w-5 h-5 hidden dark:block" />
        <Moon className="w-5 h-5 dark:hidden" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={cn(
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
};
