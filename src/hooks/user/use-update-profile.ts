import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import apiRequest from "@/utils/api-request";
import { UpdateProfileType } from "@/types/user-operations";

export default function useUpdateProfile() {
    const queryClient = useQueryClient();

    const updateProfileFunction = async (data: UpdateProfileType) => {
        const accessToken = localStorage.getItem("accessToken");
        return await apiRequest(
            axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );
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
            toast.error(
                error?.response?.data?.message || "Failed to update profile. Please try again."
            );
        },
    });

    return {
        updateProfile,
        isUpdating,
        isError,
        error,
    };
}
