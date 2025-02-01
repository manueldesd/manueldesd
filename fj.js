document.addEventListener("DOMContentLoaded", () => {
  const denominations = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1];
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

  const floatToggle = document.getElementById("float-toggle");
  let isFloatEnabled = true;

  const createRows = (denominations, parent, type) => {
    denominations.forEach((denomination) => {
      const label = denomination < 1 ? `${denomination * 100}c` : `R${denomination}`;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${label}</td>
        <td><input type="number" data-denomination="${denomination}" class="quantity" value="" placeholder=""></td>
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

  const calculateTotals = () => {
    const calculateTotal = (parent, type) => {
      const inputs = parent.querySelectorAll(".quantity");
      let total = 0;

      inputs.forEach((input) => {
        const denomination = parseFloat(input.dataset.denomination);
        const quantity = parseInt(input.value, 10) || 0;
        const denominationTotal = denomination * quantity;

        total += denominationTotal;
        input.parentElement.nextElementSibling.textContent = `R${denominationTotal.toFixed(2)}`;

        if (isFloatEnabled && type === "float") {
          localStorage.setItem(`float-${denomination}`, input.value); // Save updated float value
        } else if (type === "cash") {
          localStorage.setItem(`cash-${denomination}`, input.value); // Save cash value
        }
      });

      return total;
    };

    let totalFloat = isFloatEnabled ? calculateTotal(floatRows, "float") : 1000;
    const totalCashTaken = calculateTotal(cashTakenRows, "cash");
    const bankAmount = totalCashTaken - totalFloat;

    totalFloatDisplay.textContent = totalFloat.toFixed(2);
    totalCashTakenDisplay.textContent = totalCashTaken.toFixed(2);
    bankAmountInput.value = bankAmount.toFixed(2);

    return { totalFloat, totalCashTaken, bankAmount };
  };

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

    const sortedDenominations = [...denominations].sort((a, b) => b - a);

    sortedDenominations.forEach((denomination) => {
      const availableQty = cashAvailable[denomination] || 0;
      const neededQty = Math.floor(remainingAmount / denomination);
      const qtyToTake = Math.min(neededQty, availableQty);

      if (qtyToTake > 0) {
        remainingAmount -= qtyToTake * denomination;
        remainingAmount = Math.max(remainingAmount, 0).toFixed(2);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${denomination < 1 ? `${denomination * 100}c` : `R${denomination}`}</td>
          <td>${qtyToTake}</td>
        `;
        bankingRows.appendChild(row);
      }
    });

    if (remainingAmount > 0.001) {
      const errorRow = document.createElement("tr");
      errorRow.innerHTML = `
        <td colspan="2" style="color: red; font-weight: bold;">
          Warning: Unable to break down R${remainingAmount}.
        </td>
      `;
      bankingRows.appendChild(errorRow);
    }
  };

  // floatToggle.addEventListener("change", () => {
  //   isFloatEnabled = floatToggle.checked;
  //   const floatInputs = floatRows.querySelectorAll(".quantity");

  //   if (!isFloatEnabled) {
  //     floatInputs.forEach((input) => {
  //       input.disabled = true;
  //       input.value = ""; // Clear float values when disabled
  //     });
  //     totalFloatDisplay.textContent = "1000.00"; // Default value for float
  //     localStorage.setItem("float", "1000"); // Set default value for float when disabled
  //   } else {
  //     floatInputs.forEach((input) => {
  //       input.disabled = false;
  //       input.value = localStorage.getItem(`float-${input.dataset.denomination}`) || ""; // Restore values from localStorage
  //     });
  //     calculateTotals();
  //   }

  //   updateBankingBreakdown(); // Update banking amount when the float is toggled
  // });
  floatToggle.addEventListener("change", () => {
    isFloatEnabled = floatToggle.checked;
    const floatInputs = floatRows.querySelectorAll(".quantity");

    // Trigger recalculation when toggled
    calculateTotals();
    updateBankingBreakdown();

    // Handle float input enabled/disabled based on the toggle switch
    if (!isFloatEnabled) {
      floatInputs.forEach((input) => {
        input.disabled = true;
        input.value = ""; // Clear float values when disabled
      });
      totalFloatDisplay.textContent = "1000.00"; // Default value for float
      localStorage.setItem("float", "1000"); // Set default value for float when disabled
    } else {
      floatInputs.forEach((input) => {
        input.disabled = false;
        input.value = localStorage.getItem(`float-${input.dataset.denomination}`) || ""; // Restore values from localStorage
      });
    }
  });

  finalizeButton.addEventListener("click", () => {
    const { totalFloat, totalCashTaken, bankAmount } = calculateTotals();
    const remainingCash = totalCashTaken - bankAmount;

    resultFloatDisplay.textContent = totalFloat.toFixed(2);
    resultCashTakenDisplay.textContent = totalCashTaken.toFixed(2);
    resultBankedDisplay.textContent = bankAmount.toFixed(2);
    resultRemainingDisplay.textContent = remainingCash.toFixed(2);

    showPage("results-page");
  });

  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("input", () => {
      calculateTotals();
      updateBankingBreakdown(); // Update banking amount on any input change
    });
  });

  const showPage = (pageId) => {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add("active");
    }
  };

  document.querySelectorAll(".next-page-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const targetPage = e.target.getAttribute("data-target");
      showPage(targetPage);
    });
  });

  document.querySelectorAll(".back-page-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const targetPage = e.target.getAttribute("data-target");
      showPage(targetPage);
    });
  });

  clearButton.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  calculateTotals();
});

document.addEventListener("DOMContentLoaded", () => {
  const resultFloatDisplay = document.getElementById("result-float");

  // Retrieve the float value from localStorage
  const totalFloat = localStorage.getItem("float");
  if (totalFloat) {
    resultFloatDisplay.textContent = `R${parseFloat(totalFloat).toFixed(2)}`;
  } else {
    resultFloatDisplay.textContent = "R1000.00"; // Default value if no float is found
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
    }
  }

  if ("wakeLock" in navigator) {
    requestWakeLock();
  } else {
    console.warn("Wake Lock API is not supported in this browser.");
  }

  toggleShadow.addEventListener("change", function () {
    if (this.checked) {
      container.style.boxShadow = "0px 0px 15px yellow";
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
