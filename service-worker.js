self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('app-cache').then((cache) => {
			return cache.addAll([
				'/',
				'/index.html',
				'/main.css',
				'/main.js',
				'/assets/bg-full.webp',
        '/fonts/ArefRuqaa-Bold.ttf',
        '/fonts/ArefRuqaa-Regular.ttf',
				'/icons/manifest-icon-192.maskable.png',
				'/icons/manifest-icon-512.maskable.png',
			]);
		})
	);
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);

	// 🔹 If it's the radio stream, bypass SW and go directly to network
	if (url.pathname.startsWith('/radio/')) {
		return;
	}

	// Otherwise use cache-first strategy
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
