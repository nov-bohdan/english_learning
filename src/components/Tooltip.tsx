"use client";

import React, { useState, cloneElement, ReactElement } from "react";

interface TooltipWrapperProps {
  /** Содержимое тултипа */
  tooltipContent: React.ReactNode;
  /** Позиция тултипа относительно целевого элемента */
  place?: "top" | "bottom" | "left" | "right";
  /** Оборачиваемый элемент (например, иконка) */
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
      y = rect.top - 8; // отступ 8px сверху
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

  return (
    <>
      {cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      <div
        className={`fixed z-50 bg-gray-800 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 pointer-events-none ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform:
            place === "top"
              ? "translate(-50%, -100%)"
              : place === "bottom"
              ? "translate(-50%, 0)"
              : place === "left"
              ? "translate(-100%, -50%)"
              : "translate(0, -50%)",
        }}
      >
        {tooltipContent}
      </div>
    </>
  );
}
