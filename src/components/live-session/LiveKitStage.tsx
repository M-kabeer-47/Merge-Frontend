"use client";

import React, { useEffect } from "react";
import {
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
  VideoTrack,
  AudioTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicOff, Users, Hand } from "lucide-react";

interface LiveKitStageProps {
  sessionTitle: string;
  screenSharing: boolean;
  raisedHands?: Record<string, boolean>;
}

/**
 * Renders actual LiveKit video/audio tracks in the main stage area.
 * Replaces the mock participant tiles with real video feeds.
 */
export default function LiveKitStage({
  sessionTitle,
  screenSharing,
  raisedHands = {},
}: LiveKitStageProps) {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  // Get all video and screen share tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Separate screen share tracks from camera tracks
  const screenShareTracks = tracks.filter(
    (t) => t.source === Track.Source.ScreenShare && t.publication?.track
  );
  const cameraTracks = tracks.filter(
    (t) => t.source === Track.Source.Camera
  );
  const audioTracks = tracks.filter(
    (t) => t.source === Track.Source.Microphone && t.publication?.track
  );

  const allParticipants = [localParticipant, ...remoteParticipants];

  return (
    <>
      {/* Render all audio tracks (invisible) */}
      {audioTracks.map((trackRef) =>
        trackRef.publication?.track &&
        trackRef.participant.sid !== localParticipant.sid ? (
          <AudioTrack
            key={trackRef.participant.sid + "-audio"}
            trackRef={trackRef}
          />
        ) : null
      )}

      {/* Main Content Area */}
      <div className="absolute inset-6 bottom-[200px] flex items-center justify-center">
        {screenShareTracks.length > 0 ? (
          // Show screen share as main content
          <div className="w-full h-full bg-[#2a2a2a] rounded-2xl overflow-hidden border-2 border-primary/20">
            <VideoTrack
              trackRef={screenShareTracks[0] as any}
              className="w-full h-full object-contain"
            />
          </div>
        ) : cameraTracks.length > 0 && cameraTracks.some(t => t.publication?.track) ? (
          // Show active speaker or first camera as main view
          <div className="w-full h-full bg-[#2a2a2a] rounded-2xl overflow-hidden relative">
            {(() => {
              const activeCam = cameraTracks.find(t => t.publication?.track);
              if (activeCam && activeCam.publication) {
                return (
                  <VideoTrack
                    trackRef={activeCam as any}
                    className="w-full h-full object-cover"
                  />
                );
              }
              return null;
            })()}
          </div>
        ) : (
          // No video - show session info
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {sessionTitle}
            </h2>
            <p className="text-white/60">
              {allParticipants.length} participants in session
            </p>
          </div>
        )}
      </div>

      {/* Participants Strip at Bottom */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allParticipants.map((participant) => {
            const camTrack = cameraTracks.find(
              (t) => t.participant.sid === participant.sid
            );
            const hasCam = camTrack?.publication?.track != null;
            const isMuted = !participant.isMicrophoneEnabled;
            const isLocal = participant.sid === localParticipant.sid;
            const displayName = participant.name || participant.identity || "Unknown";
            const isHandRaised = raisedHands[participant.identity] || false;

            return (
              <div
                key={participant.sid}
                className={`
                  relative flex-shrink-0 w-[180px] h-[135px] rounded-xl overflow-hidden
                  ${participant.isSpeaking ? "ring-4 ring-primary" : "ring-2 ring-white/10"}
                  ${isHandRaised ? "ring-2 ring-[#f9ab00]" : ""}
                  bg-[#2a2a2a] transition-all
                `}
              >
                {/* Hand Raise Indicator */}
                {isHandRaised && (
                  <div className="absolute top-2 right-2 p-1.5 bg-[#f9ab00] rounded-full animate-bounce z-10">
                    <Hand className="w-3.5 h-3.5 text-white" fill="white" />
                  </div>
                )}
                {hasCam && camTrack && camTrack.publication ? (
                  <VideoTrack
                    trackRef={camTrack as any}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                      {displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  </div>
                )}

                {/* Participant Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white truncate flex-1">
                      {displayName}
                      {isLocal && " (You)"}
                    </span>
                    <div className="flex items-center gap-1">
                      {isHandRaised && (
                        <div className="w-5 h-5 rounded bg-[#f9ab00] flex items-center justify-center">
                          <Hand className="w-3 h-3 text-white" fill="white" />
                        </div>
                      )}
                      {isMuted && (
                        <div className="w-5 h-5 rounded bg-destructive/90 flex items-center justify-center">
                          <MicOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
