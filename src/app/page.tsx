"use client";
import React from "react";
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
} from "@tabler/icons-react";
import { motion } from "motion/react";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconHome className="h-5 w-5" />,
  },
  {
    label: "Discover",
    href: "/discover",
    icon: <IconCompass className="h-5 w-5" />,
  },
  {
    label: "Rooms",
    href: "#",
    icon: <IconUsers className="h-5 w-5" />,
    children: [
      {
        label: "Create Room",
        href: "/rooms/create",
        icon: <IconPlus className="h-4 w-4" />,
      },
      {
        label: "Join Room",
        href: "/rooms/join",
        icon: <IconLogin className="h-4 w-4" />,
      },
      {
        label: "My Rooms",
        href: "/rooms/my-rooms",
        icon: <IconFolder className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Live Session",
    href: "/live-session",
    icon: <IconVideo className="h-5 w-5" />,
  },
  {
    label: "Notes",
    href: "/notes",
    icon: <IconNotes className="h-5 w-5" />,
  },
  {
    label: "Canvas",
    href: "#",
    icon: <IconPalette className="h-5 w-5" />,
    children: [
      {
        label: "Create Canvas",
        href: "/canvas/create",
        icon: <IconBrush className="h-4 w-4" />,
      },
      {
        label: "My Canvases",
        href: "/canvas/my-canvases",
        icon: <IconFolderOpen className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "AI Assistant",
    href: "/ai-assistant",
    icon: <IconRobot className="h-5 w-5" />,
  },
];

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 px-3">
                <motion.div
                  className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white font-bold text-sm">M</span>
                </motion.div>
                <span className="text-xl font-raleway font-semibold text-heading">
                  Merge
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-para-muted">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading truncate">
                  John Doe
                </p>
                <p className="text-xs text-para-muted truncate">
                  Student
                </p>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-raleway font-bold text-heading">
                Welcome to Merge
              </h1>
              <p className="text-para-muted mt-1">
                Your collaborative learning platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-heading">Create Room</h3>
                    <p className="text-sm text-para-muted">
                      Start collaborating
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <IconBrush className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-heading">New Canvas</h3>
                    <p className="text-sm text-para-muted">
                      Create & draw
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <IconVideo className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-heading">Live Session</h3>
                    <p className="text-sm text-para-muted">
                      Join live learning
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconRobot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-heading">AI Assistant</h3>
                    <p className="text-sm text-para-muted">
                      Get help & guidance
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-heading mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconUsers className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-heading">
                      Joined "Math Study Group"
                    </p>
                    <p className="text-sm text-para-muted">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <IconPalette className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-heading">
                      Created new canvas "Project Ideas"
                    </p>
                    <p className="text-sm text-para-muted">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <IconNotes className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-heading">
                      Added notes to "React Fundamentals"
                    </p>
                    <p className="text-sm text-para-muted">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
