/**
 * useFocusAudioAlert — Synthesized two-tone beep when distraction is sustained.
 *
 * - Lazily creates a single AudioContext on the first user gesture
 *   (click / keydown / touchstart) so browser autoplay policy is satisfied.
 * - Fires when isDistracted has been true for ≥ sustainMs.
 * - Rate-limited: at most one beep per cooldownMs while distracted.
 * - Mute preference persists in localStorage.
 *
 * No audio assets — the beep is generated with OscillatorNode, so there is
 * nothing to fetch and nothing to bundle. Playback is purely local and does
 * not interact with LiveKit's published audio track.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MUTE_STORAGE_KEY = "focus-alert-muted";
const VOLUME_STORAGE_KEY = "focus-alert-volume";

interface Options {
  sustainMs?: number;
  cooldownMs?: number;
}

interface Return {
  muted: boolean;
  setMuted: (m: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}

export function useFocusAudioAlert(isDistracted: boolean, options: Options = {}): Return {
  const sustainMs = options.sustainMs ?? 600;
  const cooldownMs = options.cooldownMs ?? 5000;

  const [muted, setMutedState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "true";
  });
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === "undefined") return 0.7;
    const raw = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    const parsed = raw === null ? NaN : parseFloat(raw);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.7;
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const gestureUnlockedRef = useRef(false);
  const sustainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBeepAtRef = useRef(0);
  const mutedRef = useRef(muted);
  const volumeRef = useRef(volume);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next);
    try {
      window.localStorage.setItem(MUTE_STORAGE_KEY, String(next));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, []);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    setVolumeState(clamped);
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, []);

  // Lazy-unlock the AudioContext on first user gesture.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unlock = () => {
      if (gestureUnlockedRef.current) return;
      gestureUnlockedRef.current = true;

      const Ctor = window.AudioContext || (window as unknown as {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;
      if (!Ctor) return;

      try {
        const ctx = new Ctor();
        audioContextRef.current = ctx;
        if (ctx.state === "suspended") void ctx.resume();
      } catch {
        // Browser refused AudioContext creation — beeps silently disabled.
      }
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  const playBeep = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx || mutedRef.current) return;

    const schedule = () => {
      if (mutedRef.current) return;
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = volumeRef.current;
      master.connect(ctx.destination);

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        // Triangle carries a bit more "alarm" character than sine while
        // staying pleasant enough to avoid startling the user.
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(1, now + start + 0.01);
        gain.gain.setValueAtTime(1, now + start + duration - 0.02);
        gain.gain.linearRampToValueAtTime(0, now + start + duration);
        osc.connect(gain).connect(master);
        osc.start(now + start);
        osc.stop(now + start + duration + 0.02);
      };

      // Three ascending tones — recognisably an alert, not a notification.
      playTone(700, 0.0, 0.12);
      playTone(900, 0.14, 0.12);
      playTone(1200, 0.28, 0.18);
    };

    if (ctx.state === "suspended") {
      // resume() returns a Promise; we must schedule only after it resolves,
      // otherwise oscillators fire before the context is actually running
      // and you hear nothing.
      ctx.resume().then(schedule).catch(() => {
        /* resume failed — nothing to play */
      });
    } else {
      schedule();
    }
  }, []);

  // Distraction → beep lifecycle.
  useEffect(() => {
    if (!isDistracted) {
      if (sustainTimerRef.current) {
        clearTimeout(sustainTimerRef.current);
        sustainTimerRef.current = null;
      }
      return;
    }

    if (sustainTimerRef.current) return; // Already waiting

    sustainTimerRef.current = setTimeout(() => {
      sustainTimerRef.current = null;
      const now = Date.now();
      if (now - lastBeepAtRef.current < cooldownMs) return;
      lastBeepAtRef.current = now;
      playBeep();
    }, sustainMs);

    return () => {
      if (sustainTimerRef.current) {
        clearTimeout(sustainTimerRef.current);
        sustainTimerRef.current = null;
      }
    };
  }, [isDistracted, sustainMs, cooldownMs, playBeep]);

  return { muted, setMuted, volume, setVolume };
}
