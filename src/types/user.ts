export type User = {
  id: string;
  email: string;
  image: string | null;
  firstName: string;
  lastName: string;
  new_user: boolean;
  role: "student" | "instructor" | "super_admin" | null;
  isVerified: boolean;
  googleAccount: boolean;
  hashedRefreshToken: string;
  twoFactorEnabled: boolean;
  notificationStatus: "default" | "allowed" | "denied";
  tags?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
};
