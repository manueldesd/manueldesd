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
        let count = inputField.value ? parseFloat(inputField.value) : ''; // Ensure the value is a number

        // Store the input value in localStorage
        localStorage.setItem(`input${i}`, count);

        // Calculate the total for this denomination
        const totalForDenom = count * values[i];

        // Update the displayed total for the denomination with "R"
        document.getElementById(`total${i}`).textContent = `R${totalForDenom.toFixed(2)}`;
        total += totalForDenom;
    }

    // Store the grand total in localStorage to be used in fj2
    localStorage.setItem('grandTotal', total.toFixed(2));

    // Display the grand total with "R"
    document.getElementById('grandTotal').textContent = `R${total.toFixed(2)}`;
}
