const staticCacheName = 'olfx-static-v10';
//r contentRatesCache = 'olfx-content-rates';
const allCaches = [
  staticCacheName
];
//'countries.json',
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        '/js/main.js',
        '/css/styles.css',
        '/imgs/icon.png',

        '/currencies.json'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('olfx-') &&
                 !allCaches.includes(cacheName);
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
/*
    if (requestUrl.pathname.startsWith('/currencies/')) {
      event.respondWith(serveRates(event.request));
      return;
    }

  */

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
 
/////
/*
let serveRates = (request) => {
  let splits = request.url.split('/');
  let storageUrl = splits[splits.length - 1];

  return caches.open(contentRatesCache).then((cache) => {
    return cache.match(storageUrl).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

*/
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});