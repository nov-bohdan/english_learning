"use client";

import React, { useState, cloneElement, ReactElement } from "react";

interface TooltipWrapperProps {
  /** Tooltip content */
  tooltipContent: React.ReactNode;
  /** Tooltip placement relative to the target element */
  place?: "top" | "bottom" | "left" | "right";
  /** Wrapped element (e.g., an icon) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>;
}

export default function TooltipWrapper({
  tooltipContent,
  place = "top",
  children,
}: TooltipWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let x = rect.left + rect.width / 2;
    let y = rect.top;
    if (place === "top") {
      y = rect.top - 8; // 8px offset above
    } else if (place === "bottom") {
      y = rect.bottom + 8;
    } else if (place === "left") {
      x = rect.left - 8;
      y = rect.top + rect.height / 2;
    } else if (place === "right") {
      x = rect.right + 8;
      y = rect.top + rect.height / 2;
    }
    setPosition({ x, y });
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  // Determine tooltip transform based on placement
  let transform = "";
  if (place === "top") {
    transform = "translate(-50%, -100%)";
  } else if (place === "bottom") {
    transform = "translate(-50%, 0)";
  } else if (place === "left") {
    transform = "translate(-100%, -50%)";
  } else if (place === "right") {
    transform = "translate(0, -50%)";
  }

  return (
    <>
      {cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      <div
        className={`fixed z-50 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg transition-opacity ease-in-out duration-200 pointer-events-none ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: transform,
        }}
      >
        {tooltipContent}
        {/* Optional arrow indicator */}
        {place === "top" && (
          <div
            className="absolute bottom-[-4px] left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"
            style={{ transform: "translateX(-50%)" }}
          />
        )}
        {place === "bottom" && (
          <div
            className="absolute top-[-4px] left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800"
            style={{ transform: "translateX(-50%)" }}
          />
        )}
        {place === "left" && (
          <div
            className="absolute right-[-4px] top-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-800"
            style={{ transform: "translateY(-50%)" }}
          />
        )}
        {place === "right" && (
          <div
            className="absolute left-[-4px] top-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800"
            style={{ transform: "translateY(-50%)" }}
          />
        )}
      </div>
    </>
  );
}
