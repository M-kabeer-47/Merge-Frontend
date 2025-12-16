import { useMutation } from "@tanstack/react-query";
import { UserType } from "@/schemas/user/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function signUp() {
  const router = useRouter();

  async function signUpUser(user: UserType) {
    const response = await api.post("/auth/signup", user);
    return response.data;
  }

  const { mutateAsync, isError, isPending } = useMutation({
    mutationFn: signUpUser,
    onError: () => {
      toast.error("Sign up failed. Please try again.");
    },
    onSuccess: () => {
      toast.success(
        "Sign up successful! Please check your email to verify your account."
      );
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    },
  });

  return { signUpUser: mutateAsync, isError, isPending };
}
