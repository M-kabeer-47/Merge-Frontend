export type User = {
  id: string;
  email: string;
  image: string | null;
  firstName: string;
  lastName: string;
  new_user: boolean;
  role: "student" | "instructor" | null;
  isVerified: boolean;
  googleAccount: boolean;
  hashedRefreshToken: string;
  twoFactorEnabled: boolean;
  notificationStatus: "default" | "allowed" | "denied";
  createdAt: string;
  updatedAt: string;
};
