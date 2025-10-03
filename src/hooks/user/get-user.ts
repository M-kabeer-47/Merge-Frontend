import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useGetUser({ userID }: { userID: string }) {
  const getUserFunction = async () => {
    let response = await apiRequest(
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userID}`)
    );
    return response.data;
  };
  const { mutateAsync: getUser } = useMutation({
    mutationFn: getUserFunction,
    onSuccess: (data) => {
    }
  });

  // Placeholder for future implementation
  // This hook can be expanded to fetch and return user data as needed
  return { getUser };
}
