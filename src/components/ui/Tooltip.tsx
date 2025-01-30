import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="inline-block"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full mb-2 px-3 py-1.5 text-sm text-white bg-gray-800 rounded-lg whitespace-nowrap transform -translate-x-1/2 left-1/2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
} 