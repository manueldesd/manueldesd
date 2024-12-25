function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');
}
