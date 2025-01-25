// document.addEventListener("DOMContentLoaded", () => {
//     const keyboard = document.getElementById("popupKeyboard");
//     const keys = keyboard.querySelectorAll(".key");
//     let activeInput = null;
    
//     // Variables to track the position of the mouse and keyboard
//     let isDragging = false;
//     let offsetX, offsetY;
    
//     // Position the keyboard appropriately
//     const positionKeyboard = () => {
//       keyboard.style.position = "fixed";
//       keyboard.style.bottom = "20px";
//       keyboard.style.left = "50%";
//       keyboard.style.transform = "translateX(-50%)";
//       keyboard.style.display = "block";
//       keyboard.style.width = "fit-content"; // Ensure it does not stretch
//       keyboard.style.height = "fit-content"; // Prevent it from changing shape
//     };
  
//     // Enable dragging of the keyboard
//     const startDrag = (e) => {
//       isDragging = true;
//       offsetX = e.clientX - keyboard.getBoundingClientRect().left;
//       offsetY = e.clientY - keyboard.getBoundingClientRect().top;
//       document.addEventListener("mousemove", dragKeyboard);
//       document.addEventListener("mouseup", stopDrag);
//     };
  
//     const dragKeyboard = (e) => {
//       if (!isDragging) return;
//       const x = e.clientX - offsetX;
//       const y = e.clientY - offsetY;
//       keyboard.style.left = `${x}px`;
//       keyboard.style.top = `${y}px`;
//     };
  
//     const stopDrag = () => {
//       isDragging = false;
//       document.removeEventListener("mousemove", dragKeyboard);
//       document.removeEventListener("mouseup", stopDrag);
//     };
  
//     // Add event listener to make keyboard draggable
//     keyboard.addEventListener("mousedown", startDrag);
    
//     // Activate the keyboard when clicking an input
//     const inputs = document.querySelectorAll(".popup-input");
//     inputs.forEach((input) => {
//       input.addEventListener("click", () => {
//         activeInput = input;
//         positionKeyboard();
//       });
//     });
  
//     // Hide keyboard when clicking outside
//     document.addEventListener("click", (event) => {
//       if (
//         !keyboard.contains(event.target) &&
//         !event.target.classList.contains("popup-input")
//       ) {
//         keyboard.style.display = "none";
//         activeInput = null;
//       }
//     });
  
//     // Handle key presses
//     keys.forEach((key) => {
//       key.addEventListener("click", () => {
//         if (!activeInput) return;
//         const keyValue = key.textContent;
  
//         if (key.id === "backspace") {
//           activeInput.value = activeInput.value.slice(0, -1);
//         } else if (key.id === "tab") {
//           let currentIndex = Array.from(inputs).indexOf(activeInput);
//           currentIndex = (currentIndex + 1) % inputs.length;
//           inputs[currentIndex].click(); // Mimics focus and activates the keyboard
//         } else {
//           activeInput.value += keyValue;
//         }
  
//         // Trigger input event for dynamic updates
//         activeInput.dispatchEvent(new Event("input"));
//       });
//     });
//   });
  