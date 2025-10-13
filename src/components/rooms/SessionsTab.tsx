"use client";

import React, { useState } from "react";
import {
  Video,
  Calendar,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import { format, isSameDay, isPast, isFuture, isToday } from "date-fns";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

interface Session {
  id: string;
  title: string;
  hostedBy: {
    name: string;
    avatar?: string;
    role?: string;
  };
  dateTime: Date;
  duration?: string;
  attendees: {
    count: number;
    confirmed?: number;
    avatars?: string[];
  };
  lectureSummary?: string;
  recordingUrl?: string;
  notesUrl?: string;
  status: "upcoming" | "completed" | "live";
  focusScore?: number;
}

// ═══════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════

const sampleSessions: Session[] = [
  {
    id: "1",
    title: "UI/UX Design Workshop",
    hostedBy: {
      name: "Dr. Sarah Johnson",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 15, 15, 0),
    duration: "1h 30m",
    attendees: {
      count: 24,
      confirmed: 18,
    },
    status: "upcoming",
  },
  {
    id: "2",
    title: "React State Management",
    hostedBy: {
      name: "Prof. Michael Chen",
      role: "Instructor",
    },
    dateTime: new Date(),
    duration: "2h",
    attendees: {
      count: 20,
      confirmed: 20,
    },
    status: "live",
  },
  {
    id: "3",
    title: "React Hooks Deep Dive",
    hostedBy: {
      name: "Dr. Sarah Johnson",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 10, 14, 0),
    duration: "1h 30m",
    attendees: {
      count: 18,
    },
    status: "completed",
    focusScore: 87,
    lectureSummary:
      "Covered useState, useEffect, useContext, and custom hooks. Discussed common pitfalls and best practices for React hooks. Students practiced building custom hooks for form handling and API calls.",
    recordingUrl: "/recordings/session-3",
    notesUrl: "/notes/session-3",
  },
  {
    id: "4",
    title: "Component Patterns Workshop",
    hostedBy: {
      name: "Dr. Sarah Johnson",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 8, 14, 0),
    duration: "2h",
    attendees: {
      count: 20,
    },
    status: "completed",
    focusScore: 92,
    recordingUrl: "/recordings/session-4",
    notesUrl: "/notes/session-4",
  },
  {
    id: "5",
    title: "Introduction to TypeScript",
    hostedBy: {
      name: "Prof. Michael Chen",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 5, 10, 0),
    duration: "1h 45m",
    attendees: {
      count: 22,
    },
    status: "completed",
    focusScore: 78,
    recordingUrl: "/recordings/session-5",
  },
];

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

const formatSessionDate = (date: Date, duration?: string) => {
  const today = isToday(date);
  const dateStr = today ? "Today" : format(date, "MMM d, yyyy");
  const timeStr = format(date, "h:mm a");

  if (duration) {
    return `${dateStr}, ${timeStr} • Duration: ${duration}`;
  }
  return `${dateStr}, ${timeStr}`;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ═══════════════════════════════════════════════════════════════════
// UPCOMING SESSION CARD
// ═══════════════════════════════════════════════════════════════════

function UpcomingSessionCard({ session }: { session: Session }) {
  const isLive = session.status === "live";

  return (
    <article className="bg-background border border-light-border rounded-lg p-4 sm:p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        {/* Left Side - Icon & Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-heading truncate">
            {session.title}
          </h3>
        </div>

        {/* Right Side - Live Badge */}
        {isLive && (
          <span className="px-3 py-1 bg-destructive text-white rounded-full text-xs font-medium whitespace-nowrap ml-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Live
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {/* Hosted By */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-para">
            <div className="relative left-[-5px]">
              <Avatar profileImage={session.hostedBy.avatar} size="md" />
            </div>
            <span>Hosted by {session.hostedBy.name}</span>
          </div>
          {session.hostedBy.role && (
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
              {session.hostedBy.role}
            </span>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Calendar className="w-4 h-4" />
          <span>{formatSessionDate(session.dateTime, session.duration)}</span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Users className="w-4 h-4" />
          <span>{session.attendees.count} participants</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {isLive ? (
          <Button size="sm" className="w-[150px]">
            <Video className="w-4 h-4 mr-2" />
            Join Session
          </Button>
        ) : (
          <Button size="sm" className="w-[150px]">
            <Clock className="w-4 h-4 mr-2" />
            Set Reminder
          </Button>
        )}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAST SESSION CARD
// ═══════════════════════════════════════════════════════════════════

function PastSessionCard({ session }: { session: Session }) {
  return (
    <article className="bg-background border border-light-border rounded-lg p-4 sm:p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        {/* Left Side - Icon & Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-6 h-6 text-para-muted" />
          </div>
          <h3 className="text-lg font-semibold text-heading truncate">
            {session.title}
          </h3>
        </div>

        {/* Right Side - Completed Badge */}
        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium whitespace-nowrap ml-2">
          Completed
        </span>
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {/* Hosted By */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-para">
            <div className="relative left-[-5px]">
              <Avatar profileImage={session.hostedBy.avatar} size="sm" />
            </div>
            <span>Hosted by {session.hostedBy.name}</span>
          </div>
          {session.hostedBy.role && (
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
              {session.hostedBy.role}
            </span>
          )}
        </div>

        {/* Date & Duration */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Calendar className="w-4 h-4" />
          <span>{formatSessionDate(session.dateTime, session.duration)}</span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Users className="w-4 h-4" />
          <span>{session.attendees.count} attendees</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap mt-4">
        <Button size="sm"  className="w-[170px]">
          <Users className="w-4 h-4 mr-2" />
          View Attendees
        </Button>
        {session.lectureSummary && (
          <Button size="sm" className="w-[195px]">
            <FileText className="w-4 h-4 mr-2" />
            View Lecture Summary
          </Button>
        )}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════════

function EmptyUpcomingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="w-12 h-12 text-para-muted mb-3" />
      <h3 className="text-lg font-semibold text-heading mb-1">
        No Upcoming Sessions
      </h3>
      <p className="text-sm text-para-muted">
        Schedule a session to get started
      </p>
    </div>
  );
}

function EmptyPastState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Video className="w-12 h-12 text-para-muted mb-3" />
      <h3 className="text-lg font-semibold text-heading mb-1">
        No Past Sessions
      </h3>
      <p className="text-sm text-para-muted">
        Completed sessions will appear here
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function SessionsTab() {
  const [sessions, setSessions] = useState<Session[]>(sampleSessions);

  // Separate sessions by status
  const upcomingSessions = sessions
    .filter((s) => s.status === "upcoming" || s.status === "live")
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const pastSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto bg-main-background">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-8">
        <Button size="sm" className="w-[150px]">
          <Video className="w-4 h-4 mr-2" />
          Start Session
        </Button>
        <Button size="sm" variant="outline" className="w-[150px]">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-heading mb-4">
            Upcoming Sessions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <UpcomingSessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}

      {upcomingSessions.length === 0 && <EmptyUpcomingState />}

      {/* Recent Sessions */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-heading mb-4">
          Recent Sessions
        </h2>
        {pastSessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastSessions.map((session) => (
              <PastSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <EmptyPastState />
        )}
      </section>
    </div>
  );
}
