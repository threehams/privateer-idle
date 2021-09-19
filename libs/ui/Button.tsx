import React, { CSSProperties } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: CSSProperties;
  variant?: "primary" | "danger";
};
export const Button = ({
  children,
  className,
  disabled,
  onClick,
  variant = "primary",
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
        variant === "danger" && "bg-red-900 text-white",
        className,
      )}
    >
      {children}
    </button>
  );
};
