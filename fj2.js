function calculateTotals() {
  const values = {
    1: 200,
    2: 100,
    3: 50,
    4: 20,
    5: 10,
    6: 5,
    7: 2,
    8: 1,
    9: 0.5,
    10: 0.2,
    11: 0.1
  };

  let total = 0;
  let breakdown = [];
  let floatAmount = 1000;

  // Calculate totals for each denomination
  for (let i = 1; i <= 11; i++) {
    const inputField = document.getElementById(`input${i}`);
    let count = inputField.value ? parseFloat(inputField.value) : 0; // Default to 0 if empty

    const totalForDenom = count * values[i];
    total += totalForDenom;

    if (count > 0) {
      breakdown.push({ denom: values[i], count });
    }
  }

  // Calculate float breakdown
  let floatBreakdown = [];
  let remainingFloat = floatAmount;

  for (let i = breakdown.length - 1; i >= 0 && remainingFloat > 0; i--) {
    const { denom, count } = breakdown[i];
    const maxRemove = Math.min(remainingFloat / denom, count);
    const removeCount = Math.floor(maxRemove);

    if (removeCount > 0) {
      floatBreakdown.push({ denom, count: removeCount });
      remainingFloat -= removeCount * denom;
    }
  }

  // Update the float table
  const floatTableBody = document.querySelector("#floatTable tbody");
  floatTableBody.innerHTML = "";
  floatBreakdown.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>R${item.denom.toFixed(2)}</td>
            <td>${item.count}</td>
            <td>R${(item.denom * item.count).toFixed(2)}</td>
        `;
    floatTableBody.appendChild(row);
  });

  // Calculate remaining banking amount and breakdown
  let remainingBanking = total - floatAmount;
  let bankingBreakdown = [];
  breakdown.forEach(item => {
    const floatCount = floatBreakdown.find(f => f.denom === item.denom)?.count || 0;
    const remainingCount = item.count - floatCount;
    if (remainingCount > 0) {
      bankingBreakdown.push({ denom: item.denom, count: remainingCount });
    }
  });

  // Update the banking table
  const bankingTableBody = document.querySelector("#bankingTable tbody");
  bankingTableBody.innerHTML = "";
  bankingBreakdown.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>R${item.denom.toFixed(2)}</td>
            <td>${item.count}</td>
            <td>R${(item.denom * item.count).toFixed(2)}</td>
        `;
    bankingTableBody.appendChild(row);
  });

  // Display the results
  document.getElementById("result").textContent = `Remaining for Banking: R${remainingBanking.toFixed(2)}`;
}

// Restore inputs and calculations on page load
function restoreInputs() {
  for (let i = 1; i <= 11; i++) {
    const inputField = document.getElementById(`input${i}`);
    const storedValue = localStorage.getItem(`input${i}`);
    inputField.value = storedValue ? parseFloat(storedValue) : '';
  }
  calculateTotals();
}

// Clear all inputs and localStorage
function clearInputs() {
  for (let i = 1; i <= 11; i++) {
    document.getElementById(`input${i}`).value = '';
    localStorage.removeItem(`input${i}`);
  }
  calculateTotals();
}

// Initialize on page load
window.onload = restoreInputs;