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

    // Process files and add images
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

                // Create image preview
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;

                // Create delete button with an "X"
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.innerText = 'X';
                deleteBtn.onclick = () => deleteImage(i);

                // Create container for image and delete button
                const container = document.createElement('div');
                container.appendChild(imgElement);
                container.appendChild(deleteBtn);

                // Append the image preview to the container
                document.getElementById('imagePreviews').appendChild(container);
            };
        };

        reader.readAsDataURL(file);
    }

    // Enable the generate button if images are uploaded
    document.getElementById('generatePDF').disabled = files.length === 0;
}

function deleteImage(index) {
    // Remove the image from the images array
    images.splice(index, 1);

    // Re-render the image previews
    const previewsContainer = document.getElementById('imagePreviews');
    previewsContainer.innerHTML = ''; // Clear the current previews

    // Loop through the images array and re-display each image
    images.forEach((image, i) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'X';
        deleteBtn.onclick = () => deleteImage(i);

        const container = document.createElement('div');
        container.appendChild(imgElement);
        container.appendChild(deleteBtn);

        previewsContainer.appendChild(container);
    });

    // Enable or disable the generate button
    document.getElementById('generatePDF').disabled = images.length === 0;
}

function generatePDF() {
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
    });

    let x = margin;
    let y = headerSpace;
    const selectedSize = document.getElementById('sizeSelector').value;

    const selectedWidth = selectedSize === 'fixed' ? 62.2 : imageWidthMM;
    const selectedHeight = selectedSize === 'fixed' ? 28 : imageHeightMM;

    const imagesPerRow = Math.floor((pageWidth - 2 * margin) / selectedWidth);

    images.forEach((image, index) => {
        // Check if the current image fits on the current page
        if (y + selectedHeight > pageHeight - footerSpace) {
            pdf.addPage();
            x = margin;
            y = headerSpace;
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
function toggleMenu() {

    const menu = document.getElementById('navMenu');

    const hamburgerIcon = document.querySelector('.hamburger-icon');

    // Toggle visibility of the navigation menu
    menu.classList.toggle('visible');
    hamburgerIcon.classList.toggle('open');

}
