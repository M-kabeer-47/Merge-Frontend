import Image from "next/image";
import { User } from "lucide-react";

export default function Avatar({
  profileImage,
  variant,
  size = "lg",
}: {
  profileImage: string | undefined;
  variant?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative ${
        variant === "navbar"
          ? "border-2 border-white/20"
          : "border border-gray-200"
      } ${!profileImage && "bg-gray-200 flex items-center justify-center"}`}
    >
      {profileImage ? (
        <Image
          src={profileImage}
          alt="User Profile"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 34px, 34px"
        />
      ) : (
        <User size={iconSizes[size]} className="text-gray-500" />
      )}
    </div>
  );
}
