"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { updateProfileSchema, UpdateProfileSchemaType } from "@/schemas/user/update-profile";
import useUpdateProfile from "@/hooks/user/use-update-profile";
import { useAuth } from "@/providers/AuthProvider";
import ImageUploadSection from "./ImageUploadSection";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import { toast } from "sonner";

export default function ProfileDetailsForm() {
    const { user } = useAuth();
    const { updateProfile, isUpdating } = useUpdateProfile();
    const [previewImage, setPreviewImage] = useState<string | undefined>(user?.image || undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileSchemaType>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            image: user?.image || "",
        },
    });

    useEffect(() => {
        if (user) {
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("image", user.image || "");
            setPreviewImage(user.image || undefined);
        }
    }, [user, setValue]);

    // Cleanup object URL on unmount or when previewImage changes
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const onSubmit = async (data: UpdateProfileSchemaType) => {
        try {
            let imageUrl = data.image;

            if (selectedFile) {
                toast.info("Uploading image...");
                imageUrl = await uploadToCloudinary({
                    file: selectedFile,
                    attachmentType: "image",
                });
            }

            await updateProfile({
                ...data,
                image: imageUrl,
            });

            // Reset selected file after successful update
            setSelectedFile(null);
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Clean up previous blob URL if it exists
            if (previewImage && previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }

            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            setSelectedFile(file);
            // Mark form as dirty so save button enables
            setValue("image", objectUrl, { shouldDirty: true });
        }
    };

    return (
        <div className="bg-main-background border border-light-border rounded-xl p-6 space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-light-border">
                <UserIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-heading">Personal Information</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Image Upload */}
                <ImageUploadSection
                    previewImage={previewImage}
                    onImageUpload={handleImageUpload}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <FormField
                                label="First Name"
                                htmlFor="firstName"
                                error={errors.firstName?.message}
                            >
                                <Input
                                    {...field}
                                    id="firstName"
                                    placeholder="John"
                                    error={errors.firstName?.message}
                                />
                            </FormField>
                        )}
                    />

                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <FormField
                                label="Last Name"
                                htmlFor="lastName"
                                error={errors.lastName?.message}
                            >
                                <Input
                                    {...field}
                                    id="lastName"
                                    placeholder="Doe"
                                    error={errors.lastName?.message}
                                />
                            </FormField>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-light-border">
                    <Button
                        type="submit"
                        disabled={!isDirty || isUpdating}
                        className="w-40"
                    >
                        {isUpdating ? <LoadingSpinner text="Saving..." /> : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
