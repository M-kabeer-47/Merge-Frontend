"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { changePasswordSchema, ChangePasswordSchemaType } from "@/schemas/user/change-password";
import useChangePassword from "@/hooks/user/use-change-password";

export default function PasswordChangeForm() {
    const { changePassword, isChangingPassword } = useChangePassword();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordSchemaType) => {
        try {
            await changePassword(data);
            reset();
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <div className="bg-main-background border border-light-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-light-border">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-heading">Security</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Controller
                        name="currentPassword"
                        control={control}
                        render={({ field }) => (
                            <FormField
                                label="Current Password"
                                htmlFor="currentPassword"
                                error={errors.currentPassword?.message}
                            >
                                <Input
                                    {...field}
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                    error={errors.currentPassword?.message}
                                />
                            </FormField>
                        )}
                    />

                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field }) => (
                            <FormField
                                label="New Password"
                                htmlFor="newPassword"
                                error={errors.newPassword?.message}
                            >
                                <Input
                                    {...field}
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    error={errors.newPassword?.message}
                                />
                            </FormField>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-light-border">
                    <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="w-40"
                    >
                        {isChangingPassword ? <LoadingSpinner text="Updating..." /> : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
