// components/nav/MobileMenu.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; // Added X icon
import { NavLinks } from "./NavLinks";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo"; // Import Logo component

/**
 * MobileMenu - Hamburger menu for mobile navigation with an improved design.
 * @returns {JSX.Element}
 */
export const MobileMenu: React.FC = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);

  // Close menu when screen size changes to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        // 768px is md breakpoint
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-end md:hidden" // Added backdrop-blur
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <nav
            className={cn(
              "bg-background w-72 max-w-[calc(100%-2rem)] h-full shadow-2xl p-4 flex flex-col gap-4 border-l border-border animate-in slide-in-from-right duration-300 ease-in-out" // Shadcn's animate-in
            )}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside nav
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
              {/* Optional: Add Logo to mobile menu */}
              <div onClick={() => setOpen(false)}>
                {" "}
                {/* Close menu if logo is clicked */}
                <Logo />
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Pass setOpen to close menu on link click */}
            <NavLinks onLinkClick={() => setOpen(false)} />

            {/* Optional: ThemeToggle and UserMenu can also be added here if desired */}
            {/* <div className="mt-auto flex flex-col gap-2">
              <ThemeToggle />
              Maybe a simplified User info or login button
            </div> */}
          </nav>
        </div>
      )}
    </>
  );
};
