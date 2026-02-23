export interface Session {
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
