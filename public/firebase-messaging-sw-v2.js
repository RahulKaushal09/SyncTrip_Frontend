/* public/firebase-messaging-sw-v2.js */

importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBssArFQ6uL1BmJDa1Ml2j4CaHnLkV0S4U",
  authDomain: "synctrip-firebase.firebaseapp.com",
  projectId: "synctrip-firebase",
  messagingSenderId: "75407427961",
  appId: "1:75407427961:web:3a448ecbf6d6ba42e447a8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/LogoWB.png",
    badge: "/badge.png", // optional: small badge icon
    data: payload.data || {}, // important: pass data for click handling
    tag: payload.data?.notificationId || 'default-tag', // prevents duplicates
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 🔥 IMPROVED CLICK HANDLER
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event);

  event.notification.close();

  const data = event.notification.data || {};
  let clickAction;

  try {
    clickAction = data.clickAction ? JSON.parse(data.clickAction) : null;
  } catch (e) {
    console.error("Failed to parse clickAction", e);
    clickAction = null;
  }

  let targetUrl = "/notifications"; // fallback: go to notifications page
  debugger;
  if (clickAction) {
    switch (clickAction.type) {
      case "OPEN_CHAT":
        if (clickAction.payload.conversationId) {
          targetUrl = `/chats?chatId=${clickAction.payload.conversationId}`;
        }
        break;
      case "GROUP_DETAILS":
        if (clickAction.payload.groupTripId && clickAction.payload.tripId) {
          targetUrl = `/userTrip/${clickAction.payload.tripId}/groups/${clickAction.payload.groupTripId}`;
        }
        break;
      case "OPEN_PROFILE":
        if (clickAction.payload.profileId) {
          targetUrl = `/profile/${clickAction.payload.profileId}`;
        }
        break;
      case "OPEN_TRIP":
        if (clickAction.payload.tripId) {
          targetUrl = `/trips/${clickAction.payload.tripId}`;
        }
        break;
      case "OPEN_MATCH":
        // same as chat usually
        if (clickAction.payload.conversationId) {
          targetUrl = `/chats?chatId=${clickAction.payload.conversationId}`;
        }
        break;
      default:
        targetUrl = "/";
    }
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If any tab is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(targetUrl.split('?')[0]) || client.url === '/') {
          return client.focus().then(() => client.navigate(targetUrl));
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});