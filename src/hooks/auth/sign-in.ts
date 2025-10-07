import { UserType } from "@/schemas/user/user";
import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/types/api-error";

export default function signIn({
  setError,
  email,
  password
}: {
  setError: UseFormSetError<UserType>;
  email: string;
  password: string;
}) {
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
        email,
        password,
      })
    );
    return response.data;
  };

  const { mutateAsync, isError, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      if (data.message === "A new OTP has been sent to your email.") {
        window.location.href = `/two-factor?email=${email}`; // Redirect to 2FA page
        return;
      }
      // Handle successful sign-in, e.g., store tokens, redirect, etc.
      else if (data.token && data.refreshToken && data.userId) {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userID", data.userId);

        toast.success("Signed in successfully!");
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect to dashboard or desired page
        }, 500);
      }
    },
    onError: (error: ApiError) => {
      if (error?.response.data.message === "User not found") {
        toast.error("User not found. Please check your email.");
        setError("email", { type: "manual", message: "User not found" });
      } else if (
        error?.response.data.message ===
        "Please verify your email to login, A link has been sent to your email"
      ) {
        toast.error("Please verify your email.");
        setError("email", { type: "manual", message: "Email not verified" });
      } else if (error?.response.data.message === "Invalid password") {
        toast.error("Invalid password. Please try again.");
        setError("password", { type: "manual", message: "Invalid password" });
      }
    },
  });
  return { signIn: mutateAsync, isError, isPending };
}
