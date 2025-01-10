document.getElementById('hamburger').addEventListener('click', function () {
    const menu = document.getElementById('nav-menu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    
    // Toggle the visibility of the menu
    menu.classList.toggle('visible');
    
    // Toggle the hamburger icon to "X"
    hamburgerIcon.classList.toggle('open');
  });
  
  // Handle submenu toggle for Dairy Products when clicked
  const dairyProductLink = document.querySelector('.menu-item .toggle-link');
  
  dairyProductLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    
    const submenu = this.nextElementSibling;
  
    // Toggle submenu visibility
    submenu.classList.toggle('open');
    submenu.style.display = submenu.classList.contains('open') ? 'block' : 'none';
  });
  