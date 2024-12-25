// Detect and apply theme preference
const darkModeToggle = document.getElementById('darkModeToggle');

// Check if dark mode is already enabled by the user
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Toggle dark mode
darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');
}
