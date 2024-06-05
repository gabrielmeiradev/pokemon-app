const CACHE_NAME_STATIC = "cache";
const CACHE_NAME_DYNAMIC = "dynamic";

self.addEventListener("install", function (event) {
  console.log("Instalando o Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then(function (cache) {
      console.log(cache)
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("Ativando o Service Worker");
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          return caches.open(CACHE_NAME_DYNAMIC).then(function (cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
        })
        .catch(function (err) {
          return caches.match(event.request);
        })
    );
  }
});