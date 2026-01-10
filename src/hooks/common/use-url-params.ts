"use client";

import { useRouter, useSearchParams } from "next/navigation";

export interface UrlParamsConfig {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
  filter?: string;
  page?: number;
  [key: string]: string | number | undefined;
}

interface UseUrlParamsOptions {
  basePath: string;
  defaultValues?: Record<string, string | number>;
  scroll?: boolean;
}

export function useUrlParams(options: UseUrlParamsOptions) {
  const { basePath, defaultValues, scroll = false } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const getAllParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const updateParams = (params: UrlParamsConfig) => {
    if (!defaultValues) return;
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      // Skip undefined values (param not being changed)
      if (value === undefined) return;

      // Convert numbers to strings
      const stringValue = typeof value === "number" ? String(value) : value;

      // Check if this value should result in deletion
      const isDefaultValue =
        defaultValues[key] !== undefined &&
        String(defaultValues[key]) === stringValue;

      // Delete if empty string or matches default value
      if (!stringValue || isDefaultValue) {
        current.delete(key);
      } else {
        current.set(key, stringValue);
      }
    });

    const queryString = current.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(url, { scroll });
  };

  const clearAllParams = () => {
    router.push(basePath, { scroll });
  };

  const clearParams = (keys: string[]) => {
    const current = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => current.delete(key));

    const queryString = current.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(url, { scroll });
  };

  return {
    updateParams,
    getParam,
    getAllParams,
    clearAllParams,
    clearParams,
    searchParams,
  };
}

export default useUrlParams;
