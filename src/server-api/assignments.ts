import { getWithAuth } from "./fetch-with-auth";

interface GetAssignmentsParams {
  roomId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getAssignments({
  roomId,
  page = 1,
  limit = 20,
  sortBy,
  sortOrder,
}: GetAssignmentsParams) {
  const params = new URLSearchParams({ roomId });

  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const url = `/assignments?${params.toString()}`;

  console.log(
    `[Server API] GET ${url} | Cache: revalidate: 60s, tags: [assignments, assignments-${roomId}]`
  );

  const data = await getWithAuth(url, {
    next: {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ["assignments", `assignments-${roomId}`],
    },
  });

  console.log(`[Server API] ✅ ${url} | 200`);

  return data;
}

export async function getAssignmentById(assignmentId: string) {
  const url = `/assignments/${assignmentId}`;

  console.log(
    `[Server API] GET ${url} | Cache: revalidate: 60s, tags: [assignment-${assignmentId}]`
  );

  const data = await getWithAuth(url, {
    next: {
      revalidate: 60,
      tags: ["assignments", `assignment-${assignmentId}`],
    },
  });

  console.log(`[Server API] ✅ ${url} | 200`);

  return data;
}
