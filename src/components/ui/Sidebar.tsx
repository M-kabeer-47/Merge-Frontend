"use client";
import { cn } from "@/lib/shadcn/utils";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  IconMenu2,
  IconX,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import NotificationDropdown from "../navbar/Notifications";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  children?: Links[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-main-background border-r border-light-border w-[300px] shrink-0 shadow-sm",
          className
        )}
        animate={{
          width: animate ? (open ? "240px" : "80px") : "240px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-main-background border-b border-light-border w-full shadow-sm"
        )}
        {...props}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={"/logo.svg"} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-raleway font-bold text-heading">
              Merge
            </span>
          </div>
          <div className="flex items-center gap-5 h-full">
            <NotificationDropdown />
            {/* Menu Button */}
            <IconMenu2
              className="text-heading cursor-pointer hover:text-primary transition-colors h-6 w-6"
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white p-6 z-[100] flex flex-col",
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-heading cursor-pointer hover:text-primary transition-colors"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  isActive,
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  isActive?: boolean;
}) => {
  const { open, animate } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = link.children && link.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };
  useEffect(() => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  }, [open]);

  return (
    <div className="w-full font-raleway ">
      {/* Main Link */}
      <a
        href={hasChildren ? "#" : link.href}
        className={cn(
          "text-para flex items-center justify-between gap-3 group/sidebar py-2.5 hover:bg-secondary/5 rounded-lg px-3 transition-all duration-200  hover:text-primary border-transparent hover:border-primary/20",
          isActive && "bg-secondary/5 text-primary",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div
            className={` group-hover/sidebar:text-primary transition-colors duration-200 ${
              isActive ? "text-primary" : "text-para-muted"
            }`}
          >
            {link.icon}
          </div>
          <motion.span
            animate={{
              display: animate
                ? open
                  ? "inline-block"
                  : "none"
                : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="font-bold text-sm transition-transform duration-200 whitespace-pre inline-block !p-0 !m-0"
          >
            {link.label}
          </motion.span>
        </div>

        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <motion.div className="flex items-center">
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <IconChevronDown className="h-4 w-4 text-para-muted group-hover/sidebar:text-primary transition-colors" />
            </motion.div>
          </motion.div>
        )}
      </a>

      {/* Children Links */}
      {hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.div
                animate={{
                  display: animate ? (open ? "block" : "none") : "block",
                }}
                className="ml-3 relative"
              >
                {/* Vertical Line */}
                <div className="absolute  left-2 top-0 bottom-0 w-[2px] bg-secondary/20" />

                {/* Child Links */}
                <div className="space-y-1 py-2">
                  {link.children!.map((child, index) => (
                    <motion.div key={child.href} className="relative pl-4">
                      {/* Horizontal connector line */}

                      <a
                        href={child.href}
                        className="flex items-center gap-3 py-2 px-3 text-sm text-para hover:text-primary hover:bg-secondary/10 rounded-md transition-all duration-200 group/child"
                      >
                        <span className="font-bold  transition-transform duration-200">
                          {child.label}
                        </span>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
