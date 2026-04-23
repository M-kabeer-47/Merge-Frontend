import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export default function useFetchAvailableTags() {
  return useQuery({
    queryKey: ["available-tags"],
    queryFn: async () => {
      const response = await api.get("/user/available-tags");
      return response.data as { id: string; name: string }[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
