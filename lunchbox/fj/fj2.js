window.onload = function () {
  const grandTotal = parseFloat(localStorage.getItem('grandTotal')) || 0;
  const targetAmount = 1000.00;
  let amountToRemove = grandTotal - targetAmount;

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

  let denominationsToRemove = {};
  let remainingCash = {};

  function calculateDenominationsToRemove() {
    let amountLeft = amountToRemove;

    for (let i = 1; i <= 11; i++) {
      const storedCount = parseFloat(localStorage.getItem(`input${i}`)) || 0;
      const denominationValue = values[i];

      if (storedCount > 0) {
        remainingCash[i] = storedCount;
        const quantityToRemove = Math.floor(amountLeft / denominationValue);

        if (quantityToRemove > 0) {
          const actualRemove = Math.min(quantityToRemove, storedCount);
          denominationsToRemove[i] = actualRemove;
          amountLeft -= actualRemove * denominationValue;
          remainingCash[i] -= actualRemove;
        }
      }

      if (amountLeft <= 0) break;
    }

    if (amountLeft <= 0.1 && remainingCash[11] > 0) {
      denominationsToRemove[11] = remainingCash[11];
      remainingCash[11] = 0;
    }

    return amountLeft;
  }

  const remainingAmount = calculateDenominationsToRemove();

  const resultText = document.getElementById('result');
  const table = document.getElementById('removalTable');
  const tableBody = table.querySelector('tbody');
  const remainingTable = document.getElementById('remainingTable');
  const remainingTableBody = remainingTable.querySelector('tbody');

  // Add table headers dynamically
  const tableHead = table.querySelector('thead');
  const remainingTableHead = remainingTable.querySelector('thead');
  tableHead.innerHTML = '<tr><th>Denom</th><th>QTY</th><th>Total</th></tr>';
  remainingTableHead.innerHTML = '<tr><th>Denom</th><th>QTY</th><th>Total</th></tr>';

  tableBody.innerHTML = '';
  remainingTableBody.innerHTML = '';

  let removalGrandTotal = 0;
  let remainingGrandTotal = 0;

  for (let i = 1; i <= 11; i++) {
    if (remainingCash[i] > 0) {
      const denominationName = getDenominationName(i);
      const quantityRemaining = remainingCash[i];
      const subtotal = (quantityRemaining * values[i]).toFixed(2);

      remainingGrandTotal += parseFloat(subtotal);

      const row = document.createElement('tr');
      row.innerHTML = `<td>${denominationName}</td><td>${quantityRemaining}</td><td>R${subtotal}</td>`;
      remainingTableBody.appendChild(row);
    }

    if (denominationsToRemove[i]) {
      const denominationName = getDenominationName(i);
      const quantityToRemove = denominationsToRemove[i];
      const subtotal = (quantityToRemove * values[i]).toFixed(2);

      removalGrandTotal += parseFloat(subtotal);

      const row = document.createElement('tr');
      row.innerHTML = `<td>${denominationName}</td><td>${quantityToRemove}</td><td>R${subtotal}</td>`;
      tableBody.appendChild(row);
    }
  }

  if (remainingAmount <= 0) {
    resultText.textContent = "Successfully reduced to R1000!";
    table.style.display = 'none';
  } else {
    resultText.textContent = "";
    table.style.display = 'table';
  }

  const removalTotalRow = document.createElement('tr');
  removalTotalRow.innerHTML = `<td><strong>Grand Total</strong></td><td></td><td><strong>R${removalGrandTotal.toFixed(2)}</strong></td>`;
  tableBody.appendChild(removalTotalRow);

  const remainingTotalRow = document.createElement('tr');
  remainingTotalRow.innerHTML = `<td><strong>Grand Total</strong></td><td></td><td><strong>R${remainingGrandTotal.toFixed(2)}</strong></td>`;
  remainingTableBody.appendChild(remainingTotalRow);
};

function getDenominationName(index) {
  switch (index) {
    case 1: return "R200";
    case 2: return "R100";
    case 3: return "R50";
    case 4: return "R20";
    case 5: return "R10";
    case 6: return "R5";
    case 7: return "R2";
    case 8: return "R1";
    case 9: return "50c";
    case 10: return "20c";
    case 11: return "10c";
    default: return "";
  }
}
