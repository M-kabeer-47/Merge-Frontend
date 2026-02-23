import { FileText, Image as ImageIcon, FileVideo, File } from "lucide-react";
import type { RoomFile } from "@/types/discover";

export const getFileIcon = (type: RoomFile["type"]) => {
  switch (type) {
    case "pdf":
    case "doc":
      return FileText;
    case "image":
      return ImageIcon;
    case "video":
      return FileVideo;
    default:
      return File;
  }
};
