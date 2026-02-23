import { Users } from "lucide-react";
import Image from "next/image";
import type { PublicRoom } from "@/types/discover";

interface RoomMembersSectionProps {
  membersCount: number;
  membersPreview: PublicRoom["membersPreview"];
}

export default function RoomMembersSection({
  membersCount,
  membersPreview,
}: RoomMembersSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Members ({membersCount})
      </h3>
      <div className="flex items-center gap-6 flex-wrap">
        {membersPreview.slice(0, 6).map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20">
              <Image
                src={member.avatar}
                alt={member.name}
                width={32}
                height={32}
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <span className="text-sm text-para whitespace-nowrap">
              {member.name}
            </span>
          </div>
        ))}
      </div>
      {membersCount > 6 && (
        <p className="text-sm text-para-muted mt-3">
          +{membersCount - 6} more members
        </p>
      )}
    </section>
  );
}
