self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => self.clients.claim());

self.addEventListener("message", async e => {
  const data = e.data;
  if (data.action === "notifyUnlock") {
    const title = "Site Unlocked!";
    const options = {
      body: `${data.siteName} is now ready to visit`,
      icon: data.icon || "/icons/icon-192.png"
    };
    self.registration.showNotification(title, options);
  }
});
