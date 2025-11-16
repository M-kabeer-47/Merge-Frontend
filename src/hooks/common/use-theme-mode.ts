"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Custom hook to safely use theme in components
 * Prevents hydration mismatch by waiting for client-side mount
 */
export function useThemeMode() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme: mounted ? theme : undefined,
    setTheme,
    systemTheme: mounted ? systemTheme : undefined,
    mounted,
    isDarkMode: mounted ? theme === "dark" : false,
  };
}
