function calculateTotal() {
    // Denomination and input mapping
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

    // Loop through the inputs and calculate the totals
    for (let i = 1; i <= 11; i++) {
        const inputField = document.getElementById(`input${i}`);
        let count = inputField.value ? parseFloat(inputField.value) : 0; // Default to 0 if empty

        // Store the input value in localStorage
        localStorage.setItem(`input${i}`, count);

        // Calculate the total for this denomination
        const totalForDenom = count * values[i];

        // Update the displayed total for the denomination with "R"
        document.getElementById(`total${i}`).textContent = `R${totalForDenom.toFixed(2)}`;
        total += totalForDenom;
    }

    // Store the grand total in localStorage
    localStorage.setItem('grandTotal', total.toFixed(2));

    // Display the grand total with "R"
    document.getElementById('grandTotal').textContent = `R${total.toFixed(2)}`;
}

// Restore input values and totals from localStorage on page load
function restoreInputs() {
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

    for (let i = 1; i <= 11; i++) {
        const inputField = document.getElementById(`input${i}`);
        const storedValue = localStorage.getItem(`input${i}`);
        const count = storedValue ? parseFloat(storedValue) : 0;

        inputField.value = count; // Restore the input value

        // Calculate and display the total for this denomination
        const totalForDenom = count * values[i];
        document.getElementById(`total${i}`).textContent = `R${totalForDenom.toFixed(2)}`;
        total += totalForDenom;
    }

    // Restore and display the grand total
    document.getElementById('grandTotal').textContent = `R${total.toFixed(2)}`;
}

// Clear all inputs and localStorage
function clearInputs() {
    for (let i = 1; i <= 11; i++) {
        document.getElementById(`input${i}`).value = ''; // Clear input field
        document.getElementById(`total${i}`).textContent = 'R0.00'; // Reset total for denomination
        localStorage.removeItem(`input${i}`); // Remove stored input
    }

    // Reset grand total
    document.getElementById('grandTotal').textContent = 'R0.00';
    localStorage.removeItem('grandTotal');
}

// Restore inputs on page load
window.onload = restoreInputs;