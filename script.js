document.addEventListener("DOMContentLoaded", () => {
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
  
  // Handle the install prompt for PWA
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default installation prompt
    e.preventDefault();
    // Save the event so it can be triggered later
    deferredPrompt = e;
  
    // Show a custom install button or a prompt
    const installButton = document.createElement('button');
    installButton.innerText = "Install App";
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
      });
    });
  });
  