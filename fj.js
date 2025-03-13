document.addEventListener("DOMContentLoaded", () => {
  const denominations = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1];
  const floatRows = document.getElementById("float-rows");
  const cashTakenRows = document.getElementById("cash-taken-rows");
  const bankingRows = document.getElementById("banking-rows");

  const totalFloatDisplay = document.getElementById("total-float");
  const totalCashTakenDisplay = document.getElementById("total-cash-taken");
  const bankAmountDisplay = document.getElementById("bank-amount"); // Now a display element

  const resultFloatDisplay = document.getElementById("result-float");
  const resultCashTakenDisplay = document.getElementById("result-cash-taken");
  const resultBankedDisplay = document.getElementById("result-banked");
  const resultRemainingDisplay = document.getElementById("result-remaining");

  const finalizeButton = document.getElementById("finalize-button");
  const clearButton = document.getElementById("clear-all-button");

  const floatToggle = document.getElementById("float-toggle");
  let isFloatEnabled = true;

  // Create rows for denominations
  const createRows = (denominations, parent, type) => {
    denominations.forEach((denomination) => {
      const label = denomination < 1 ? `${denomination * 100}c` : `R${denomination}`;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${label}</td>
        <td>
          <input type="number" data-denomination="${denomination}" class="quantity" value="" placeholder="">
        </td>
        <td class="denomination-total">R0.00</td>
      `;
      parent.appendChild(row);

      const savedValue = localStorage.getItem(`${type}-${denomination}`);
      if (savedValue) {
        row.querySelector(".quantity").value = savedValue;
      }
    });
  };

  createRows(denominations, floatRows, "float");
  createRows(denominations, cashTakenRows, "cash");

  // Calculate totals for float and cash inputs
  const calculateTotals = () => {
    const calculateTotal = (parent, type) => {
      const inputs = parent.querySelectorAll(".quantity");
      let total = 0;

      inputs.forEach((input) => {
        const denomination = parseFloat(input.dataset.denomination);
        const quantity = parseInt(input.value, 10) || 0;
        const denominationTotal = denomination * quantity;
        total += denominationTotal;

        // Update the row's denomination total
        input.parentElement.nextElementSibling.textContent = `R${denominationTotal.toFixed(2)}`;

        // Save the value in localStorage
        if (isFloatEnabled && type === "float") {
          localStorage.setItem(`float-${denomination}`, input.value);
        } else if (type === "cash") {
          localStorage.setItem(`cash-${denomination}`, input.value);
        }
      });
      return total;
    };

    let totalFloat = isFloatEnabled ? calculateTotal(floatRows, "float") : 1000;
    const totalCashTaken = calculateTotal(cashTakenRows, "cash");
    const bankAmount = totalCashTaken - totalFloat;

    totalFloatDisplay.textContent = totalFloat.toFixed(2);
    totalCashTakenDisplay.textContent = totalCashTaken.toFixed(2);
    // Update the bank amount display element with an "R" prefix.
    bankAmountDisplay.textContent = `R${bankAmount.toFixed(2)}`;

    return { totalFloat, totalCashTaken, bankAmount };
  };

  // Helper: Convert a monetary value to cents (avoids floating-point issues)
  const toCents = (amount) => Math.round(amount * 100);

  // Recursive function to find a coin combination that sums exactly to target (in cents)
  const findCombination = (denoms, index, target, available, combination) => {
    if (target === 0) return combination;
    if (index >= denoms.length) return null;

    const d = denoms[index];
    const coinValue = toCents(d);
    const maxAvailable = available[d] || 0;
    const maxCount = Math.min(maxAvailable, Math.floor(target / coinValue));

    for (let count = maxCount; count >= 0; count--) {
      const newTarget = target - count * coinValue;
      combination[d] = count;
      const result = findCombination(denoms, index + 1, newTarget, available, combination);
      if (result !== null) {
        return result;
      }
    }
    delete combination[d];
    return null;
  };

  // Updated banking breakdown using the coin change approach
  const updateBankingBreakdown = () => {
    const { bankAmount } = calculateTotals();
    bankingRows.innerHTML = "";

    // Build an object of available coins from cashTakenRows
    const cashAvailable = {};
    const cashTakenInputs = cashTakenRows.querySelectorAll(".quantity");
    cashTakenInputs.forEach((input) => {
      const denomination = parseFloat(input.dataset.denomination);
      const quantity = parseInt(input.value, 10) || 0;
      cashAvailable[denomination] = quantity;
    });

    const targetCents = toCents(bankAmount);
    const sortedDenoms = [...denominations].sort((a, b) => b - a);
    const combination = findCombination(sortedDenoms, 0, targetCents, cashAvailable, {});

    if (combination) {
      sortedDenoms.forEach((denom) => {
        const count = combination[denom] || 0;
        if (count > 0) {
          const label = denom < 1 ? `${denom * 100}c` : `R${denom}`;
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${label}</td>
            <td>${count}</td>
          `;
          bankingRows.appendChild(row);
        }
      });
    } else {
      const errorRow = document.createElement("tr");
      errorRow.innerHTML = `
        <td colspan="2" style="color: red; font-weight: bold;">
          Warning: Unable to break down R${bankAmount.toFixed(2)}.
        </td>
      `;
      bankingRows.appendChild(errorRow);
    }
  };

  // Toggle float inputs on/off based on the toggle switch
  floatToggle.addEventListener("change", () => {
    isFloatEnabled = floatToggle.checked;
    const floatInputs = floatRows.querySelectorAll(".quantity");

    calculateTotals();
    updateBankingBreakdown();

    if (!isFloatEnabled) {
      floatInputs.forEach((input) => {
        input.disabled = true;
        input.value = "";
      });
      totalFloatDisplay.textContent = "1000.00";
      localStorage.setItem("float", "1000");
    } else {
      floatInputs.forEach((input) => {
        input.disabled = false;
        input.value = localStorage.getItem(`float-${input.dataset.denomination}`) || "";
      });
    }
  });

  // Finalize button: show results on the results page
  finalizeButton.addEventListener("click", () => {
    const { totalFloat, totalCashTaken, bankAmount } = calculateTotals();
    const remainingCash = totalCashTaken - bankAmount;

    resultFloatDisplay.textContent = totalFloat.toFixed(2);
    resultCashTakenDisplay.textContent = totalCashTaken.toFixed(2);
    resultBankedDisplay.textContent = bankAmount.toFixed(2);
    resultRemainingDisplay.textContent = remainingCash.toFixed(2);

    showPage("results-page");
  });

  // Update calculations and breakdown when any quantity input changes
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("input", () => {
      calculateTotals();
      updateBankingBreakdown();
    });
  });

  // Function to switch between pages (assumes pages have class "page" and active page has class "active")
  const showPage = (pageId) => {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add("active");
    }
  };

  // Next-page button event listeners
  document.querySelectorAll(".next-page-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const targetPage = e.target.getAttribute("data-target");
      showPage(targetPage);
    });
  });

  // Back-page button event listeners
  document.querySelectorAll(".back-page-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const targetPage = e.target.getAttribute("data-target");
      showPage(targetPage);
    });
  });

  // Clear all button: clear localStorage and reload page
  clearButton.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  // Initial calculation on page load
  calculateTotals();
});

