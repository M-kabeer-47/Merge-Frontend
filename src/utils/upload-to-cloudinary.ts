import axios from "axios";

export const uploadToCloudinary = async ({
  file,
  attachmentType,
  onProgress,
}: {
  file: File | string;
  attachmentType: string;
  onProgress?: (progress: number) => void;
}): Promise<string> => {
  if (typeof file === "string" && file.startsWith("http")) {
    return file;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  const config = {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (onProgress) {
        onProgress(progress);
      }
    },
  };
  try {
    console.log("Uploading to Cloudinary");
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }/${attachmentType === "image" ? "image" : "raw"}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...config,
      }
    );

    const data = await response.data;
    return data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
