"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";
import {
  IconHome,
  IconCompass,
  IconUsers,
  IconPlus,
  IconLogin,
  IconFolder,
  IconVideo,
  IconNotes,
  IconPalette,
  IconBrush,
  IconFolderOpen,
  IconRobot,
  IconChevronDown,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  children?: Links[];
}

const sidebarLinks: Links[] = [
  {
    label: "Dashboard",
    href: "/with-layout/dashboard",
    icon: <IconHome className="h-5 w-5" />,
  },
  {
    label: "Discover",
    href: "/with-layout/discover",
    icon: <IconCompass className="h-5 w-5" />,
  },
  {
    label: "Rooms",
    href: "/with-layout/rooms",
    icon: <IconUsers className="h-5 w-5" />,
    children: [
      {
        label: "Create Room",
        href: "/with-layout/rooms/create",
        icon: <IconPlus className="h-4 w-4" />,
      },
      {
        label: "Join Room",
        href: "/with-layout/rooms/join",
        icon: <IconLogin className="h-4 w-4" />,
      },
      {
        label: "My Rooms",
        href: "/with-layout/rooms/my-rooms",
        icon: <IconFolder className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Live Session",
    href: "/with-layout/live-session",
    icon: <IconVideo className="h-5 w-5" />,
  },
  {
    label: "Notes",
    href: "/with-layout/notes",
    icon: <IconNotes className="h-5 w-5" />,
  },
  {
    label: "Canvas",
    href: "/with-layout/canvas",
    icon: <IconPalette className="h-5 w-5" />,
    children: [
      {
        label: "Create Canvas",
        href: "/with-layout/canvas/create",
        icon: <IconBrush className="h-4 w-4" />,
      },
      {
        label: "My Canvases",
        href: "/with-layout/canvas/my-canvases",
        icon: <IconFolderOpen className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "AI Assistant",
    href: "/with-layout/ai-assistant",
    icon: <IconRobot className="h-5 w-5" />,
  },
];

// Custom SidebarLink component for path-based navigation
export default function AppSidebar({
  user,
}: {
  user: { name: string; role: string; initials: string; avatar?: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const links = sidebarLinks;
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div className="text-2xl font-raleway font-bold text-heading flex items-center gap-2 justify-start ml-2">
            <img src={"/logo.svg"} alt="Logo" className="h-10 w-10" />
            {open ? <span>Merge</span> : null}
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div></div>
      </SidebarBody>
    </Sidebar>
  );
}
