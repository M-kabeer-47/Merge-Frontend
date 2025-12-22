"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }[];
}

export default function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [tabDimensions, setTabDimensions] = useState<{
    [key: string]: { width: number; left: number };
  }>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    // Measure all tabs when component mounts or stats change
    const dimensions: { [key: string]: { width: number; left: number } } = {};

    tabs.forEach((tab) => {
      const tabElement = tabRefs.current[tab.id];
      if (tabElement) {
        const rect = tabElement.getBoundingClientRect();
        const containerRect = tabElement.parentElement?.getBoundingClientRect();
        dimensions[tab.id] = {
          width: rect.width,
          left: rect.left - (containerRect?.left || 0),
        };
      }
    });

    setTabDimensions(dimensions);
  }, []);

  const getHoverDimensions = () => {
    // Don't show hover effect for active tab
    if (!hoveredTab || !tabDimensions[hoveredTab] || hoveredTab === activeTab) {
      return { width: 0, left: 0 };
    }
    return tabDimensions[hoveredTab];
  };

  const handleTabHover = (tabId: string) => {
    // Don't set hover state for active tab
    if (tabId !== activeTab) {
      setHoveredTab(tabId);
    }
  };

  return (
    <div className="relative z-10 bg-main-background px-2 py-2">
      <nav
        className="relative overflow-x-auto scrollbar-hide"
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="flex items-center relative min-w-max sm:min-w-0  justify-start gap-2 sm:gap-4">
          {/* Sliding hover background - Only on desktop and not for active tab */}
          <motion.div
            className="absolute top-0 bottom-0 bg-charcoal/5 rounded-lg pointer-events-none hidden md:block"
            initial={false}
            animate={{
              opacity: hoveredTab && hoveredTab !== activeTab ? 1 : 0,
              width: getHoverDimensions().width,
              x: getHoverDimensions().left,
            }}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.4,
            }}
          />

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Link href={tab.id} key={tab.id}>
                <motion.button
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  onMouseEnter={() => handleTabHover(tab.id)}
                  className={`relative group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-all z-10 justify-center ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-para hover:text-primary"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={`w-4 h-4 transition-all ${
                      isActive
                        ? "text-primary"
                        : "text-para group-hover:text-primary"
                    } flex-shrink-0`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`font-raleway ${
                      isActive ? "font-bold" : ""
                    } hidden xs:inline`}
                  >
                    {tab.label}
                  </span>

                  {/* Mobile: Show abbreviated labels */}
                  <span className={`${isActive ? "font-bold" : ""} xs:hidden`}>
                    {tab.label}
                  </span>

                  {/* Stats badge */}

                  {/* Active tab underline */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-0.5 bg-primary"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                  )}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom border */}
    </div>
  );
}
