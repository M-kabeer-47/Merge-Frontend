import React, { useRef, useLayoutEffect, useState } from "react";
import { motion } from "motion/react";

interface TabOption {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  options: TabOption[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Tabs({
  options,
  activeKey,
  onChange,
  className = "",
}: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIdx = options.findIndex((tab) => tab.key === activeKey);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Recalculate indicator position after mount and whenever activeKey/options change
  useLayoutEffect(() => {
    const activeTab = tabRefs.current[activeIdx];
    if (activeTab && activeTab.offsetWidth > 0) {
      setIndicator({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    } else if (tabRefs.current[0] && tabRefs.current[0].offsetWidth > 0) {
      // Fallback to first tab if active tab not ready
      setIndicator({
        left: tabRefs.current[0].offsetLeft,
        width: tabRefs.current[0].offsetWidth,
      });
    }
  }, [activeKey, options.length]);

  return (
    <div
      className={`relative flex bg-white shadow-sm rounded-lg border border-gray-200 sm:h-[42px] h-[38px] overflow-x-auto ${className}`}
    >
      {/* Sliding Box Indicator */}
      <motion.div
        className="absolute h-full bg-secondary/10 rounded-md pointer-events-none z-0 "
        animate={{ left: indicator.left, width: indicator.width }}
        transition={{ type: "slide", stiffness: 400, damping: 30 }}
      />

      {options.map((tab, idx) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            onClick={() => onChange(tab.key)}
            className={`relative sm:flex-1 sm:px-5 sm:py-2 px-4 py-2 font-medium whitespace-nowrap transition-all duration-200 z-10 rounded-md ${
              isActive ? "text-primary" : "text-normal-text hover:text-primary"
            }`}
          >
            <span className="flex items-center justify-center gap-2 sm:text-sm text-xs font-semibold font-raleway">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-100 text-normal-text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
