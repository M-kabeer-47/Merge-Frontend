// Types for room join requests

export type JoinRequestStatus = "pending" | "accepted" | "rejected";

export interface JoinRequestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface JoinRequest {
  id: string;
  status: JoinRequestStatus;
  createdAt: string;
  user: JoinRequestUser;
}

export type JoinRequestAction = "accepted" | "rejected";

export interface ReviewJoinRequestData {
  requestId: string;
  action: JoinRequestAction;
}
