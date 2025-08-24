// A version for your cache
const CACHE_VERSION = 'v1';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				'/',
				'/index.html',
				'/main.css',
				'/main.js',
				'/manifest.json', // Add the manifest
				'/assets/bg-full.webp',
				'/fonts/ArefRuqaa-Bold.ttf',
				'/fonts/ArefRuqaa-Regular.ttf',
				'/favicon/favicon-32x32.png',
				'/icons/manifest-icon-192.maskable.png',
				'/icons/manifest-icon-512.maskable.png',
				'/icons/apple-icon-180.png',
			]);
		})
	);
});

// Add this new 'activate' event listener
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					// If the cache name isn't the current one, delete it
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);

	// 🔹 If it's the radio stream, bypass the cache and go directly to the network
	if (url.pathname.startsWith('/radio/')) {
		// We don't return here so the browser handles it, ensuring live data
		return;
	}

	// For navigation requests (e.g., loading the page)
	if (event.request.mode === 'navigate') {
		event.respondWith(
			// Try the network first
			fetch(event.request).catch(() => {
				// If the network fails, serve the cached index.html
				return caches.match('/index.html');
			})
		);
	}
	// For all other requests (CSS, JS, images, fonts)
	else {
		event.respondWith(
			// Try to find the request in the cache first
			caches.match(event.request).then((response) => {
				// Return the cached response if it exists, otherwise fetch from the network
				return response || fetch(event.request);
			})
		);
	}
});
