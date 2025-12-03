"use client";

import React from "react";
import { motion } from "motion/react";
import ProfileDetailsForm from "./ProfileDetailsForm";
import PasswordChangeForm from "./PasswordChangeForm";

export default function ProfilePageClient() {
    return (
        <div className="sm:px-6 px-4 sm:py-6 py-4 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div>
                    <h1 className="text-2xl font-bold text-heading">Profile Settings</h1>
                    <p className="text-para-muted">Manage your account settings and preferences.</p>
                </div>

                <ProfileDetailsForm />
                <PasswordChangeForm />
            </motion.div>
        </div>
    );
}
