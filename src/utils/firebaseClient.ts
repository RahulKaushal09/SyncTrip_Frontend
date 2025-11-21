// utils/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID!,
};

let messaging: ReturnType<typeof getMessaging> | null = null;

export function initFirebaseClient() {
  if (typeof window === "undefined") return null;
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  try {
    messaging = getMessaging();
  } catch (e) {
    messaging = null;
  }
  return messaging;
}

/**
 * Ask permission + get FCM token (public)
 */
export async function requestFcmToken() {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  // register service worker (if not already)
  try {
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch (err) {
    console.warn("Service worker registration failed", err);
  }

  initFirebaseClient();
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY!,
    });

    return currentToken || null;
  } catch (err) {
    console.error("getToken error", err);
    return null;
  }
}

export function onForegroundNotification(callback: (payload: any) => void) {
  initFirebaseClient();
  if (!messaging) return () => {};
  return onMessage(messaging as any, callback as any);
}
