import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { ChangePasswordType } from "@/types/user-operations";

export default function useChangePassword() {
  const changePasswordFunction = async (data: ChangePasswordType) => {
    const response = await api.patch("/user/change-password", {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  };

  const {
    mutateAsync: changePassword,
    isPending: isChangingPassword,
    isError,
    error,
  } = useMutation({
    mutationFn: changePasswordFunction,
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to change password. Please try again.");
    },
  });

  return {
    changePassword,
    isChangingPassword,
    isError,
    error,
  };
}
