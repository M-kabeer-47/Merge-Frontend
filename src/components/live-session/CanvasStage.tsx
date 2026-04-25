"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import * as Y from "yjs";
import { Eye } from "lucide-react";

// ───── Yjs sync protocol constants ─────
const MSG_SYNC = 0;
const MSG_AWARENESS = 1;
const MSG_SYNC_STEP1 = 0;
const MSG_SYNC_STEP2 = 1;
const MSG_YJS_UPDATE = 2;

// Record types that are local-only (never synced)
const LOCAL_ONLY_TYPES = new Set([
  "instance",
  "instance_page_state",
  "camera",
  "pointer",
  "instance_presence",
]);

interface CanvasStageProps {
  sessionId: string;
  canDraw: boolean;
  backendUrl: string;
  token: string;
}

export default function CanvasStage({
  sessionId,
  canDraw,
  backendUrl,
  token,
}: CanvasStageProps) {
  // Use state (not ref) so effects re-run when editor becomes available
  const [editor, setEditor] = useState<Editor | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  // Create Yjs doc once
  const ydoc = useMemo(() => new Y.Doc(), []);

  useEffect(() => {
    return () => { ydoc.destroy(); };
  }, [ydoc]);

  // Connect to Yjs WebSocket server
  useEffect(() => {
    if (!sessionId || !backendUrl || !token) return;

    const wsUrl = backendUrl.replace(/^http/, "ws");
    const ws = new WebSocket(`${wsUrl}/yjs/${sessionId}?token=${token}`);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[CanvasYjs] Connected to Yjs server");
      setConnected(true);

      // Send sync step 1 (our state vector)
      const sv = Y.encodeStateVector(ydoc);
      const msg = new Uint8Array(2 + sv.length);
      msg[0] = MSG_SYNC;
      msg[1] = MSG_SYNC_STEP1;
      msg.set(sv, 2);
      ws.send(msg);
    };

    ws.onmessage = (event) => {
      const data = new Uint8Array(event.data as ArrayBuffer);
      if (data.length < 2) return;

      const msgType = data[0];
      if (msgType === MSG_SYNC) {
        const syncType = data[1];
        const payload = data.slice(2);

        if (syncType === MSG_SYNC_STEP1) {
          // Server wants our state — send sync step 2
          const update = Y.encodeStateAsUpdate(ydoc, payload);
          const response = new Uint8Array(2 + update.length);
          response[0] = MSG_SYNC;
          response[1] = MSG_SYNC_STEP2;
          response.set(update, 2);
          ws.send(response);
        } else if (syncType === MSG_SYNC_STEP2 || syncType === MSG_YJS_UPDATE) {
          // Apply remote update — mark origin so we don't echo it back
          Y.applyUpdate(ydoc, payload, "remote");
        }
      }
    };

    ws.onclose = () => {
      console.log("[CanvasYjs] Disconnected from Yjs server");
      setConnected(false);
    };

    ws.onerror = (err) => {
      console.error("[CanvasYjs] WebSocket error:", err);
    };

    // Send local Yjs updates to server (skip remote-originated ones)
    const handleDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return;
      if (ws.readyState !== WebSocket.OPEN) return;

      const msg = new Uint8Array(2 + update.length);
      msg[0] = MSG_SYNC;
      msg[1] = MSG_YJS_UPDATE;
      msg.set(update, 2);
      ws.send(msg);
    };

    ydoc.on("update", handleDocUpdate);

    return () => {
      ydoc.off("update", handleDocUpdate);
      ws.close();
      wsRef.current = null;
    };
  }, [sessionId, backendUrl, token, ydoc]);

  // ─── Bridge: tldraw store ↔ Yjs doc ──────────────────────────────
  useEffect(() => {
    if (!editor) return;

    const ymap = ydoc.getMap("tldraw");

    // ── Remote Yjs → tldraw ──
    // Use the YMapEvent to apply only the changed keys (incremental)
    const observer = (event: Y.YMapEvent<unknown>, txn: Y.Transaction) => {
      // Skip changes that originated from our own tldraw → Yjs push
      if (txn.origin === "local") return;

      try {
        editor.store.mergeRemoteChanges(() => {
          const toRemove: string[] = [];
          const toPut: unknown[] = [];

          event.changes.keys.forEach((change, key) => {
            if (change.action === "add" || change.action === "update") {
              const record = ymap.get(key);
              if (record) toPut.push(record);
            } else if (change.action === "delete") {
              toRemove.push(key);
            }
          });

          if (toRemove.length > 0) {
            editor.store.remove(toRemove as never[]);
          }
          if (toPut.length > 0) {
            editor.store.put(toPut as never[]);
          }
        });
      } catch (err) {
        console.error("[CanvasYjs] Error applying remote changes:", err);
      }
    };

    ymap.observe(observer);

    // ── Seed: if the Yjs doc already has state (late joiner), apply it ──
    if (ymap.size > 0) {
      try {
        const toPut: unknown[] = [];
        ymap.forEach((value) => { toPut.push(value); });
        if (toPut.length > 0) {
          editor.store.mergeRemoteChanges(() => {
            editor.store.put(toPut as never[]);
          });
        }
      } catch (err) {
        console.error("[CanvasYjs] Error seeding initial state:", err);
      }
    }

    // ── Local tldraw → Yjs ──
    const unsub = editor.store.listen(
      ({ changes }) => {
        if (!canDraw) return;

        // Use "local" origin so the ymap observer above skips these
        ydoc.transact(() => {
          const { added, updated, removed } = changes;

          for (const record of Object.values(added)) {
            if (LOCAL_ONLY_TYPES.has(record.typeName)) continue;
            ymap.set(record.id, JSON.parse(JSON.stringify(record)));
          }

          for (const [, to] of Object.values(updated)) {
            if (LOCAL_ONLY_TYPES.has(to.typeName)) continue;
            ymap.set(to.id, JSON.parse(JSON.stringify(to)));
          }

          for (const record of Object.values(removed)) {
            if (LOCAL_ONLY_TYPES.has(record.typeName)) continue;
            ymap.delete(record.id);
          }
        }, "local");
      },
      { source: "user", scope: "document" }
    );

    return () => {
      ymap.unobserve(observer);
      unsub();
    };
  }, [editor, ydoc, canDraw]);

  const handleMount = useCallback((e: Editor) => {
    setEditor(e);
    if (!canDraw) {
      e.updateInstanceState({ isReadonly: true });
    }
  }, [canDraw]);

  // Update read-only state when canDraw changes
  useEffect(() => {
    if (!editor) return;
    editor.updateInstanceState({ isReadonly: !canDraw });
  }, [editor, canDraw]);

  return (
    <div className="w-full h-full relative">
      {/* Read-only banner */}
      {!canDraw && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[300] pointer-events-none">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            <Eye className="w-4 h-4" />
            <span>View only</span>
          </div>
        </div>
      )}

      {/* Connection indicator */}
      <div className="absolute top-3 right-3 z-[300] pointer-events-none">
        <div className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} title={connected ? "Connected" : "Disconnected"} />
      </div>

      <Tldraw
        onMount={handleMount}
        autoFocus
      />
    </div>
  );
}
