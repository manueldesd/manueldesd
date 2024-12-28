document.getElementById('imageInput').addEventListener('change', function (event) {
    const files = event.target.files;
    const previews = document.getElementById('imagePreviews');
    previews.innerHTML = ''; // Clear previous previews

    if (files.length) {
        document.getElementById('generatePDF').disabled = false;
        Array.from(files).forEach(file => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.width = '100px';
            img.style.margin = '10px';
            previews.appendChild(img);
        });
    } else {
        document.getElementById('generatePDF').disabled = true;
    }
});

document.getElementById('generatePDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const previews = document.getElementById('imagePreviews').querySelectorAll('img');
    previews.forEach((img, index) => {
        pdf.addImage(img.src, 'JPEG', 10, 10 + index * 50, 50, 50);
    });

    pdf.save('tags.pdf');
});