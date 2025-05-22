import React from "react";

/**
 * Accessible callout component for MDX content.
 * @param title - Optional callout title
 * @param icon - Optional emoji or icon
 * @param type - Callout type (info, warning, success, error)
 * @param children - Callout content
 */
export interface CalloutProps {
  title?: string;
  icon?: string;
  type?: "info" | "warning" | "success" | "error";
  children: React.ReactNode;
}

const typeStyles: Record<string, string> = {
  info: "bg-blue-50 border-blue-400 text-blue-900",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-900",
  success: "bg-green-50 border-green-400 text-green-900",
  error: "bg-red-50 border-red-400 text-red-900",
};

export const Callout: React.FC<CalloutProps> = ({
  title,
  icon,
  type = "info",
  children,
}) => (
  <aside
    className={`border-l-4 p-4 rounded-md mb-4 flex flex-col gap-1 focus:outline-none ${typeStyles[type] || typeStyles.info}`}
    tabIndex={0}
    aria-label={title ? `${type} callout: ${title}` : `${type} callout`}
    role="note"
  >
    <div className="flex items-center gap-2 mb-1">
      {icon && (
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
      )}
      {title && <span className="font-semibold">{title}</span>}
    </div>
    <div className="text-sm">{children}</div>
  </aside>
);
