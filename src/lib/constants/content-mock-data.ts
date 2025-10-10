import { ContentItem, ContentOwner } from "@/types/content";

// Sample owners
const sampleOwners: ContentOwner[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=2f1a58&color=fff",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=8668c0&color=fff",
  },
  {
    id: "3",
    name: "Alice Martinez",
    avatar: "https://ui-avatars.com/api/?name=Alice+Martinez&background=e69a29&color=fff",
  },
  {
    id: "4",
    name: "Bob Williams",
    avatar: "https://ui-avatars.com/api/?name=Bob+Williams&background=2f1a58&color=fff",
  },
];

// Sample content items
export const sampleContentItems: ContentItem[] = [
  // Folders
  {
    id: "folder-1",
    name: "Week 1 - Intro",
    type: "folder",
    owner: sampleOwners[0],
    createdAt: new Date("2024-09-01"),
    modifiedAt: new Date("2024-10-05"),
    itemCount: 12,
    subfolders: 2,
    files: 10,
    tags: ["lectures", "introduction"],
    description: "Introduction materials and first week content",
  },
  {
    id: "folder-2",
    name: "Assignments",
    type: "folder",
    owner: sampleOwners[0],
    createdAt: new Date("2024-09-01"),
    modifiedAt: new Date("2024-10-08"),
    itemCount: 8,
    subfolders: 0,
    files: 8,
    tags: ["assignments", "homework"],
    description: "Course assignments and submission templates",
  },
  {
    id: "folder-3",
    name: "Slides",
    type: "folder",
    owner: sampleOwners[1],
    createdAt: new Date("2024-09-02"),
    modifiedAt: new Date("2024-10-07"),
    itemCount: 15,
    subfolders: 3,
    files: 12,
    tags: ["presentations", "lectures"],
  },
  {
    id: "folder-4",
    name: "Reference Papers",
    type: "folder",
    owner: sampleOwners[0],
    createdAt: new Date("2024-09-01"),
    modifiedAt: new Date("2024-09-20"),
    itemCount: 24,
    subfolders: 4,
    files: 20,
    tags: ["research", "papers", "reading"],
    description: "Academic papers and research materials",
  },
  {
    id: "folder-5",
    name: "Project Resources",
    type: "folder",
    owner: sampleOwners[2],
    createdAt: new Date("2024-09-10"),
    modifiedAt: new Date("2024-10-09"),
    itemCount: 18,
    subfolders: 2,
    files: 16,
    tags: ["projects", "resources"],
    description: "Resources and templates for course projects",
  },
  // Files
  {
    id: "file-1",
    name: "Lecture1.pdf",
    type: "file",
    fileType: "pdf",
    owner: sampleOwners[0],
    createdAt: new Date("2024-09-05"),
    modifiedAt: new Date("2024-09-05"),
    size: 2516582, // 2.4 MB
    tags: ["lecture", "week1"],
    description: "Introduction to Course - Week 1 Lecture",
    versionHistory: [
      {
        id: "v1",
        version: 1,
        modifiedAt: new Date("2024-09-05"),
        modifiedBy: sampleOwners[0],
        size: 2516582,
      },
    ],
  },
  {
    id: "file-2",
    name: "Syllabus.docx",
    type: "file",
    fileType: "docx",
    owner: sampleOwners[0],
    createdAt: new Date("2024-09-01"),
    modifiedAt: new Date("2024-09-15"),
    size: 122880, // 120 KB
    tags: ["syllabus", "course-info"],
    description: "Course syllabus and schedule",
    versionHistory: [
      {
        id: "v2",
        version: 2,
        modifiedAt: new Date("2024-09-15"),
        modifiedBy: sampleOwners[0],
        size: 122880,
      },
      {
        id: "v1",
        version: 1,
        modifiedAt: new Date("2024-09-01"),
        modifiedBy: sampleOwners[0],
        size: 115200,
      },
    ],
  },
  {
    id: "file-3",
    name: "Diagram.png",
    type: "file",
    fileType: "png",
    owner: sampleOwners[1],
    createdAt: new Date("2024-09-08"),
    modifiedAt: new Date("2024-09-08"),
    size: 460800, // 450 KB
    tags: ["diagram", "visual"],
    description: "System architecture diagram",
    previewUrl: "https://placehold.co/800x600/2f1a58/white?text=Architecture+Diagram",
  },
  {
    id: "file-4",
    name: "Assignment1.zip",
    type: "file",
    fileType: "zip",
    owner: sampleOwners[0],
    createdAt: new Date("2024-09-12"),
    modifiedAt: new Date("2024-09-12"),
    size: 8597145, // 8.2 MB
    tags: ["assignment", "submission"],
    description: "Assignment 1 - Starter files and instructions",
  },
  {
    id: "file-5",
    name: "Notes.md",
    type: "file",
    fileType: "md",
    owner: sampleOwners[2],
    createdAt: new Date("2024-09-20"),
    modifiedAt: new Date("2024-10-01"),
    size: 10240, // 10 KB
    tags: ["notes", "markdown"],
    description: "Course notes in markdown format",
  },
  {
    id: "file-6",
    name: "Presentation.pptx",
    type: "file",
    fileType: "pptx",
    owner: sampleOwners[1],
    createdAt: new Date("2024-09-18"),
    modifiedAt: new Date("2024-09-25"),
    size: 5242880, // 5 MB
    tags: ["presentation", "slides"],
    description: "Week 3 presentation slides",
  },
  {
    id: "file-7",
    name: "DataSet.xlsx",
    type: "file",
    fileType: "xlsx",
    owner: sampleOwners[3],
    createdAt: new Date("2024-09-22"),
    modifiedAt: new Date("2024-09-22"),
    size: 358400, // 350 KB
    tags: ["data", "spreadsheet"],
    description: "Sample dataset for analysis",
  },
  {
    id: "file-8",
    name: "Tutorial.mp4",
    type: "file",
    fileType: "mp4",
    owner: sampleOwners[1],
    createdAt: new Date("2024-09-25"),
    modifiedAt: new Date("2024-09-25"),
    size: 15728640, // 15 MB
    tags: ["video", "tutorial"],
    description: "Video tutorial for module 2",
  },
  {
    id: "file-9",
    name: "Podcast.mp3",
    type: "file",
    fileType: "mp3",
    owner: sampleOwners[2],
    createdAt: new Date("2024-09-28"),
    modifiedAt: new Date("2024-09-28"),
    size: 7340032, // 7 MB
    tags: ["audio", "podcast"],
    description: "Guest lecture podcast episode",
  },
  {
    id: "file-10",
    name: "Screenshot.jpg",
    type: "file",
    fileType: "jpg",
    owner: sampleOwners[3],
    createdAt: new Date("2024-10-02"),
    modifiedAt: new Date("2024-10-02"),
    size: 1048576, // 1 MB
    tags: ["image", "screenshot"],
    previewUrl: "https://placehold.co/1200x800/8668c0/white?text=Screenshot",
  },
];

// Breadcrumb samples
export const sampleBreadcrumbs = [
  { id: "room", name: "Advanced JavaScript", path: "/rooms/123" },
  { id: "root", name: "Content", path: "/rooms/123/content" },
];

export const sampleBreadcrumbsNested = [
  { id: "room", name: "Advanced JavaScript", path: "/rooms/123" },
  { id: "root", name: "Content", path: "/rooms/123/content" },
  { id: "folder-1", name: "Week 1 - Intro", path: "/rooms/123/content/folder-1" },
];
