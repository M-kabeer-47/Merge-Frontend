import { redirect } from "next/navigation";
import { getUser } from "@/server-api/user";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
