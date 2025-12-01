export interface UpdateProfileType {
    firstName?: string;
    lastName?: string;
    image?: string;
}

export interface ChangePasswordType {
    currentPassword: string;
    newPassword: string;
}
