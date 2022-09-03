import React, { CSSProperties } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: CSSProperties;
  variant?: "primary" | "danger";
  active?: boolean;
};
export const Button = React.memo(
  ({
    children,
    className,
    disabled,
    onClick,
    variant = "primary",
    active,
  }: ButtonProps) => {
    return (
      <button
        disabled={disabled}
        onClick={(event) => {
          if (!disabled) {
            onClick?.(event);
          }
        }}
        className={clsx(
          "border border-gray-50 border-solid cursor-pointer px-3 relative",
          variant === "primary" && "bg-gray-800 text-white",
          variant === "danger" && "bg-red-900 text-white",
          active && "bg-gray-50 text-gray-800",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
