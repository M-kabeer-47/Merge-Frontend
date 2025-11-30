import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import { Room } from "@/lib/constants/mock-data";
import axios from "axios";
import { useState, useEffect } from "react";
import rotateToken from "@/utils/rotate-token";
import { toast } from "sonner";

export default function useGetUserRooms() {
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

    const fetchUserRooms = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        try {
            const response = await apiRequest(
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/user-rooms`, {
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
                // If token rotation was successful, retry fetching user rooms
                if (result?.token) {
                    return fetchUserRooms();
                }
            }
            toast.error("Failed to fetch rooms, please try again later");
            return null;
        }
    };

    const {
        data: rooms,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["user-rooms"],
        queryFn: fetchUserRooms,
        enabled: isClient && !!localStorage.getItem("accessToken"),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes

    });

    return {
        rooms: rooms as unknown as [{ createdRooms: Room[], joinedRooms: Room[] }],
        isLoading: isLoading || !isClient || isRotationPending,
        isError,
        refetch,
    };
}
