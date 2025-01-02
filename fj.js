document.addEventListener("DOMContentLoaded", () => {
  const denominations = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];
  const floatRows = document.getElementById("float-rows");
  const cashTakenRows = document.getElementById("cash-taken-rows");
  const bankingRows = document.getElementById("banking-rows");

  const totalFloatDisplay = document.getElementById("total-float");
  const totalCashTakenDisplay = document.getElementById("total-cash-taken");
  const bankAmountInput = document.getElementById("bank-amount");

  const resultFloatDisplay = document.getElementById("result-float");
  const resultCashTakenDisplay = document.getElementById("result-cash-taken");
  const resultBankedDisplay = document.getElementById("result-banked");
  const resultRemainingDisplay = document.getElementById("result-remaining");

  const finalizeButton = document.getElementById("finalize-button");
  const clearButton = document.getElementById("clear-all-button");

  let isFloatEnabled = true;

  // Function to create rows dynamically for float and cash taken sections
  const createRows = (denominations, parent, type) => {
    denominations.forEach((denomination) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>R${denomination}</td>
        <td><input type="number" data-denomination="${denomination}" class="quantity" value="" placeholder=""></td>
        <td class="denomination-total">R0.00</td>
      `;
      parent.appendChild(row);

      // Load saved value from localStorage if available
      const savedValue = localStorage.getItem(`${type}-${denomination}`);
      if (savedValue) {
        row.querySelector(".quantity").value = savedValue;
      }
    });
  };

  // Initialize rows for float and cash taken pages
  createRows(denominations, floatRows, "float");
  createRows(denominations, cashTakenRows, "cash");

  // Function to calculate the totals for float and cash taken
  const calculateTotals = () => {
    const calculateTotal = (parent) => {
      const inputs = parent.querySelectorAll(".quantity");
      let total = 0;

      inputs.forEach((input) => {
        const denomination = parseFloat(input.dataset.denomination);
        const quantity = parseInt(input.value, 10) || 0;
        const denominationTotal = denomination * quantity;

        total += denominationTotal;
        input.parentElement.nextElementSibling.textContent = `R${denominationTotal.toFixed(2)}`;

        // Save the input value to localStorage
        localStorage.setItem(`${input.classList.contains("quantity") ? "float" : "cash"}-${denomination}`, input.value);
      });

      return total;
    };

    let totalFloat = isFloatEnabled ? calculateTotal(floatRows) : 1000; // Default float value when disabled
    const totalCashTaken = calculateTotal(cashTakenRows);
    const bankAmount = totalCashTaken - totalFloat;

    totalFloatDisplay.textContent = totalFloat.toFixed(2);
    totalCashTakenDisplay.textContent = totalCashTaken.toFixed(2);
    bankAmountInput.value = bankAmount.toFixed(2);

    return { totalFloat, totalCashTaken, bankAmount };
  };

  // Function to update the banking breakdown when the user enters a banking amount
  const updateBankingBreakdown = () => {
    const { bankAmount } = calculateTotals();
    let remainingAmount = bankAmount;
    bankingRows.innerHTML = "";

    const cashAvailable = {};
    const cashTakenInputs = cashTakenRows.querySelectorAll(".quantity");

    cashTakenInputs.forEach((input) => {
      const denomination = parseFloat(input.dataset.denomination);
      const quantity = parseInt(input.value, 10) || 0;
      cashAvailable[denomination] = quantity;
    });

    const sortedDenominations = [...denominations].reverse();

    sortedDenominations.forEach((denomination) => {
      const availableQty = cashAvailable[denomination] || 0;
      const neededQty = Math.floor(remainingAmount / denomination);

      const qtyToTake = Math.min(neededQty, availableQty);
      remainingAmount -= qtyToTake * denomination;
      remainingAmount = Math.max(remainingAmount, 0).toFixed(2);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>R${denomination}</td>
        <td>${qtyToTake}</td>
      `;
      bankingRows.appendChild(row);
    });

    if (remainingAmount > 0.001) {
      const errorRow = document.createElement("tr");
      errorRow.innerHTML = `
        <td colspan="2" style="color: red; font-weight: bold;">
          Warning: Unable to break down R${remainingAmount.toFixed(2)} exactly.
        </td>
      `;
      bankingRows.appendChild(errorRow);
    }
  };

  // Finalize button click event to show results
  finalizeButton.addEventListener("click", () => {
    const { totalFloat, totalCashTaken, bankAmount } = calculateTotals();
    const remainingCash = totalCashTaken - bankAmount;

    // Update the Final Results section
    resultFloatDisplay.textContent = totalFloat.toFixed(2);
    resultCashTakenDisplay.textContent = totalCashTaken.toFixed(2);
    resultBankedDisplay.textContent = bankAmount.toFixed(2);
    resultRemainingDisplay.textContent = remainingCash.toFixed(2);

    // Show results page after finalization
    showPage('results-page');
  });

  // Event listener to update totals on input change
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("input", () => {
      calculateTotals();
      updateBankingBreakdown();
    });
  });

  // Show and hide pages based on button clicks
  const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  };

  document.querySelectorAll(".next-page-button").forEach(button => {
    button.addEventListener("click", (e) => {
      const targetPage = e.target.getAttribute("data-target");
      showPage(targetPage);
    });
  });

  // Toggle Switch for enabling/disabling float count
  const floatToggle = document.getElementById("float-toggle");

  floatToggle.addEventListener("change", () => {
    isFloatEnabled = floatToggle.checked;
    if (!isFloatEnabled) {
      floatRows.querySelectorAll(".quantity").forEach((input) => (input.disabled = true));
      totalFloatDisplay.textContent = "1000.00"; // Default value when disabled
    } else {
      floatRows.querySelectorAll(".quantity").forEach((input) => (input.disabled = false));
      calculateTotals();
    }
  });

  // Clear All button to reset and clear localStorage
  clearButton.addEventListener("click", () => {
    localStorage.clear(); // Clear all saved data
    location.reload(); // Reload the page to reset the inputs
  });

  // Initial calculation when the page loads
  calculateTotals();
});

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');
}