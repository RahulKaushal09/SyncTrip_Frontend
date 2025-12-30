// utils/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage , type MessagePayload} from "firebase/messaging";
import { firebaseApp } from "./firebaseApp";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APPID!,
// };

let messaging: ReturnType<typeof getMessaging> | null = null;


export function initFirebaseClient() {
  if (typeof window === "undefined") return null;
  // if (!getApps().length) {
  //   initializeApp(firebaseConfig);
  // }
  try {
    messaging = getMessaging(firebaseApp);
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
  if (!("serviceWorker" in navigator)) return null;

  // 1. Register SW first
  let reg;
  try {
    reg = await navigator.serviceWorker.register("/firebase-messaging-sw-v2.js");
    // console.log("FCM SW registered:", reg.scope);
  } catch (err) {
    console.error("SW register failed", err);
    return null;
  }

  initFirebaseClient();
  if (!messaging) return null;

  // 2. Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  // 3. Generate token WITH THE SW
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY!,
      serviceWorkerRegistration: reg,    // ← THIS MUST BE HERE
    });

    // console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.error("getToken error:", err);
    return null;
  }
}
export function onForegroundNotification(
  callback: (payload: MessagePayload) => void
) {
  initFirebaseClient();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}


export async function requestNotificationPermissionOnly() {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}