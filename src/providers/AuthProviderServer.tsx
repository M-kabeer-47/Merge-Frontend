import { getUser } from "@/server-api/user";
import { AuthProvider } from "./AuthProvider";
import { ReactNode } from "react";

export default async function AuthProviderServer({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
