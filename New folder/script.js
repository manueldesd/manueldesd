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