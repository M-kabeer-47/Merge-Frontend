import api from "@/utils/api";
import type { LiveQnaQuestion } from "@/types/live-qna";

export interface LiveQnaResponse {
  questions: LiveQnaQuestion[];
}

export async function fetchLiveQnaQuestions(roomId: string, sessionId: string) {
  const response = await api.get<LiveQnaResponse>(
    `/rooms/${roomId}/live-sessions/${sessionId}/live-qna/questions`
  );
  return response.data.questions;
}

export async function askAiBotToAnswer(roomId: string, sessionId: string, questionId: string) {
  const { data } = await api.post<LiveQnaQuestion>(
    `/rooms/${roomId}/live-sessions/${sessionId}/live-qna/questions/${questionId}/ask-ai`
  );
  return data;
}
