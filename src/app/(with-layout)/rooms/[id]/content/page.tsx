import { Suspense } from "react";
import ContentPageClient from "@/components/content/ContentPageClient";
import ContentDataWrapper from "@/components/content/ContentDataWrapper";
import ContentSkeleton from "@/components/content/ContentSkeleton";

interface ContentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folderId?: string }>;
}

export default async function ContentPage({
  params,
  searchParams,
}: ContentPageProps) {
  const { id: roomId } = await params;
  const { folderId = null } = await searchParams;

  return (
    <ContentPageClient roomId={roomId} folderId={folderId}>
      <Suspense key={folderId} fallback={<ContentSkeleton />}>
        <ContentDataWrapper roomId={roomId} folderId={folderId} />
      </Suspense>
    </ContentPageClient>
  );
}
