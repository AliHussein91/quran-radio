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
				'favicon/favicon-32x32.png',
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

	if (event.request.mode === 'navigate') {
		// For navigation requests, return cached index.html as fallback
		event.respondWith(
			fetch(event.request).catch(() => caches.match('/index.html'))
		);
	} else {
		// Cache-first for other resources
		event.respondWith(
			caches.match(event.request).then((response) => {
				return response || fetch(event.request);
			})
		);
	}
});
