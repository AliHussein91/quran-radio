self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('app-cache').then((cache) => {
			return cache.addAll([
				'/',
				'/index.html',
				'/main.css',
				'/main.js',
				'/icons/manifest-icon-192.maskable.png',
				'/icons/manifest-icon-512.maskable.png',
			]);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
