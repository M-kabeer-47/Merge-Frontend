/**
 * AttendeesPanel Component
 * 
 * Displays grid of all attendees in the live session with search/filter capabilities.
 */

"use client";

import React, { useState, useMemo } from "react";
import { Search, Users, Crown, Shield, User, Filter } from "lucide-react";
import AttendeeCard from "./AttendeeCard";
import type { Attendee } from "@/types/live-session";

interface AttendeesPanelProps {
  attendees: Attendee[];
  isHost?: boolean;
  onMuteAttendee?: (id: string) => void;
  onStopCamera?: (id: string) => void;
  onGrantCanvasEdit?: (id: string) => void;
  onPromoteAttendee?: (id: string) => void;
  onRemoveAttendee?: (id: string) => void;
}

type RoleFilter = "all" | "host" | "co-host" | "participant";
type StatusFilter = "all" | "speaking" | "raised-hand" | "screen-sharing";

export default function AttendeesPanel({
  attendees,
  isHost = false,
  onMuteAttendee,
  onStopCamera,
  onGrantCanvasEdit,
  onPromoteAttendee,
  onRemoveAttendee,
}: AttendeesPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter attendees based on search and filters
  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      // Search filter
      const matchesSearch = attendee.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole =
        roleFilter === "all" || attendee.role === roleFilter;

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "speaking") {
        matchesStatus = attendee.speakerActive;
      } else if (statusFilter === "raised-hand") {
        matchesStatus = attendee.raiseHand;
      } else if (statusFilter === "screen-sharing") {
        matchesStatus = attendee.screenSharing;
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [attendees, searchQuery, roleFilter, statusFilter]);

  // Count attendees by status
  const speakingCount = attendees.filter((a) => a.speakerActive).length;
  const raisedHandCount = attendees.filter((a) => a.raiseHand).length;
  const screenSharingCount = attendees.filter((a) => a.screenSharing).length;

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-light-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-heading">
              Attendees
            </h2>
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
              {attendees.length}
            </span>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              p-2 rounded-lg transition-colors
              ${showFilters ? "bg-secondary/10 text-secondary" : "hover:bg-secondary/5 text-para"}
            `}
            aria-label="Toggle filters"
            title="Filter attendees"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
          <input
            type="text"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/5 border border-light-border rounded-lg text-para placeholder:text-para-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-secondary/5 rounded-lg space-y-3">
            {/* Role Filter */}
            <div>
              <label className="block text-xs font-medium text-para-muted mb-1.5">
                Filter by Role
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`
                    flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${roleFilter === "all" ? "bg-primary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  <User className="w-3 h-3 inline mr-1" />
                  All
                </button>
                <button
                  onClick={() => setRoleFilter("host")}
                  className={`
                    flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${roleFilter === "host" ? "bg-primary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  <Crown className="w-3 h-3 inline mr-1" />
                  Host
                </button>
                <button
                  onClick={() => setRoleFilter("co-host")}
                  className={`
                    flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${roleFilter === "co-host" ? "bg-primary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  <Shield className="w-3 h-3 inline mr-1" />
                  Co-Host
                </button>
                <button
                  onClick={() => setRoleFilter("participant")}
                  className={`
                    flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${roleFilter === "participant" ? "bg-primary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  Participant
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-para-muted mb-1.5">
                Filter by Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${statusFilter === "all" ? "bg-primary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("speaking")}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1
                    ${statusFilter === "speaking" ? "bg-primary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  Speaking
                  {speakingCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                      {speakingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setStatusFilter("raised-hand")}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1
                    ${statusFilter === "raised-hand" ? "bg-accent text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  Raised Hand
                  {raisedHandCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                      {raisedHandCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setStatusFilter("screen-sharing")}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1
                    ${statusFilter === "screen-sharing" ? "bg-secondary text-white" : "bg-white border border-light-border text-para hover:bg-secondary/5"}
                  `}
                >
                  Sharing
                  {screenSharingCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                      {screenSharingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
          <div className="mt-2 flex items-center justify-between text-xs text-para-muted">
            <span>
              Showing {filteredAttendees.length} of {attendees.length}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Attendees Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredAttendees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAttendees.map((attendee) => (
              <AttendeeCard
                key={attendee.id}
                attendee={attendee}
                isHost={isHost}
                onMute={onMuteAttendee}
                onStopCamera={onStopCamera}
                onGrantCanvasEdit={onGrantCanvasEdit}
                onPromote={onPromoteAttendee}
                onRemove={onRemoveAttendee}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Users className="w-12 h-12 text-para-muted mb-3" />
            <p className="text-para font-medium">No attendees found</p>
            <p className="text-sm text-para-muted mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
