function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const h1 = document.querySelector('.hi');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');

    // Toggle the "behind" class on the h1 element
    if (menu.classList.contains('visible')) {
        h1.classList.add('behind');
    } else {
        h1.classList.remove('behind');
    }
}
