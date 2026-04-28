"use server";
import {
  getWithAuth,
  postWithAuth,
  patchWithAuth,
  deleteWithAuth,
} from "./fetch-with-auth";
import { API_BASE_URL } from "@/lib/constants/api";

const BASE = `${API_BASE_URL}/admin`;

// ─── Overview ───────────────────────────────────────────────────────────────
export async function getOverview() {
  const { data } = await getWithAuth<any>(`${BASE}/overview`, { cache: "no-store" });
  return data;
}

// ─── Users ──────────────────────────────────────────────────────────────────
export async function listUsers(params: {
  page?: number;
  limit?: number;
  role?: string;
  tier?: string;
  search?: string;
}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== "") as any,
  );
  const { data } = await getWithAuth<any>(`${BASE}/users?${qs.toString()}`, {
    cache: "no-store",
  });
  return data;
}

export async function getUserDetail(id: string) {
  const { data } = await getWithAuth<any>(`${BASE}/users/${id}`, { cache: "no-store" });
  return data;
}

export async function updateUserRole(id: string, role: string) {
  const { data } = await patchWithAuth<any>(`${BASE}/users/${id}/role`, { role });
  return data;
}

export async function setUserSuspension(id: string, suspend: boolean, reason?: string) {
  const { data } = await patchWithAuth<any>(`${BASE}/users/${id}/suspend`, { suspend, reason });
  return data;
}

// ─── Billing ────────────────────────────────────────────────────────────────
export async function listPayments(params: {
  page?: number;
  limit?: number;
  status?: string;
  planTier?: string;
  from?: string;
  to?: string;
}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== "") as any,
  );
  const { data } = await getWithAuth<any>(`${BASE}/billing/payments?${qs}`, {
    cache: "no-store",
  });
  return data;
}

export async function getRevenueSeries(days: number = 30) {
  const { data } = await getWithAuth<any>(`${BASE}/billing/revenue?days=${days}`, {
    cache: "no-store",
  });
  return data;
}

export async function getSubscriptionsSummary() {
  const { data } = await getWithAuth<any>(`${BASE}/billing/subscriptions`, {
    cache: "no-store",
  });
  return data;
}

// ─── Rewards ────────────────────────────────────────────────────────────────
export async function listChallenges() {
  const { data } = await getWithAuth<any>(`${BASE}/rewards/challenges`, { cache: "no-store" });
  return data;
}

export async function createChallenge(body: any) {
  const { data } = await postWithAuth<any>(`${BASE}/rewards/challenges`, body);
  return data;
}

export async function updateChallenge(id: string, body: any) {
  const { data } = await patchWithAuth<any>(`${BASE}/rewards/challenges/${id}`, body);
  return data;
}

export async function deleteChallenge(id: string) {
  const { data } = await deleteWithAuth<any>(`${BASE}/rewards/challenges/${id}`);
  return data;
}

export async function listAdminBadges() {
  const { data } = await getWithAuth<any>(`${BASE}/rewards/badges`, { cache: "no-store" });
  return data;
}

export async function updateAdminBadge(id: string, body: any) {
  const { data } = await patchWithAuth<any>(`${BASE}/rewards/badges/${id}`, body);
  return data;
}

export async function listAwardedBadges(page: number = 1) {
  const { data } = await getWithAuth<any>(
    `${BASE}/rewards/awarded?page=${page}&limit=20`,
    { cache: "no-store" },
  );
  return data;
}

// ─── Rooms ──────────────────────────────────────────────────────────────────
export async function listAdminRooms(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== "") as any,
  );
  const { data } = await getWithAuth<any>(`${BASE}/rooms?${qs}`, { cache: "no-store" });
  return data;
}

export async function deleteAdminRoom(id: string) {
  const { data } = await deleteWithAuth<any>(`${BASE}/rooms/${id}`);
  return data;
}

// ─── Sessions ───────────────────────────────────────────────────────────────
export async function listLiveSessions() {
  const { data } = await getWithAuth<any>(`${BASE}/sessions/live`, { cache: "no-store" });
  return data;
}

export async function listSessionHistory(page: number = 1) {
  const { data } = await getWithAuth<any>(
    `${BASE}/sessions/history?page=${page}&limit=20`,
    { cache: "no-store" },
  );
  return data;
}

// ─── Broadcast ──────────────────────────────────────────────────────────────
export async function broadcastMessage(message: string, audience: "all" | "paid" | "free" = "all") {
  const { data } = await postWithAuth<any>(`${BASE}/broadcast`, { message, audience });
  return data;
}
