// Function to change message when button is clicked
function changeMessage() {
    document.getElementById('message').textContent = "You clicked the button!";
}

// Register Service Worker
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

// Add to Home Screen prompt
let deferredPrompt;
const installButton = document.createElement('button');
installButton.textContent = 'Install App';
document.body.appendChild(installButton);

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    // Save the event so it can be triggered later
    deferredPrompt = event;
    installButton.style.display = 'block'; // Show install button
});

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
