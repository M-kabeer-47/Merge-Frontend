/**
 * Firebase Messaging Service Worker
 * VERSION: 2.4.0 - Added focus check to prevent duplicate notifications
 *
 * This runs in the background to receive push notifications
 * when the app is not open or not in focus.
 * 
 * When app is focused: FCM foreground handler in React shows toast
 * When app is NOT focused: This service worker shows native push
 */

const DEFAULT_ICON_PATH = "/dark-mode-logo.svg";

const resolveUrl = (value) => {
  if (!value) return null;
  try {
    return new URL(value, self.registration.scope).toString();
  } catch (e) {
    if (typeof value === "string" && value.startsWith("/")) {
      return self.location.origin + value;
    }
    return value;
  }
};

const buildActionUrl = (payload, data) => {
  let actionUrl = data.actionUrl;

  // Check if metadata is nested or a stringified JSON
  if (!actionUrl && data.metadata) {
    if (typeof data.metadata === "object") {
      actionUrl = data.metadata.actionUrl;
    } else if (typeof data.metadata === "string") {
      try {
        const parsedMetadata = JSON.parse(data.metadata);
        actionUrl = parsedMetadata.actionUrl;
      } catch (e) {
        console.log("[SW] Failed to parse metadata string:", e);
      }
    }
  }

  if (!actionUrl && payload?.fcmOptions?.link) {
    actionUrl = payload.fcmOptions.link;
  }

  if (!actionUrl && payload?.notification?.click_action) {
    actionUrl = payload.notification.click_action;
  }

  // FALLBACK: Construct URL from data fields if actionUrl is still missing
  if (!actionUrl && data.roomId) {
    if (data.type === "assignment" && data.assignmentId) {
      actionUrl = `/rooms/${data.roomId}/assignments/${data.assignmentId}`;
    } else if (data.type === "quiz" && data.quizId) {
      // Assuming quiz URL structure matches assignments or uses a specific route
      // Adjust this path if your quiz route is different
      actionUrl = `/rooms/${data.roomId}/quizzes/${data.quizId}`;
    } else if (data.type === "announcement" || data.type === "session") {
      // Announcements usually in the room view or specific tab
      actionUrl = `/rooms/${data.roomId}`;
    } else {
      // Default to room page
      actionUrl = `/rooms/${data.roomId}`;
    }
  }

  // Construct absolute URL if it is relative
  if (actionUrl && actionUrl.startsWith("/")) {
    actionUrl = self.location.origin + actionUrl;
  }

  return actionUrl || self.location.origin;
};

const showNotificationFromPayload = async (payload) => {
  console.log("[SW] Push payload received:", payload);
  console.log("[SW] Raw Data:", payload?.data);
  console.log("[SW] Notification Object:", payload?.notification);

  const data = payload?.data || {};

  const actionUrl = payload.actionUrl || buildActionUrl(payload, data);

  // Use data from payload
  const notificationTitle =
    data.content || payload?.notification?.title || "New Notification";
  const roomTitle = data.roomTitle || payload?.notification?.body || "";

  // Prefer icon provided by payload; otherwise fall back to app logo
  const iconCandidate =
    data.icon ||
    data.iconUrl ||
    payload?.notification?.icon ||
    DEFAULT_ICON_PATH;

  const badgeCandidate =
    data.badge ||
    data.badgeUrl ||
    payload?.notification?.badge ||
    DEFAULT_ICON_PATH;

  const imageCandidate =
    data.image ||
    data.imageUrl ||
    payload?.notification?.image ||
    null;

  const iconUrl = resolveUrl(iconCandidate);
  const badgeUrl = resolveUrl(badgeCandidate);
  const imageUrl = resolveUrl(imageCandidate);

  console.log("[SW] Using icon URL:", iconUrl);
  if (badgeUrl) console.log("[SW] Using badge URL:", badgeUrl);
  if (imageUrl) console.log("[SW] Using image URL:", imageUrl);
  
  const notificationOptions = {
    body: roomTitle,
    icon: iconUrl,
    badge: badgeUrl || iconUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    tag: data.id || `notification-${Date.now()}`, // Unique tag per notification
    data: {
      actionUrl, // Store resolved absolute URL
      ...data,
    },
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  console.log("[SW] Calling showNotification with:", notificationTitle, notificationOptions);

  try {
    await self.registration.showNotification(notificationTitle, notificationOptions);
    console.log("[SW] ✅ showNotification succeeded!");
  } catch (error) {
    console.error("[SW] ❌ showNotification FAILED:", error);
  }
};

// Push listener to handle all FCM pushes (data-only and notification payloads)
self.addEventListener("push", (event) => {
  console.log("[SW] Push event received:", event);

  if (!event.data) return;

  event.waitUntil(
    (async () => {
      // Check if any app window is focused - if so, FCM foreground handler handles it
      const windowClients = await clients.matchAll({ 
        type: "window", 
        includeUncontrolled: true 
      });
      
      console.log("[SW] Found window clients:", windowClients.length);
      windowClients.forEach((client, index) => {
        console.log(`[SW] Client ${index}:`, {
          focused: client.focused,
          visibilityState: client.visibilityState,
          url: client.url
        });
      });
      
      // If ANY client exists (browser tab is open, even if not focused)
      // Send to React instead of showing native notification
      if (windowClients.length > 0) {
        console.log("[SW] App is open (focused or not), sending to React for cache update");
        
        // Parse payload first
        let payload;
        try {
          payload = event.data.json();
        } catch (e) {
          try {
            const text = await event.data.text();
            payload = JSON.parse(text);
          } catch (err) {
            console.log("[SW] Failed to parse push payload:", err);
            return;
          }
        }
        
        // Send to the first available client (or focused one if available)
        const targetClient = windowClients.find(client => client.focused) || windowClients[0];
        if (targetClient) {
          targetClient.postMessage({
            type: 'FCM_NOTIFICATION',
            payload: payload
          });
          console.log("[SW] Sent notification to React client");
        }
        return;
      }

      // No clients - browser is completely closed
      console.log("[SW] No app clients found, showing native notification");

      let payload;
      try {
        payload = event.data.json();
      } catch (e) {
        try {
          const text = await event.data.text();
          payload = JSON.parse(text);
        } catch (err) {
          console.log("[SW] Failed to parse push payload:", err);
          return;
        }
      }

      await showNotificationFromPayload(payload);
    })(),
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event);
  console.log("[SW] Notification data:", event.notification.data);

  event.notification.close();

  // Get the URL to open
  const urlToOpen = event.notification.data?.actionUrl || self.location.origin;
  
  console.log("[SW] Opening URL:", urlToOpen);

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          // Navigate existing window to the URL
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
