const input = document.querySelector('#hero-input');
const placeHolder = document.querySelector('#qr-image');
const btn = document.querySelector('#generate-btn');
const qrImage = document.querySelector('#qrImage');
const foot = document.querySelector('.foot');
const downloadBtn = document.querySelector('#downloadBtn');
const yearElement = document.querySelector('#year');

document.addEventListener('DOMContentLoaded', () => {
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

if (qrImage && downloadBtn) {
    qrImage.onload = () => {
        try {
            const isValidQR = qrImage.src && !qrImage.src.endsWith('/');
            qrImage.style.display = isValidQR ? 'block' : 'none';
            downloadBtn.style.display = isValidQR ? 'block' : 'none';
        } catch (error) {
            console.error("Error displaying QR image:", error);
        }
    };
}

function getScreenWidth() {
    const screen = window.innerWidth;

    if (screen <= 480) {
        return '150x150';
    } else if (screen <= 768) {
        return '300x300';
    } else {
        return '350x350';
    }
}

function Generateqr() {
    if (!input || !qrImage) {
        console.error("Input or qrImage element is missing.");
        return;
    }

    if (!input.value.trim()) {
        alert("Please enter text to generate a QR code.");
        return;
    }

    let size = getScreenWidth();
    let qrText = encodeURIComponent(input.value);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${qrText}`;
    input.value = '';
}

if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
        if (!qrImage || !qrImage.src) {
            alert("No QR code available to download.");
            return;
        }

        try {
            const response = await fetch(qrImage.src);
            if (!response.ok) throw new Error("Failed to fetch QR code.");

            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            const objectURL = URL.createObjectURL(blob);

            downloadLink.href = objectURL;
            downloadLink.download = "qrcode.jpg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            URL.revokeObjectURL(objectURL);
        } catch (error) {
            console.error("Error downloading QR code:", error);
            alert("Failed to download QR code. Please try again.");
        }
    });
}

if (input && qrImage && downloadBtn) {
    input.addEventListener('input', () => {
        qrImage.src = '';
        qrImage.style.display = 'none';
        downloadBtn.style.display = 'none';
    });

    btn?.addEventListener('click', () => {
        Generateqr();
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            Generateqr();
        }
    });
}
