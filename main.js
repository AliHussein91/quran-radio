const body = document.querySelector('body');

const player = document.querySelector('.audio-player');
player.autoplay = false;

const play = document.querySelector('.play');
const pause = document.querySelector('.pause');

const STREAM_URL = 'https://quran-radio.meetali.online/radio/8s5u5tpdtwzuv';

play.addEventListener('click', () => {
	player.src = STREAM_URL + '?cacheBuster=' + new Date().getTime();
	player.play().catch((err) => {
		console.error('Autoplay blocked:', err);
	});
	pause.disabled = false;
	play.disabled = true;
	play.classList.add('hidden');
	pause.classList.remove('hidden');
});

pause.addEventListener('click', () => {
	player.pause();
	pause.disabled = true;
	play.disabled = false;
	play.classList.remove('hidden');
	pause.classList.add('hidden');
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((reg) => console.log('Service Worker registered:', reg))
			.catch((err) => console.log('Service Worker failed:', err));
	});
}

let deferredPrompt;

const installBtn = document.querySelector('.installBtn');

// Helper: hide install button
function hideInstallButton() {
	if (installBtn) {
		installBtn.style.display = 'none';
	}
}

// Helper: show install button
function showInstallButton() {
	if (installBtn) {
		installBtn.style.display = 'block';
	}
}

// Detect if already installed (standalone mode)
const isInStandaloneMode =
	window.matchMedia('(display-mode: standalone)').matches ||
	window.navigator.standalone === true;

if (isInStandaloneMode) {
	hideInstallButton();
} else {
	window.addEventListener('beforeinstallprompt', (e) => {
		// Prevent Chrome’s mini-infobar
		e.preventDefault();
		deferredPrompt = e;

		showInstallButton();

		installBtn?.addEventListener(
			'click',
			async () => {
				hideInstallButton();

				if (!deferredPrompt) return;

				// Show the browser install prompt
				deferredPrompt.prompt();

				const {outcome} = await deferredPrompt.userChoice;

				// Clear the saved event
				deferredPrompt = null;
			},
			{once: true}
		);
	});
}

// When successfully installed
window.addEventListener('appinstalled', () => {
	hideInstallButton();
});
