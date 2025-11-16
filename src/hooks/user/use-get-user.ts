import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import { User } from "@/types/user";
import axios from "axios";
import { useState, useEffect } from "react";

export default function useGetUser() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const response = await apiRequest(
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    return response.data;
  };

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: isClient && !!localStorage.getItem("accessToken"),
    retry: 3,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return { user: user as unknown as User, isLoading: isLoading || !isClient, isError };
}
