let deferredPrompt;

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // Toggle the navigation menu
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
});

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((error) => console.error('Service Worker Registration Failed:', error));
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default install prompt
  e.preventDefault();

  // Save the event so it can be triggered later
  deferredPrompt = e;

  // Create the install button dynamically and show it
  const installButton = document.createElement('button');
  installButton.textContent = 'Install App';
  installButton.style.position = 'fixed';
  installButton.style.bottom = '20px';
  installButton.style.left = '50%';
  installButton.style.transform = 'translateX(-50%)';
  installButton.style.padding = '10px 20px';
  installButton.style.backgroundColor = '#007bff';
  installButton.style.color = '#fff';
  installButton.style.border = 'none';
  installButton.style.borderRadius = '5px';
  installButton.style.cursor = 'pointer';
  document.body.appendChild(installButton);

  // When the install button is clicked, show the prompt
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
      installButton.style.display = 'none'; // Hide the install button after the prompt
    });
  });
});
