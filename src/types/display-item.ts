// Shared display item interface for list/grid views
// Both notes and room content can be adapted to this interface

export interface BaseDisplayItem {
  id: string;
  name: string;
  isFolder: boolean;
  updatedAt: Date | string;
  // Optional metadata
  metadata?: string; // e.g., "3 items" or "2.5 MB"
  owner?: string; // Owner/uploader name
  filePath?: string;
  // For file type icons
  iconType?:
    | "folder"
    | "pdf"
    | "document"
    | "presentation"
    | "spreadsheet"
    | "image"
    | "video"
    | "audio"
    | "archive"
    | "code"
    | "file"
    | "note";
  iconColor?: string; // Tailwind color class for icon
}

export interface MenuOption {
  title: string;
  action: () => void;
}
