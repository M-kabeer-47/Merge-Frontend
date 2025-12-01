import Image from "next/image";
import { User } from "lucide-react";

export default function Avatar({
  profileImage,
  size = "lg",
}: {
  profileImage: string | undefined;

  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-full w-full",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 48,
  };

  return (
    <div
      className={`${sizeClasses[size]
        } rounded-full overflow-hidden relative border-2 border-light-border bg-main-background flex items-center justify-center`}
    >
      {profileImage ? (
        <Image
          src={profileImage}
          alt="User Profile"
          fill
          className="object-cover"
        />
      ) : (
        <User size={iconSizes[size]} className="text-primary" />
      )}
    </div>
  );
}
