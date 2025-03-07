const input = document.querySelector('#hero-input');
const placeHolder = document.querySelector('#qr-image');
const btn = document.querySelector('#generate-btn');
const qrImage = document.querySelector('#qrImage');
const foot = document.querySelector('.foot');
const downloadBtn = document.querySelector('#downloadBtn');


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#year').textContent = new Date().getFullYear();
});


qrImage.onload = () => {
    const isValidQR = qrImage.src && !qrImage.src.endsWith('/');
    qrImage.style.display = isValidQR ? 'block' : 'none';
    downloadBtn.style.display = isValidQR ? 'block' : 'none';
};


function getScreenWidth() {
   const screen = window.innerWidth;

   if (screen <= 480){
    return '150x150'
   } else if (screen <= 768){
    return '300x300'
   } else {
    return '350x350'
   }
}

function Generateqr() {
    if (!input.value.trim()) {
        alert("Please enter text to generate a QR code.");
        return;
    }
    let size = getScreenWidth();
    let qrText = encodeURIComponent(input.value);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${qrText}`;
    input.value = '';
}

downloadBtn.addEventListener('click', async() => {
    const response = await fetch(qrImage.src);
    const blob = await response.blob();
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "qrcode.jpg";
    downloadLink.click();
    URL.revokeObjectURL(ObjectURL)
})

input.addEventListener('input', () => {
    qrImage.src = '';
    qrImage.style.display = 'none';
    downloadBtn.style.display = 'none';
})

btn.addEventListener('click', () => {
   Generateqr()
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        Generateqr();
    }
})
  