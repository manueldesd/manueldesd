// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Function to generate a random color in HEX format
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Function to change the background color of h1 every few seconds
  function changeBackgroundColor() {
    const h1 = document.querySelector('h1');
    setInterval(() => {
      h1.style.backgroundColor = getRandomColor(); // Set random background color
    }, 3000); // Change color every 3 seconds (3000ms)
  }
  
  // Call the function to start changing the color
  changeBackgroundColor();
  