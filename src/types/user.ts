export type User = {
  id: string;
  email: string;
  image: string | null;
  firstName: string;
  lastName: string;
  new_user: boolean;
  role: "student" | "instructor" | "super_admin" | null;
  // True when the user's email is in SUPER_ADMIN_EMAILS on the backend.
  // Source of truth lives in the deploy env, not the database.
  isAdmin: boolean;
  isVerified: boolean;
  googleAccount: boolean;
  hashedRefreshToken: string;
  twoFactorEnabled: boolean;
  notificationStatus: "default" | "allowed" | "denied";
  tags?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
};
