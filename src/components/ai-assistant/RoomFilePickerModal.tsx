"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronRight,
  Folder,
  FileText,
  Image,
  File,
  Users,
  Search,
  Loader2,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import SearchBar from "@/components/ui/SearchBar";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import useFetchRoomContent from "@/hooks/rooms/use-fetch-room-content";
import { isRoomContentFolder } from "@/types/room-content";
import type { RoomContentFile } from "@/types/room-content";
import type { ContextFile } from "@/types/ai-chat";
import { formatFileSize } from "@/utils/file-helpers";

interface RoomFilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: ContextFile) => void;
}

export default function RoomFilePickerModal({
  isOpen,
  onClose,
  onSelectFile,
}: RoomFilePickerModalProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [roomSearch, setRoomSearch] = useState("");

  // Fetch rooms
  const { rooms, isLoading: loadingRooms } = useGetUserRooms({
    filter: "all",
    search: roomSearch,
  });

  // Fetch room content (only when a room is selected)
  const {
    folders,
    files,
    breadcrumb,
    roomInfo,
    isLoading: loadingContent,
    isFetching: fetchingContent,
  } = useFetchRoomContent({
    roomId: selectedRoomId || "",
    folderId,
  });

  const handleSelectRoom = (roomId: string, roomTitle: string) => {
    setSelectedRoomId(roomId);
    setSelectedRoomName(roomTitle);
    setFolderId(null);
  };

  const handleBack = () => {
    if (folderId) {
      // Go up one level in breadcrumb
      if (breadcrumb.length > 1) {
        setFolderId(breadcrumb[breadcrumb.length - 2].id);
      } else {
        setFolderId(null);
      }
    } else {
      // Back to room selection
      setSelectedRoomId(null);
      setSelectedRoomName("");
    }
  };

  const handleFolderClick = (targetFolderId: string) => {
    setFolderId(targetFolderId);
  };

  const handleFileSelect = (file: RoomContentFile) => {
    const contextFile: ContextFile = {
      id: file.id,
      name: file.originalName,
      type: file.mimeType,
      roomName: roomInfo?.title || selectedRoomName,
      roomId: selectedRoomId!,
      size: file.size,
      url: file.filePath,
    };
    onSelectFile(contextFile);
    handleClose();
  };

  const handleClose = () => {
    setSelectedRoomId(null);
    setSelectedRoomName("");
    setFolderId(null);
    setRoomSearch("");
    onClose();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <Image className="w-5 h-5 text-green-500" />;
    if (mimeType === "application/pdf") return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.includes("document") || mimeType.includes("docx"))
      return <FileText className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-para-muted" />;
  };

  const isContentLoading = loadingContent || fetchingContent;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedRoomId ? "Select a File" : "Select a Room"}
      description={
        selectedRoomId
          ? `Browsing files in ${selectedRoomName}`
          : "Choose a room to browse its files"
      }
      maxWidth="2xl"
    >
      <div className="min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          {!selectedRoomId ? (
            /* Step 1: Room Selection */
            <motion.div
              key="rooms"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Search */}
              <SearchBar onSearch={setRoomSearch} placeholder="Search rooms..." />

              {/* Room List */}
              {loadingRooms ? (
                <div className="flex flex-col gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-4 rounded-xl bg-secondary/5">
                      <div className="w-10 h-10 rounded-lg bg-secondary/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 bg-secondary/20 rounded" />
                        <div className="h-3 w-24 bg-secondary/20 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-10 h-10 text-para-muted mb-3" />
                  <p className="text-sm font-medium text-heading">
                    {roomSearch ? "No rooms found" : "No rooms available"}
                  </p>
                  <p className="text-xs text-para-muted mt-1">
                    {roomSearch ? "Try a different search term" : "Join or create a room first"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleSelectRoom(room.id, room.title)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-light-border hover:border-primary/30 hover:bg-secondary/5 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-heading truncate">
                          {room.title}
                        </h4>
                        {room.description && (
                          <p className="text-xs text-para-muted truncate mt-0.5">
                            {room.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-para-muted flex-shrink-0">
                        <Users className="w-3.5 h-3.5" />
                        <span>{room.memberCount}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-para-muted group-hover:text-primary transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Step 2: Content Browser */
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Navigation Header */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  className="p-1.5 rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-para" />
                </button>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-sm overflow-x-auto">
                  <button
                    onClick={() => setFolderId(null)}
                    className="text-primary hover:underline whitespace-nowrap font-medium"
                  >
                    {selectedRoomName}
                  </button>
                  {breadcrumb.map((crumb) => (
                    <React.Fragment key={crumb.id}>
                      <ChevronRight className="w-3.5 h-3.5 text-para-muted flex-shrink-0" />
                      <button
                        onClick={() => setFolderId(crumb.id)}
                        className="text-primary hover:underline whitespace-nowrap"
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Content List */}
              {isContentLoading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-secondary/5">
                      <div className="w-8 h-8 rounded bg-secondary/20" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-4 w-48 bg-secondary/20 rounded" />
                        <div className="h-3 w-20 bg-secondary/20 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : folders.length === 0 && files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Folder className="w-10 h-10 text-para-muted mb-3" />
                  <p className="text-sm font-medium text-heading">
                    This folder is empty
                  </p>
                  <p className="text-xs text-para-muted mt-1">
                    No files or folders found here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {/* Folders */}
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleFolderClick(folder.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Folder className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-heading truncate">
                          {folder.name}
                        </p>
                        <p className="text-xs text-para-muted">
                          {folder.totalItems} item{folder.totalItems !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-para-muted group-hover:text-primary transition-colors flex-shrink-0" />
                    </button>
                  ))}

                  {/* Files */}
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded bg-background flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-heading truncate group-hover:text-primary transition-colors">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-para-muted">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
