import type { BaseDisplayItem } from "@/types/display-item";
import {
  Folder,
  FileText,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
  FileCode,
  FileSpreadsheet,
  Presentation,
  FileIcon,
} from "lucide-react";
import Image from "next/image";

export function ItemIcon({ item }: { item: BaseDisplayItem }) {
  const iconClass = `h-8 w-8 sm:h-10 sm:w-10 ${
    item.iconColor || "text-secondary"
  }`;

  switch (item.iconType) {
    case "folder":
      return <Folder className={iconClass} fill="currentColor" />;
    case "note":
    case "pdf":
    case "document":
      return <FileText className={iconClass} />;
    case "presentation":
      return <Presentation className={iconClass} />;
    case "spreadsheet":
      return <FileSpreadsheet className={iconClass} />;
    case "image":
      return item.filePath ? (
        <Image
          src={item.filePath}
          alt={item.name}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover"
          width={40}
          height={40}
        />
      ) : (
        <FileIcon className={iconClass} />
      );

    case "video":
      return <FileVideo className={iconClass} />;
    case "audio":
      return <FileAudio className={iconClass} />;
    case "archive":
      return <FileArchive className={iconClass} />;
    case "code":
      return <FileCode className={iconClass} />;
  }
}
