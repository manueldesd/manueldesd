let deferredPrompt;
let installButton;

document.addEventListener('DOMContentLoaded', () => {
  installButton = document.getElementById('installButton');

  if (installButton) {
    installButton.style.display = 'none'; // Initially hidden

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installButton.style.display = 'block'; // Show install button

      installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      });
    });

    window.addEventListener('appinstalled', (e) => {
      console.log('App installed', e);
      installButton.style.display = 'none'; // Hide the install button after installation
    });
  } else {
    console.error('Install button not found!');
  }

  // Check if service worker is supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }

  // Intersection Observer for reveal sections
  const revealSections = document.querySelectorAll('.reveal-section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  });

  revealSections.forEach(section => revealObserver.observe(section));
});
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  menu.classList.toggle('visible');
  hamburgerIcon.classList.toggle('open');
}

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMenu').classList.remove('visible');
    document.querySelector('.hamburger-icon').classList.remove('open');
  });
});