document.addEventListener("DOMContentLoaded", () => {
  const resultFloatDisplay = document.getElementById("result-float");
  const totalFloat = localStorage.getItem("float");
  if (totalFloat) {
    resultFloatDisplay.textContent = `R${parseFloat(totalFloat).toFixed(2)}`;
  } else {
    resultFloatDisplay.textContent = "R1000.00";
  }
});

function toggleMenu() {
  const menu = document.getElementById('navMenu');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const h1 = document.querySelector('.hi');

  menu.classList.toggle('visible');
  hamburgerIcon.classList.toggle('open');

  if (menu.classList.contains('visible')) {
    h1.classList.add('behind');
  } else {
    h1.classList.remove('behind');
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const toggleShadow = document.getElementById("toggleShadow");
  const container = document.querySelector(".container");

  let wakeLock = null;

  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Screen wake lock is active");

      wakeLock.addEventListener("release", () => {
        console.log("Wake lock was released");
      });
    } catch (err) {
      console.error("Wake lock request failed:", err);
      container.style.boxShadow = "0px 0px 15px red";
    }
  }

  if ("wakeLock" in navigator) {
    requestWakeLock();
  } else {
    console.warn("Wake Lock API is not supported in this browser.");
    container.style.boxShadow = "0px 0px 15px none";
  }

  toggleShadow.addEventListener("change", function () {
    if (this.checked) {
      container.style.boxShadow = "0px 0px 15px #FDAD01";
    } else {
      container.style.boxShadow = "0px 0px 10px black";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const floatToggle = document.getElementById("float-toggle");
  const floatCountSection = document.getElementById("float-count-section");

  floatToggle.addEventListener("change", () => {
    if (floatToggle.checked) {
      floatCountSection.classList.remove("collapsed");
      floatCountSection.classList.add("expanded");
    } else {
      floatCountSection.classList.remove("expanded");
      floatCountSection.classList.add("collapsed");
    }
  });

  if (floatToggle.checked) {
    floatCountSection.classList.add("expanded");
  } else {
    floatCountSection.classList.add("collapsed");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("focus", function () {
      this.select();
    });
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => console.log("Service Worker registered", registration))
      .catch((error) => console.log("Service Worker registration failed", error));
  });
}
