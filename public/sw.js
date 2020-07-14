/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
workbox.loadModule('workbox-strategies');
const registerRoute = workbox.routing.registerRoute;
const strategies = workbox.strategies;
const ExpirationPlugin = workbox.expiration.ExpirationPlugin;
const OFFLINE_VERSION = 1; // Incrementing OFFLINE_VERSION will kick off the install event and force
const CACHE_NAME = 'offline'; // previously cached resources to be updated from the network.
const OFFLINE_URL = '/';

registerRoute( //js comes from network whenever possible
  ({request}) => request.destination === 'script',
  new strategies.NetworkFirst()
);
registerRoute( //cache css styles
  ({request}) => request.destination === 'style',
  new strategies.StaleWhileRevalidate({
    cacheName: 'css-cache',
  })
);
registerRoute( //cache images
  ({request}) => request.destination === 'image',
  new strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 604800,
      })
    ],
  })
);
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'})); // ensures that the response isn't fulfilled from the HTTP cache (will be from the network)
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => { // Enable navigation preload if it's supported.
    if ('navigationPreload' in self.registration) { // See https://developers.google.com/web/updates/2017/02/navigation-preload
      await self.registration.navigationPreload.enable();
    }
  })());
  self.clients.claim(); // Tell the active service worker to take control of the page immediately.
});
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') { // We only want to call event.respondWith() if this is a navigation request
    event.respondWith((async () => { // for an HTML page.
      try { // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) { // catch would likely be triggered due to a network error
        // If fetch() returns a valid HTTP response with a response code in the 4-5 range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
});
  // If our if() condition is false, then this fetch handler won't intercept the request
  // If there are any other fetch handlers registered, they will get a chance to call event.respondWith()
  // If no fetch handlers call event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement