document.addEventListener("DOMContentLoaded", () => {
    // Function to calculate table values dynamically
    const updateTable = () => {
      const denominations = [
        { id: "200", value: 200 },
        { id: "100", value: 100 },
        { id: "50", value: 50 },
        { id: "20", value: 20 },
        { id: "10", value: 10 },
        { id: "5", value: 5 },
        { id: "2", value: 2 },
        { id: "1", value: 1 },
        { id: "0.5", value: 0.5 },
        { id: "0.2", value: 0.2 },
        { id: "0.1", value: 0.1 },
      ];
  
      let total = 0;
      denominations.forEach((denomination) => {
        const qty = parseInt(document.getElementById(`input${denomination.id}`).value) || 0;
        const amount = qty * denomination.value;
        document.getElementById(`amount${denomination.id}`).textContent = amount.toFixed(2);
        total += amount;
      });
  
      document.getElementById("total").textContent = total.toFixed(2);
    };
  
    // Update table whenever input values change
    const inputs = document.querySelectorAll(".popup-input");
    inputs.forEach((input) => {
      input.addEventListener("input", updateTable);
    });
  
    // Initialize table calculations
    updateTable();
  });
  