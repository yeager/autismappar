const CACHE_NAME = 'bokstavsresan-v2.0.0-piper';
const CACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './piper-tts.js',
  './manifest.json',
  './icons/icon.svg',
  // Piper TTS Assets - these are large and will be cached on-demand
  './tts-assets/sherpa-onnx-tts.js',
  './tts-assets/sherpa-onnx-wasm-main-tts.js'
];

// Large TTS assets to cache on-demand (WASM and model files)
const TTS_ASSETS = [
  './tts-assets/sherpa-onnx-wasm-main-tts.wasm',
  './tts-assets/vits-piper-sv_SE-nst-medium/sv_SE-nst-medium.onnx',
  './tts-assets/vits-piper-sv_SE-nst-medium/tokens.txt',
  './tts-assets/vits-piper-sv_SE-nst-medium/sv_SE-nst-medium.onnx.json'
];

// Install event - cache all resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        // For TTS assets, cache them after first download
        const isLargeTTSAsset = TTS_ASSETS.some(asset => event.request.url.includes(asset));
        
        return fetch(event.request).then(fetchResponse => {
          // Check if we received a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          
          // Cache TTS assets after successful download
          if (isLargeTTSAsset || CACHE_URLS.some(url => event.request.url.includes(url))) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => console.log('Cache put failed:', error));
          }
          
          return fetchResponse;
        });
      })
      .catch(() => {
        // If both cache and network fail, return offline page
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});