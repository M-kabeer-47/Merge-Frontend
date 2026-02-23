import type { Assignment } from "@/types/assignment";
import { createCacheHelpers } from "./utils";

const { addToCache, invalidateStudentCache } =
  createCacheHelpers<Assignment>("assignment", "assignments");

export const addAssignmentToCache = addToCache;
export const invalidateStudentAssignmentsCache = invalidateStudentCache;
