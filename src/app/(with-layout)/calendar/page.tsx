import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCalendarTasks } from "@/server-api/calendar";
import CalendarClient from "@/components/calendar/CalendarClient";

export default async function CalendarPage() {
  const queryClient = new QueryClient();

  // Prefetch calendar tasks on the server
  await queryClient.prefetchQuery({
    queryKey: ["calendar-tasks"],
    queryFn: () => getCalendarTasks(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarClient />
    </HydrationBoundary>
  );
}
