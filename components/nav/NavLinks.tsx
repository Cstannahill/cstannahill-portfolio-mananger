// components/nav/NavLinks.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  UserCircle,
  Mail,
  // Removed: Icon as LucideIcon
} from "lucide-react";

// Define the type for a navigation link
interface NavLinkItem {
  href: string;
  label: string;
  // Correctly type the icon as a React component that accepts SVG props
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const links: NavLinkItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/about", label: "About", icon: UserCircle },
  { href: "/contact", label: "Contact", icon: Mail },
];

/**
 * NavLinks - Main navigation links with icons and active state.
 * Features a new Dashboard link and uses lucide-react icons.
 * @returns {JSX.Element}
 */
export const NavLinks: React.FC<{ onLinkClick?: () => void }> = ({
  onLinkClick,
}): JSX.Element => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col md:flex-row md:gap-1 lg:gap-2">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        const IconComponent = link.icon; // IconComponent will be correctly typed here

        return (
          <li key={link.href} className="w-full md:w-auto">
            <Button
              asChild
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full md:w-auto justify-start md:justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
                "group"
              )}
              onClick={onLinkClick}
            >
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
                className="flex items-center gap-2 w-full"
              >
                <IconComponent
                  className={cn(
                    "w-5 h-5 transition-colors",
                    // Simpler active/hover state for icon color based on parent button's state
                    isActive
                      ? ""
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "transition-colors",
                    isActive ? "font-semibold" : "font-medium"
                    // Text color will be handled by button's variant and hover state
                  )}
                >
                  {link.label}
                </span>
              </Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
