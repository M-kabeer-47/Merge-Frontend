/**
 * Firebase Messaging Service Worker
 * VERSION: 4.2.0 - High compatibility push handling
 */

// Import Firebase scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const DEFAULT_ICON = "/dark-mode-logo.svg";
let messaging = null;

// Force immediate activation
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

// Robust push handler to prevent generic "background update" message
self.addEventListener("push", (event) => {
  if (!event.data) return;

  event.waitUntil(
    (async () => {
      let payload;
      try {
        payload = event.data.json();
      } catch (e) {
        console.warn("[SW] Non-JSON push payload");
        return;
      }

      const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const isAppFocused = windowClients.some((client) => client.focused);

      if (isAppFocused) {
        // Main app NotificationProvider will handle via onMessage
        return;
      }

      const data = payload.data || {};
      const notification = payload.notification || {};

      const title = 
        notification.title || 
        data.title || 
        data.announcementTitle || 
        data.assignmentTitle || 
        data.quizTitle || 
        "New Notification";

      const body = 
        notification.body || 
        data.body || 
        data.assignmentTitle || 
        data.quizTitle || 
        data.announcementTitle || 
        data.roomTitle || 
        "";

      const actionUrl = data.actionUrl || "/";

      return self.registration.showNotification(title, {
        body: body,
        icon: DEFAULT_ICON,
        badge: DEFAULT_ICON,
        tag: data.announcementId || data.assignmentId || data.quizId || `notification-${Date.now()}`,
        data: {
          actionUrl: actionUrl,
          ...data
        },
        requireInteraction: true,
      });
    })()
  );
});

function setupBackgroundHandler() {
  if (!messaging) return;
  messaging.onBackgroundMessage(async (payload) => {
    // Keep SDK happy
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.actionUrl
    ? self.location.origin + event.notification.data.actionUrl
    : self.location.origin;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

loadCachedConfig();
