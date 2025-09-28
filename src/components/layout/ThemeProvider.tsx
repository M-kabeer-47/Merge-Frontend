// File: src/contexts/ThemeContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of our theme context
interface ThemeContextType {
  isDarkMode: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props for our provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark";
}

// The Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";

    // Check system preference if no saved theme
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Determine initial theme
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);
    setIsDarkMode(initialTheme === "dark");

    // Apply theme to HTML element
    applyThemeToDocument(initialTheme);
  }, []);

  // Apply theme changes to the document
  const applyThemeToDocument = (newTheme: "light" | "dark") => {
    const html = document.documentElement;

    // Remove existing theme classes
    html.classList.remove("light", "dark");

    // Add new theme class
    html.classList.add(newTheme);

    // Save to localStorage
    localStorage.setItem("theme", newTheme);
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setIsDarkMode(newTheme === "dark");
    applyThemeToDocument(newTheme);
  };

  // Set specific theme
  const setThemeValue = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setIsDarkMode(newTheme === "dark");
    applyThemeToDocument(newTheme);
  };

  // The value object that will be provided to consuming components
  const value: ThemeContextType = {
    isDarkMode,
    theme,
    toggleTheme,
    setTheme: setThemeValue,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// Export the context for advanced usage (optional)
export { ThemeContext };
