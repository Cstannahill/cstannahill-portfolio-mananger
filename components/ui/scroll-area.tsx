// s:/Code/portfolio-manager/components/ui/scroll-area.tsx
import React from "react";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Basic ScrollArea component placeholder.
 * If using a UI library like shadcn/ui, ensure this component is properly added.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`overflow-auto ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";
