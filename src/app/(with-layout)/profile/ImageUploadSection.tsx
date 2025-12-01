"use client";

import React, { useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

interface ImageUploadSectionProps {
    previewImage: string | undefined;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadSection({
    previewImage,
    onImageUpload,
}: ImageUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-8 p-4 bg-secondary/5 rounded-lg border border-dashed border-light-border">
            <div className="relative group cursor-pointer" onClick={triggerImageUpload}>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-light-border shadow-sm relative bg-main-background">
                    <Avatar profileImage={previewImage} size="lg" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onImageUpload}
                />
            </div>
            <div className="text-center sm:text-left space-y-2 flex-1">
                <h3 className="font-semibold text-heading text-lg">Profile Photo</h3>
                <p className="text-sm text-para-muted max-w-xs">
                    Upload a new photo to customize your profile. Recommended size: 400x400px.
                    <br />
                    Supported formats: JPG, PNG, GIF.
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerImageUpload}
                    className="mt-2 w-full sm:w-auto min-w-[160px]"
                >
                    Upload New Photo
                </Button>
            </div>
        </div>
    );
}
