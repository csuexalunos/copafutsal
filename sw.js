// Service worker: recebe os avisos de jogo (Web Push) e mostra a notificação.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { corpo: event.data && event.data.text() }; }
  const base = self.registration.scope;
  event.waitUntil(
    self.registration.showNotification(d.titulo || "Copa Santa Úrsula", {
      body: d.corpo || "",
      icon: base + "icon-192.png",
      badge: base + "favicon.png",
      tag: d.tag || "jogo",
      renotify: true,
      data: { url: d.url || base },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lista) => {
      for (const c of lista) if (c.url.startsWith(self.registration.scope) && "focus" in c) return c.focus();
      return self.clients.openWindow(url);
    })
  );
});
