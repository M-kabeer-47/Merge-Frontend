import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import apiRequest from "@/utils/api-request";
import { ChangePasswordType } from "@/types/user-operations";

export default function useChangePassword() {
    const changePasswordFunction = async (data: ChangePasswordType) => {
        const accessToken = localStorage.getItem("accessToken");
        return await apiRequest(
            axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/change-password`, {
                oldPassword: data.currentPassword,
                newPassword: data.newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );
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
            toast.error(
                error?.response?.data?.message || "Failed to change password. Please try again."
            );
        },
    });

    return {
        changePassword,
        isChangingPassword,
        isError,
        error,
    };
}
