const input = document.querySelector("#hero-input");
const qrImage = document.querySelector("#qrImage");
const btn = document.querySelector("#generate-btn");
const downloadBtn = document.querySelector("#downloadBtn");
const historyCard = document.querySelector(".card");
const yearElement = document.querySelector("#year");

document.addEventListener("DOMContentLoaded", () => {
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    loadHistory(); // Load previous QR code history on page load
});

if (qrImage && downloadBtn) {
    qrImage.onload = () => {
        try {
            const isValidQR = qrImage.src && !qrImage.src.endsWith("/");
            qrImage.style.display = isValidQR ? "block" : "none";
            downloadBtn.style.display = isValidQR ? "block" : "none";
        } catch (error) {
            console.error("Error displaying QR image:", error);
        }
    };
}

function getScreenWidth() {
    const screen = window.innerWidth;
    if (screen <= 480) return "150x150";
    if (screen <= 768) return "300x300";
    return "350x350";
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
    let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${qrText}`;
    qrImage.src = qrUrl;

    saveToHistory(input.value, qrUrl); // Save input text and QR URL
    input.value = "";
}

function saveToHistory(text, qrUrl) {
    let history = JSON.parse(localStorage.getItem("qrHistory")) || [];

    history.push({ text, qrUrl });

    localStorage.setItem("qrHistory", JSON.stringify(history));
    displayHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
    history.forEach((item) => addHistoryItem(item.text, item.qrUrl));
}

function displayHistory() {
    historyCard.innerHTML = ""; // Clear previous history
    let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
    history.forEach((item) => addHistoryItem(item.text, item.qrUrl));
}

function addHistoryItem(text, qrUrl) {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");

    const historyText = document.createElement("p");
    historyText.textContent = text;

    const historyImg = document.createElement("img");
    historyImg.src = qrUrl;
    historyImg.alt = "QR Code";

    historyItem.appendChild(historyText);
    historyItem.appendChild(historyImg);
    historyCard.appendChild(historyItem);
}

if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
        if (!qrImage || !qrImage.src) {
            alert("No QR code available to download.");
            return;
        }

        try {
            const response = await fetch(qrImage.src);
            if (!response.ok) throw new Error("Failed to fetch QR code.");

            const blob = await response.blob();
            const downloadLink = document.createElement("a");
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
    input.addEventListener("input", () => {
        qrImage.src = "";
        qrImage.style.display = "none";
        downloadBtn.style.display = "none";
    });

    btn?.addEventListener("click", () => {
        Generateqr();
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            Generateqr();
        }
    });
}
