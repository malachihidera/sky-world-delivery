// Public Local Tracking Function
function trackPackage() {
    const inputEl = document.getElementById("trackingInput");
    const resultDiv = document.getElementById("trackingResult");

    if (!inputEl || !resultDiv) return;

    const trackingNumber = inputEl.value.trim();
    if (!trackingNumber) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:5px; font-size:13px;">Please enter a tracking ID.</p>`;
        return;
    }

    const savedData = localStorage.getItem("shipment_" + trackingNumber);

    if (!savedData) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:5px; font-size:13px;">Tracking ID not found. Please check and try again.</p>`;
        return;
    }

    const data = JSON.parse(savedData);

    resultDiv.innerHTML = `
        <div style="background: #f8fafc; color: #0f172a; padding: 12px; border-radius: 6px; text-align: left; border: 1px solid #cbd5e1; margin-top:10px; font-size:13px;">
            <p style="margin:4px 0;"><strong>Tracking ID:</strong> ${data.tracking_number}</p>
            <p style="margin:4px 0;"><strong>Destination:</strong> ${data.destination}</p>
            <p style="margin:4px 0;"><strong>Weight:</strong> ${data.weight}</p>
            <p style="margin:4px 0;"><strong>Status:</strong> <span style="color:#10b981; font-weight:bold;">${data.status}</span></p>
        </div>
    `;
}

// Booking Form WhatsApp Dispatcher
function sendBookingToWhatsApp(event) {
    if (event) event.preventDefault();
    const name = document.getElementById("custName")?.value || "";
    const addresses = document.getElementById("addresses")?.value || "";
    const pkg = document.getElementById("pkgDetails")?.value || "";
    const message = `Hello Manager, I want to book a delivery.%0A%0A*Name:* ${name}%0A*Addresses:* ${addresses}%0A*Package Details:* ${pkg}`;
    window.open(`https://wa.me/2348120067056?text=${message}`, '_blank');
}
