// Function to calculate totals and update UI
function updateTotals() {
    let cashCounted = 0;
    const tableData = [];

    // Iterate over each row in the table to calculate totals based on denomination counts
    document.querySelectorAll('#cash-table tbody tr').forEach((row, index) => {
        const input = row.querySelector('input');
        const quantity = parseFloat(input.value) || 0;
        const value = parseFloat(input.dataset.value);
        const total = quantity * value;

        // Update the total column for the current row
        row.querySelector('.total').textContent = total.toFixed(2);
        cashCounted += total;

        // Save row data for Local Storage
        tableData.push({ index, value, quantity });
    });

    // Calculate derived values
    const cashToBank = cashCounted - 1000; // Assuming cash to bank is total counted minus the initial cash in register (1000)

    // Update the UI for "Cash Counted" and "Cash to Bank"
    document.getElementById('cash-counted').textContent = cashCounted.toFixed(2);
    document.getElementById('cash-to-bank').textContent = cashToBank.toFixed(2);

    // Save all data to Local Storage
    localStorage.setItem('cashRegisterData', JSON.stringify({
        cashCounted,
        cashToBank,
        tableData
    }));
}

// Restore data from Local Storage on page load
function restoreData() {
    const savedData = localStorage.getItem('cashRegisterData');
    if (savedData) {
        const { cashCounted, cashToBank, tableData } = JSON.parse(savedData);

        // Restore calculated fields
        document.getElementById('cash-counted').textContent = cashCounted.toFixed(2);
        document.getElementById('cash-to-bank').textContent = cashToBank.toFixed(2);

        // Restore table row values
        document.querySelectorAll('#cash-table tbody tr').forEach((row, index) => {
            const input = row.querySelector('input');
            const savedRow = tableData.find(data => data.index === index);

            if (savedRow) {
                input.value = savedRow.quantity || "";
                row.querySelector('.total').textContent = (savedRow.quantity * savedRow.value).toFixed(2);
            }
        });
    }
}

// Clear all fields and Local Storage
function clearAll() {
    // Clear all table inputs and totals
    document.querySelectorAll('#cash-table tbody input').forEach(input => (input.value = ""));
    document.querySelectorAll('#cash-table tbody .total').forEach(cell => (cell.textContent = "0"));

    // Reset summary fields
    document.getElementById('cash-counted').textContent = "0";
    document.getElementById('cash-to-bank').textContent = "0";

    // Remove data from Local Storage
    localStorage.removeItem('cashRegisterData');
}

// Event: Restore data on page load
window.addEventListener('DOMContentLoaded', restoreData);

// Utility: Print the page
function printPage() {
    window.print();
}

let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default install prompt
    event.preventDefault();
    deferredPrompt = event;

    installButton.style.display = 'block'; // Show your custom install button
});

installButton.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');
}
