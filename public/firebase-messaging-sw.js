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

messaging.onBackgroundMessage(function(payload) {
  // payload.notification and payload.data
  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || 'Notification';
  const options = {
    body: notification.body || "",
    icon: notification.icon || "/icons/icon-192.png",
    data,
    // optionally add vibrate, tag, renotify, actions
  };
  self.registration.showNotification(title, options);
});

// handle notification click to deep link
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  let clickAction = null;
  try {
    clickAction = event.notification.data?.clickAction ? JSON.parse(event.notification.data.clickAction) : null;
  } catch (e) { clickAction = null; }

  const urlToOpen = (clickAction && clickAction.type === 'OPEN_CHAT' && clickAction.payload?.conversationId)
    ? `/chats?chatId=${clickAction.payload.conversationId}` : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
