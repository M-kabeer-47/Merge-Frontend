import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import { User } from "@/types/user";
import axios from "axios";
import { useState, useEffect } from "react";
import rotateToken from "@/utils/rotate-token";

export default function useGetUser() {
  const [isClient, setIsClient] = useState(false);

  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

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
          fetchUser()
        }
      }
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
    enabled: isClient && !!localStorage.getItem("accessToken"),
    retry: false, // Don't retry on error, we handle it manually
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    user: user as unknown as User,
    isLoading: isLoading || !isClient || isRotationPending,
    isError,
    refetch,
  };
}
