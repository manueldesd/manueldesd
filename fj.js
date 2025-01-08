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

  floatToggle.addEventListener("change", () => {
    isFloatEnabled = floatToggle.checked;
    const floatInputs = floatRows.querySelectorAll(".quantity");

    if (!isFloatEnabled) {
      floatInputs.forEach((input) => {
        input.disabled = true;
        input.value = ""; // Clear float values when disabled
      });
      totalFloatDisplay.textContent = "1000.00"; // Default value for float
    } else {
      floatInputs.forEach((input) => {
        input.disabled = false; // Ensure inputs are re-enabled
        input.value = localStorage.getItem(`float-${input.dataset.denomination}`) || ""; // Restore values
      });
      calculateTotals();
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
      updateBankingBreakdown();
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