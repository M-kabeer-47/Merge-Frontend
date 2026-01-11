import { redirect } from "next/navigation";

export default async function RoomPage({ params }: { params: { id: string } }) {
  let Params = await params;
  // redirect to general chat, keep this component server
  redirect(`/rooms/${Params.id}/general-chat`);
}
