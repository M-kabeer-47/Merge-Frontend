"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

const isClient = typeof window !== "undefined";

export default function useGetUser() {
  const router = useRouter();
  const fetchUser = async () => {
    const token = isClient ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.push("/sign-in");
      return null;
    }

    const response = await api.get("/user/profile");
    return response.data;
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
    retry: false, // Don't retry on error, interceptor handles 401
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    user: user as unknown as User,
    isLoading: isLoading || !isClient,
    isError,
    refetch,
  };
}
