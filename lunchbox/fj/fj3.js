window.onload = function() {
    // Retrieve the total cash counted from localStorage
    const totalCash = parseFloat(localStorage.getItem('grandTotal')) || 0;
  
    // Set target float amount
    const targetFloat = 1000;
  
    // Calculate the amount to be banked
    const amountToBank = Math.max(totalCash - targetFloat, 0);
  
    // Display the results
    document.getElementById('totalCash').textContent = totalCash.toFixed(2);
    document.getElementById('amountBanked').textContent = amountToBank.toFixed(2);
  };
  
  // Hamburger menu toggle function (optional, reused from other pages)
  function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('visible');
  }
  