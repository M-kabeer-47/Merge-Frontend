"use server"
import dotenv from "dotenv"
dotenv.config()
export const uploadToCloudinary = async (file: File | string): Promise<string> => {

  if (typeof file === "string" && file.startsWith("http")) {
    console.log("File is already a URL");
    return file;
  }
    const formData = new FormData();
    console.log("file",file)
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Uploaded " + JSON.stringify(data));
      return data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };