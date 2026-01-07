"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { User } from "@/types/user";

export default function useGetUser() {
  const fetchUser = async () => {
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
    retry: false,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    user: user as User,
    isLoading,
    isError,
    refetch,
  };
}
