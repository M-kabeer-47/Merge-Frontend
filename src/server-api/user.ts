import axios from "axios";
import { getWithAuth } from "./fetch-with-auth";
import { User } from "@/types/user";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getUser(): Promise<User | null> {
  const { data, error } = await getWithAuth<User>(
    `${API_BASE_URL}/user/profile`
  );

  if (error || !data) {
    return null;
  }

  return data;
}
