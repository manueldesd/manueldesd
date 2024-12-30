const { jsPDF } = window.jspdf;
const maxImages = 20;
const pageWidth = 210; // A4 width in mm
const pageHeight = 297; // A4 height in mm
const margin = 20; // Left and right margins
const headerSpace = 20; // Space reserved for the header
const footerSpace = 20; // Space reserved for the footer
const imageWidthMM = 71.1; // Image width in mm (3.2 cm)
const imageHeightMM = 32; // Fixed height for the images
let images = [];

document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('generatePDF').addEventListener('click', generatePDF);

function handleImageUpload(event) {
    const files = event.target.files;
    if (files.length > maxImages) {
        alert(`You can only select up to ${maxImages} images.`);
        return;
    }

    images = [];
    const previewsContainer = document.getElementById('imagePreviews');
    previewsContainer.innerHTML = ''; // Clear previous previews

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const width = imageWidthMM;
                const height = img.height * (width / img.width);
                images.push({ src: e.target.result, width, height });

                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                previewsContainer.appendChild(imgElement);
            };
        };

        reader.readAsDataURL(file);
    }

    // Enable the generate button if images are uploaded
    document.getElementById('generatePDF').disabled = files.length === 0;
}

const sizeSelector = document.getElementById('sizeSelector');

function generatePDF() {
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
    });

    let x = margin;
    let y = headerSpace;
    const selectedSize = sizeSelector.value;

    // Adjust dimensions based on the selected size
    const selectedWidth = selectedSize === 'fixed' ? 62.2 : imageWidthMM;
    const selectedHeight = selectedSize === 'fixed' ? 28 : imageHeightMM;

    const imagesPerRow = Math.floor((pageWidth - 2 * margin) / selectedWidth);

    images.forEach((image, index) => {
        // Add header and footer
        if (index === 0 || (index > 0 && index % imagesPerRow === 0 && y === headerSpace)) {
            pdf.setFontSize(12);
            pdf.text('Carrot Cake - Tag Printer', pageWidth / 2, 10, { align: 'center' });
            pdf.text('Do not re-print! Save a tree!', pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        // Check if the current image fits on the current page
        if (y + selectedHeight > pageHeight - footerSpace) {
            pdf.addPage();
            x = margin;
            y = headerSpace;
            pdf.text('Carrot Cake - Tag Printer', pageWidth / 2, 10, { align: 'center' });
            pdf.text('Do not re-print! Save a tree!', pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        // Add the image
        pdf.addImage(image.src, 'JPEG', x, y, selectedWidth, selectedHeight);
        x += selectedWidth;

        // If the image goes beyond the current row, move to the next row
        if (x + selectedWidth > pageWidth - margin) {
            x = margin;
            y += selectedHeight;
        }
    });

    // Open the PDF in a new tab
    const pdfBlob = pdf.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, '_blank');
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default mini-infobar from appearing on mobile
    event.preventDefault();
    // Save the event so it can be triggered later
    deferredPrompt = event;
    // Optionally, show a custom install button
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
});
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');
}
