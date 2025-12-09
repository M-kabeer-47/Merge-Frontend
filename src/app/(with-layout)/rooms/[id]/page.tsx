import { redirect } from "next/navigation";

export default function RoomPage({params}:{params:{id:string}}) {
// redirect to general chat, keep this component server
redirect(`/rooms/${params.id}/general-chat`);
}
