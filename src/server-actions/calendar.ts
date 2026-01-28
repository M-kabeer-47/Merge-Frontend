"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCalendarTasks() {
  revalidateTag("calendar-tasks");
}
