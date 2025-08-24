// --- In-App Browser Detection ---
(function() {
    const isFacebookApp = /FBAV|FBAN/.test(navigator.userAgent);

    if (isFacebookApp) {
        // Create a banner element
        const banner = document.createElement('div');
        banner.innerHTML = `
            <p>لأفضل تجربة ولتتمكن من تثبيت التطبيق، يرجى الضغط على القائمة (⋮) واختيار "فتح في المتصفح".</p>
            <style>
                #in-app-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: #ffc107; /* A noticeable yellow color */
                    color: #000;
                    text-align: center;
                    padding: 12px;
                    font-size: 14px;
                    z-index: 1000;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    font-family: sans-serif;
                }
            </style>
        `;
        banner.id = 'in-app-banner';
        document.body.prepend(banner);
    }
})();

// --- DOM Elements ---
const player = document.querySelector('.audio-player');
const playBtn = document.querySelector('.play');
const pauseBtn = document.querySelector('.pause');
const installBtn = document.querySelector('.installBtn');

// --- Constants ---
const STREAM_URL = 'https://quran-radio.meetali.online/radio/8s5u5tpdtwzuv';

// --- Player Logic ---
player.autoplay = false;

/**
 * Updates the UI of the player controls.
 * @param {boolean} isPlaying - True if the audio is currently playing.
 */
function updatePlayerState(isPlaying) {
	if (isPlaying) {
		pauseBtn.disabled = false;
		playBtn.disabled = true;
		playBtn.classList.add('hidden');
		pauseBtn.classList.remove('hidden');
	} else {
		pauseBtn.disabled = true;
		playBtn.disabled = false;
		playBtn.classList.remove('hidden');
		pauseBtn.classList.add('hidden');
	}
}

/**
 * Sets up the Media Session API for native OS controls.
 */
function setupMediaSession() {
	if (!('mediaSession' in navigator)) {
		return;
	}

	navigator.mediaSession.metadata = new MediaMetadata({
		title: 'إذاعة القرآن الكريم',
		artist: 'من القاهرة',
		album: 'بث مباشر',
		artwork: [
			{
				src: '/icons/manifest-icon-192.maskable.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/manifest-icon-512.maskable.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	});

	navigator.mediaSession.setActionHandler('play', () => playBtn.click());
	navigator.mediaSession.setActionHandler('pause', () => pauseBtn.click());
}

/**
 * Shows a non-blocking error message to the user.
 * @param {string} message - The error message to display.
 */
function showError(message) {
	// Remove any existing error message
	const existingError = document.querySelector('.error-message');
	if (existingError) {
		existingError.remove();
	}

	const errorEl = document.createElement('p');
	errorEl.className = 'error-message'; // You will need to style this class in main.css
	errorEl.textContent = message;
	errorEl.dir = 'rtl'; // Ensure correct text direction
	document.querySelector('.controls').insertAdjacentElement('afterend', errorEl);

	// Automatically remove the message after 5 seconds
	setTimeout(() => errorEl.remove(), 5000);
}


// --- Event Listeners ---
playBtn.addEventListener('click', () => {
	player.src = STREAM_URL + '?cacheBuster=' + new Date().getTime();
	player.play()
		.then(() => {
			updatePlayerState(true);
			setupMediaSession();
		})
		.catch((err) => {
			console.error('Playback failed:', err);
			showError('حدث خطأ أثناء تحميل البث. يرجى المحاولة مرة أخرى.');
			updatePlayerState(false);
		});
});

pauseBtn.addEventListener('click', () => {
	player.pause();
	player.src = ""; // Stop buffering
	updatePlayerState(false);
});

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((reg) => console.log('Service Worker registered:', reg))
			.catch((err) => console.log('Service Worker failed:', err));
	});
}

// --- PWA Installation Logic ---
let deferredPrompt;

function hideInstallButton() {
	if (installBtn) {
		installBtn.style.display = 'none';
	}
}

function showInstallButton() {
	if (installBtn) {
		installBtn.style.display = 'block';
	}
}

// Hide button if already installed
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
	hideInstallButton();
} else {
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;
		showInstallButton();

		installBtn?.addEventListener('click', async () => {
			hideInstallButton();
			if (!deferredPrompt) return;
			deferredPrompt.prompt();
			// We don't need to await the result, the 'appinstalled' event will handle it.
			deferredPrompt = null;
		}, { once: true });
	});
}

window.addEventListener('appinstalled', () => {
	hideInstallButton();
	console.log('PWA was installed');
});