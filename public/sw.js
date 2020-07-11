/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
workbox.loadModule('workbox-strategies');

const registerRoute = workbox.routing.registerRoute;
const strategies = workbox.strategies;
const ExpirationPlugin = workbox.expiration.ExpirationPlugin;

registerRoute( //js comes from network whenver possible
  ({request}) => request.destination === 'script',
  new strategies.NetworkFirst()
);
registerRoute( //cache css styles
  ({request}) => request.destination === 'style',
  new strategies.StaleWhileRevalidate({
    cacheName: 'css-cache',
  })
);
registerRoute( //cache iamges
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