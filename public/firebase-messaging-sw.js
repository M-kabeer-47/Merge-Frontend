/**
 * Firebase Messaging Service Worker
 * VERSION: 4.3.0 - Fixed "Site updated in background" and Redirects
 */

// Import Firebase scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const DEFAULT_ICON = "/dark-mode-logo.svg";
let messaging = null;

// Force immediate activation and control of all clients
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

function initFirebase(config) {
  if (firebase.apps.length > 0) return;
  try {
    firebase.initializeApp(config);
    messaging = firebase.messaging();
    setupBackgroundHandler();
    console.log("[SW] Firebase initialized");
  } catch (e) {
    console.error("[SW] Firebase init failed:", e);
  }
}

async function loadCachedConfig() {
  try {
    const cache = await caches.open("firebase-config");
    const response = await cache.match("config");
    if (response) {
      const config = await response.json();
      initFirebase(config);
    }
  } catch (e) {}
}

async function cacheConfig(config) {
  try {
    const cache = await caches.open("firebase-config");
    await cache.put("config", new Response(JSON.stringify(config)));
  } catch (e) {}
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG") {
    cacheConfig(event.data.config);
    initFirebase(event.data.config);
  }
});

/**
 * FIXED PUSH HANDLER
 * Ensures showNotification is ALWAYS called and awaited.
 */
self.addEventListener("push", (event) => {
  console.log("[SW] Push received", event);
  
  if (!event.data) {
    console.warn("[SW] Push event but no data");
    return;
  }

  // We MUST return the promise to event.waitUntil to prevent "Site updated in background"
  event.waitUntil(
    (async () => {
      let payload;
      try {
        payload = event.data.json();
      } catch (e) {
        console.error("[SW] Push data was not JSON", e);
        // Show a fallback so we don't get the default browser warning
        return self.registration.showNotification("New Notification", {
          body: "Click to view updates",
          icon: DEFAULT_ICON
        });
      }

      console.log("[SW] Payload parsed:", payload);

      const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      
      // Only skip if the app is actually FOCUSED
      const isAppFocused = windowClients.some((client) => client.focused);
      if (isAppFocused) {
        console.log("[SW] App focused, letting onMessage handle it");
        return;
      }

      const data = payload.data || {};
      const notification = payload.notification || {};

      // PRIORITY 1: Values explicitly in the 'notification' block from FCM
      // PRIORITY 2: Values in our custom 'data' block
      // PRIORITY 3: Hardcoded defaults
      const title = 
        notification.title || 
        data.title || 
        data.announcementTitle || 
        data.assignmentTitle || 
        data.quizTitle || 
        "New Update";

      const body = 
        notification.body || 
        data.body || 
        data.assignmentTitle || 
        data.quizTitle || 
        data.announcementTitle || 
        data.roomTitle || 
        "Click to see what's new";

      // IMPORTANT: Absolute URL for the icon
      const icon = self.location.origin + DEFAULT_ICON;

      return self.registration.showNotification(title, {
        body: body,
        icon: icon,
        badge: icon,
        // Tag prevents duplicate popups for the same entity
        tag: data.announcementId || data.assignmentId || data.quizId || `notification-${Date.now()}`,
        data: {
          // Pass the actionUrl into the notification metadata for the click handler
          actionUrl: data.actionUrl || "/",
        },
        requireInteraction: true,
      });
    })()
  );
});

/**
 * FIXED CLICK HANDLER
 * Correctly prepends the origin to relative paths.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const actionUrl = event.notification.data?.actionUrl || "/";
  // Ensure the URL is absolute
  const targetUrl = actionUrl.startsWith('http') 
    ? actionUrl 
    : self.location.origin + actionUrl;

  console.log("[SW] Notification clicked. Target:", targetUrl);

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // 1. Try to find an existing tab to focus
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.navigate(targetUrl).then(c => c.focus());
        }
      }
      // 2. If no tab open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

function setupBackgroundHandler() {
  if (!messaging) return;
  // This is a dummy to keep FCM SDK happy
  messaging.onBackgroundMessage((p) => {
    console.log("[SW] SDK onBackgroundMessage fired (redundant)");
  });
}

loadCachedConfig();
