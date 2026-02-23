import type { Quiz } from "@/types/quiz";
import { createCacheHelpers } from "./utils";

const { addToCache, invalidateStudentCache } =
  createCacheHelpers<Quiz>("quiz", "quizzes");

export const addQuizToCache = addToCache;
export const invalidateStudentQuizzesCache = invalidateStudentCache;
