export type LiveQnaStatus = "open" | "answered";

export interface LiveQnaUser {
  id: string;
  firstName: string;
  lastName: string;
  image?: string | null;
}

export interface LiveQnaQuestion {
  id: string;
  roomId: string;
  sessionId: string;
  content: string;
  status: LiveQnaStatus;
  votesCount: number;
  viewerHasVoted: boolean;
  isMine: boolean;
  author: LiveQnaUser;
  answeredBy?: LiveQnaUser | null;
  answeredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
