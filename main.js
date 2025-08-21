const body = document.querySelector('body')

const player = document.querySelector('.audio-player');
player.autoplay = false;

const play = document.querySelector('.play');
const pause = document.querySelector('.pause');

// let quantity = 30
// for (var i = 1; i <= quantity; i++){
//     let div = document.createElement('div')
//     div.classList.add('firefly')
//     body.appendChild(div)
// }
  

play.addEventListener('click', () => {
	player.play();
    pause.disabled = false
    play.disabled = true
});

pause.addEventListener('click', () => {
    player.pause();
    pause.disabled = true
    play.disabled = false

});


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("app-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/main.css",
        "/main.js",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.log("Service Worker failed:", err));
  });
}
