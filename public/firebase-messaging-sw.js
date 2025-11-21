/* public/firebase-messaging-sw.js */
/* Use compat imports for the worker */
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyBssArFQ6uL1BmJDa1Ml2j4CaHnLkV0S4U",
  authDomain: "synctrip-firebase.firebaseapp.com",
  projectId: "synctrip-firebase",
  messagingSenderId: "75407427961",
  appId: "1:75407427961:web:3a448ecbf6d6ba42e447a8"
});

// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const title = payload.notification?.title || "New Notification";
  const options = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon-192.png",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickData = event.notification.data || {};
  let clickAction;

  try {
    clickAction = clickData.clickAction ? JSON.parse(clickData.clickAction) : null;
  } catch {
    clickAction = null;
  }

  let url = "/";

  if (clickAction?.type === "OPEN_CHAT") {
    url = `/chats?chatId=${clickAction.payload.conversationId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const c of clientList) {
        if ("focus" in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
