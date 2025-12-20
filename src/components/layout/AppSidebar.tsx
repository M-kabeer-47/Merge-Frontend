"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";
import {
  IconCompass,
  IconUsers,
  IconNotes,
  IconRobot,
  IconDashboard,
  IconCalendar,
} from "@tabler/icons-react";
import { useState } from "react";
import MobileNavbarOptions from "../navbar/MobileNavbarOptions";
import { useTheme } from "next-themes";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  children?: Links[];
}

const sidebarLinks: Links[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconDashboard className="h-5 w-5" />,
  },
  {
    label: "Discover",
    href: "/discover",
    icon: <IconCompass className="h-5 w-5" />,
  },
  {
    label: "Rooms",
    href: "/rooms",
    icon: <IconUsers className="h-5 w-5" />,
  },

  {
    label: "Notes",
    href: "/notes",
    icon: <IconNotes className="h-5 w-5" />,
  },

  {
    label: "AI Assistant",
    href: "/ai-assistant",
    icon: <IconRobot className="h-5 w-5" />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <IconCalendar className="h-5 w-5" />,
  },
];

// Custom SidebarLink component for path-based navigation
export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isActive = (href: string) => pathname.includes(href);
  const links = sidebarLinks;
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 min-h-screen">
        <div className="flex flex-1 flex-col overflow-x-hidden ">
          <div className="text-2xl font-raleway font-bold text-heading flex items-center gap-2 justify-start ml-2">
            {isDarkMode ? (
              <img
                src={"/dark-mode-logo.svg"}
                alt="Logo"
                className="h-10 w-10"
              />
            ) : (
              <img src={"/logo.svg"} alt="Logo" className="h-10 w-10" />
            )}
            {open ? <span>Merge</span> : null}
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                isActive={isActive(link.href)}
              />
            ))}
          </div>
          <MobileNavbarOptions onSignOut={() => console.log("Sign out")} />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
