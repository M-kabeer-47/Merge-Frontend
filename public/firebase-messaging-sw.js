/**
 * Firebase Messaging Service Worker
 * VERSION: 4.0.0 - With dedup, focused-check, and config from main app
 *
 * Firebase config is passed from the main app via postMessage during
 * SW registration. Falls back to stored config in IndexedDB.
 */

// Import Firebase scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const DEFAULT_ICON = "/dark-mode-logo.svg";

let messaging = null;

// Initialize Firebase with config (called once)
function initFirebase(config) {
  if (firebase.apps.length > 0) return;
  try {
    firebase.initializeApp(config);
    messaging = firebase.messaging();
    setupBackgroundHandler();
    console.log("[SW] Firebase initialized with provided config");
  } catch (e) {
    console.error("[SW] Firebase init failed:", e);
  }
}

// Try to load config from IndexedDB cache (for when SW starts without a client message)
async function loadCachedConfig() {
  try {
    const cache = await caches.open("firebase-config");
    const response = await cache.match("config");
    if (response) {
      const config = await response.json();
      initFirebase(config);
    }
  } catch (e) {
    // No cached config available
  }
}

// Save config to cache for future SW restarts
async function cacheConfig(config) {
  try {
    const cache = await caches.open("firebase-config");
    await cache.put("config", new Response(JSON.stringify(config)));
  } catch (e) {
    // Caching failed, non-critical
  }
}

// Listen for config from main app
self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG") {
    const config = event.data.config;
    cacheConfig(config);
    initFirebase(config);
  }
});

// Try to init from cache on SW startup
loadCachedConfig();

/**
 * Setup background message handler
 * Called after Firebase is initialized
 */
function setupBackgroundHandler() {
  if (!messaging) return;

  messaging.onBackgroundMessage(async (payload) => {
    console.log("[SW] Background message received:", payload);

    // If a client is focused, skip native notification (handled via onMessage in main app)
    const windowClients = await clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    if (windowClients.some((client) => client.focused)) {
      console.log("[SW] Client focused, skipping native notification");
      return;
    }

    const data = payload.data || {};
    const notification = payload.notification || {};

    const title = data.title || data.announcementTitle || notification.title || "New Notification";
    const body = data.body || data.roomTitle || notification.body || "";
    const actionUrl = data.actionUrl || "/";

    const notificationOptions = {
      body: body,
      icon: DEFAULT_ICON,
      badge: DEFAULT_ICON,
      tag: data.announcementId || data.assignmentId || data.quizId || `notification-${Date.now()}`,
      data: {
        actionUrl: actionUrl,
        ...data
      },
      requireInteraction: true,
    };

    return self.registration.showNotification(title, notificationOptions);
  });
}

/**
 * Handle notification click - navigate to the action URL
 */
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.data);

  event.notification.close();

  const urlToOpen = event.notification.data?.actionUrl
    ? self.location.origin + event.notification.data.actionUrl
    : self.location.origin;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Try to focus an existing window
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open a new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
