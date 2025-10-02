import { UserType } from "@/schemas/user/user";
import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}
export default function signIn({
  setError,
}: {
  setError: UseFormSetError<UserType>;
}) {
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
        email,
        password,
      })
    );
  };

  const { mutateAsync, isError, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // Handle successful sign-in, e.g., store tokens, redirect, etc.
      console.log("Sign-in successful:", data);
    },
    onError: (error: ApiError) => {
      if (error?.response.data.message === "User not found") {
        toast.error("User not found. Please check your email.");
        setError("email", { type: "manual", message: "User not found" });
      } else if (
        error?.response.data.message ===
        "Please verify your email to login, A link has been sent to your email"
      ) {
        toast.error(
          "Please verify your email."
        );
        setError("email", { type: "manual", message: "Email not verified" });
      } else if (error?.response.data.message === "Invalid password") {
        toast.error("Invalid password. Please try again.");
        setError("password", { type: "manual", message: "Invalid password" });
      }
    },
  });
  return { signIn: mutateAsync, isError, isPending };
}
