// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
// Function to cycle through black, dark orange, and Egyptian blue
function getLoopedColor() {
  const colors = [
      { background: '#000000', text: '#FFFFFF' }, // Black background, White text
      { background: '#FF8C00', text: '#000000' }, // Dark Orange background, Black text
      { background: '#1034A6', text: '#FFFFFF' }  // Egyptian Blue background, White text
  ];
  let currentIndex = -1; // Initialize at -1

  return function () {
      currentIndex = (currentIndex + 1) % colors.length; // Cycle through indices
      return colors[currentIndex];
  };
}

// Function to change the background color and text color of h1 every few seconds
function changeBackgroundColor() {
  const h1 = document.querySelector('h1');
  const getColor = getLoopedColor(); // Get the looped color generator

  setInterval(() => {
      const { background, text } = getColor(); // Get the next color object
      h1.style.backgroundColor = background; // Set the background color
      h1.style.color = text; // Set the text color
  }, 3000); // Change color every 3 seconds (3000ms)
}

// Call the function to start changing the color
changeBackgroundColor();
