"use client";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import { User } from "@/types/user";
import axios from "axios";
import rotateToken from "@/utils/rotate-token";

const isClient = typeof window !== "undefined";

export default function useGetUser() {
  // Token extraction from URL params is now handled by /callback page
  // This hook only reads tokens from localStorage
  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token available");
    }

    try {
      const response = await apiRequest(
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      return response.data;
    } catch (error: any) {
      // Check if error is 401 (Unauthorized)
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        const result = await refreshTokenFn();
        // If token rotation was successful, retry fetching user
        if (result?.token) {
          return fetchUser();
        }
      }
      throw error;
    }
  };

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: isClient,
    retry: false, // Don't retry on error, we handle it manually
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    user: user as unknown as User,
    isLoading: isLoading || !isClient || isRotationPending,
    isError,
    refetch,
  };
}
