let input = document.querySelector('#hero-input');
let placeHolder = document.querySelector('#qr-image');
let btn = document.querySelector('#generate-btn')
let qrImage = document.querySelector('#qrImage')
let foot = document.querySelector('.foot')

document.querySelector('#year').textContent = new Date().getFullYear();

qrImage.onload = () => {
    qrImage.style.display = qrImage.src.includes('data=') ? 'block' : 'none';
}

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
    let size = getScreenWidth();
    let qrText = encodeURIComponent(input.value)
   qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${qrText}`;
   input.value = ''
}
input.addEventListener('input', () => {
    qrImage.src = '';
    qrImage.style.display = 'none';
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
  