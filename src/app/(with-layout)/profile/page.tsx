import React from "react";
import { Metadata } from "next";
import ProfilePage from "@/pages/profile/ProfilePage";

export const metadata: Metadata = {
    title: "Profile Settings | Merge",
    description: "Manage your account settings, profile information, and preferences",
    keywords: ["profile", "settings", "account", "preferences"],
    openGraph: {
        title: "Profile Settings | Merge",
        description: "Manage your account settings and preferences",
        type: "website",
    },
};

export default function Page() {
    return <ProfilePage />;
}
