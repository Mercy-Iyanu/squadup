import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  color?: "gray" | "green" | "yellow" | "blue";
};

export default function Badge({ children, color = "gray" }: BadgeProps) {
  const colors: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${colors[color]}`}
    >
      {children}
    </span>
  );
}
