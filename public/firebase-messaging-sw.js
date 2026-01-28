/**
 * Firebase Messaging Service Worker
 * VERSION: 3.0.0 - Simplified using Firebase's standard onBackgroundMessage
 *
 * This runs in the background to receive push notifications
 * when the app is not open or not in focus.
 */

// Import Firebase scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAC6G0CNC1dGEkEy0-2QefRi_dfbzaeQ04",
  authDomain: "merge-7b4bf.firebaseapp.com",
  projectId: "merge-7b4bf",
  storageBucket: "merge-7b4bf.firebasestorage.app",
  messagingSenderId: "34731146067",
  appId: "1:34731146067:web:74a2e74ac35740a9e1bfa6"
});

// Get messaging instance
const messaging = firebase.messaging();

const DEFAULT_ICON = "/dark-mode-logo.svg";

/**
 * Handle foreground messages - send to client for toast
 * This runs BEFORE Firebase's internal handler
 */
self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      // Check if any client is focused
      const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      const focusedClient = windowClients.find((client) => client.focused);

      if (focusedClient && event.data) {
        // App is FOCUSED - send to client for toast, skip native notification
        let payload;
        try {
          payload = event.data.json();
        } catch (e) {
          return;
        }
        
        console.log("[SW] App focused, sending to client for toast");
        focusedClient.postMessage({
          type: "FCM_NOTIFICATION",
          payload: payload,
        });
      }
      // If no focused client, do nothing here - onBackgroundMessage will handle it
    })()
  );
});

/**
 * Handle background messages using Firebase's official API
 * This ONLY fires when the app is in the background/closed
 */
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const data = payload.data || {};
  
  // Use the data from the payload directly
  const title = data.announcementTitle || data.title || payload.notification?.title || "New Notification";
  const body = data.roomTitle || payload.notification?.body || "";
  
  // Build the action URL from the payload data
  const actionUrl = data.actionUrl || "/";

  const notificationOptions = {
    body: body,
    icon: DEFAULT_ICON,
    badge: DEFAULT_ICON,
    tag: data.announcementId || data.id || `notification-${Date.now()}`,
    data: {
      actionUrl: actionUrl,
      ...data
    },
    requireInteraction: true,
  };

  return self.registration.showNotification(title, notificationOptions);
});

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
