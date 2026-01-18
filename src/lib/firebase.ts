/**
 * Firebase Configuration
 *
 * Initializes Firebase app and exports messaging utilities.
 * Used for FCM push notifications.
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on client side and only once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Messaging instance (only available in browser)
let messaging: Messaging | null = null;

/**
 * Get Firebase Messaging instance
 * Returns null if not in browser or service workers not supported
 */
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (!("Notification" in window)) return null;

  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
}

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null if permission denied
 */
export async function requestFCMToken(): Promise<string | null> {
  const messaging = getFirebaseMessaging();
  if (!messaging) return null;

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("[FCM] Notification permission denied");
      return null;
    }

    // Get VAPID key from env
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey || vapidKey === "YOUR_VAPID_KEY_HERE") {
      console.error("[FCM] VAPID key not configured");
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("[FCM] Token obtained:", token.slice(0, 20) + "...");
    return token;
  } catch (error) {
    console.error("[FCM] Error getting token:", error);
    return null;
  }
}

/**
 * Subscribe to foreground messages
 * @param callback Function to call when a message is received while app is in focus
 */
export function onForegroundMessage(
  callback: (payload: any) => void,
): () => void {
  const messaging = getFirebaseMessaging();
  if (!messaging) return () => {};

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("[FCM] Foreground message received:", payload);
    callback(payload);
  });

  return unsubscribe;
}

export { app };
