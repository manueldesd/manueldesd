// Handle the "beforeinstallprompt" event to show the install button
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default install prompt
    event.preventDefault();
    deferredPrompt = event;

    // Show the install button
    installButton.style.display = 'block';

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
