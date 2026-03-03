import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { UpdateProfileType } from "@/types/user-operations";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  const updateProfileFunction = async (data: UpdateProfileType) => {
    const response = await api.patch("/user/update", data);
    return response.data;
  };

  const {
    mutateAsync: updateProfile,
    isPending: isUpdating,
    isError,
    error,
  } = useMutation({
    mutationFn: updateProfileFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to update profile. Please try again.");
    },
  });

  return {
    updateProfile,
    isUpdating,
    isError,
    error,
  };
}
