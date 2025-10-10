import type { FileType } from "@/types/content";

export type FileIconType =
  | "pdf"
  | "document"
  | "presentation"
  | "spreadsheet"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "file";

export function getFileIconType(fileType: FileType): FileIconType {
  switch (fileType) {
    case "pdf":
      return "pdf";
    case "docx":
    case "txt":
      return "document";
    case "pptx":
      return "presentation";
    case "xlsx":
      return "spreadsheet";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "image";
    case "mp4":
      return "video";
    case "mp3":
      return "audio";
    case "zip":
      return "archive";
    case "md":
      return "code";
    default:
      return "file";
  }
}

export function getFileIconColor(fileType: FileType): string {
  switch (fileType) {
    case "pdf":
      return "text-destructive";
    case "docx":
    case "txt":
      return "text-[#2B579A]";
    case "pptx":
      return "text-[#D04423]";
    case "xlsx":
      return "text-[#217346]";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "text-accent";
    case "mp4":
      return "text-secondary";
    case "mp3":
      return "text-primary";
    case "zip":
      return "text-para";
    case "md":
      return "text-heading";
    default:
      return "text-para-muted";
  }
}

export function getFileTypeLabel(fileType: FileType): string {
  const labels: Record<FileType, string> = {
    pdf: "PDF",
    docx: "Word Document",
    pptx: "PowerPoint",
    xlsx: "Excel",
    png: "PNG Image",
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
    gif: "GIF Image",
    mp4: "Video",
    mp3: "Audio",
    zip: "Archive",
    md: "Markdown",
    txt: "Text File",
    other: "File",
  };

  return labels[fileType] || "File";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
    }
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function getFileTypeColor(fileType: FileType): string {
  const colors: Record<FileType, string> = {
    pdf: "bg-destructive/10 text-destructive",
    docx: "bg-[#2B579A]/10 text-[#2B579A]",
    pptx: "bg-[#D04423]/10 text-[#D04423]",
    xlsx: "bg-[#217346]/10 text-[#217346]",
    png: "bg-accent/10 text-accent",
    jpg: "bg-accent/10 text-accent",
    jpeg: "bg-accent/10 text-accent",
    gif: "bg-accent/10 text-accent",
    mp4: "bg-secondary/10 text-secondary",
    mp3: "bg-primary/10 text-primary",
    zip: "bg-para/10 text-para",
    md: "bg-heading/10 text-heading",
    txt: "bg-para/10 text-para",
    other: "bg-para-muted/10 text-para-muted",
  };

  return colors[fileType] || colors.other;
}
