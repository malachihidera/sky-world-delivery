// 1. Initialize Supabase Client
const SUPABASE_URL = "https://vecqmerzqcxzcldldvhaf.supabase.co";
const SUPABASE_KEY = "sb_publishable_3oCv-YpSvXAswWuD5YjtJg_7AxaFc3x";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  
// 2. Public Tracking Function
async function trackPackage() {
    const inputEl = document.getElementById("trackingInput") || document.getElementById("trackingNum");
    const resultDiv = document.getElementById("trackingResult");

    if (!inputEl || !resultDiv) return;

    const trackingNumber = inputEl.value.trim();
    if (!trackingNumber) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">Please enter a tracking ID.</p>`;
        return;
    }

    resultDiv.innerHTML = `<p style="color:#3b82f6; margin-top:10px;">Searching shipment...</p>`;

    try {
        const { data, error } = await supabaseClient
            .from('shipments')
            .select('*')
            .eq('tracking_number', trackingNumber)
            .maybeSingle();

        if (error || !data) {
            resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">Tracking ID not found. Please check and try again.</p>`;
            return;
        }

        // Display retrieved package data dynamically
        resultDiv.innerHTML = `
            <div style="background: #f8fafc; color: #0f172a; padding: 15px; border-radius: 8px; text-align: left; border: 1px solid #cbd5e1;">
                <p><strong>Tracking ID:</strong> ${data.tracking_number}</p>
                <p><strong>Destination:</strong> ${data.destination || 'Pending'}</p>
                <p><strong>Package Weight:</strong> ${data.weight || '2.5 kg'}</p>
                <p><strong>Current Status:</strong> <span style="color:#10b981; font-weight:bold;">${data.status}</span></p>
            </div>
        `;
    } catch (err) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">An error occurred while tracking.</p>`;
    }
}

// 3. Booking Form WhatsApp Dispatcher
function sendBookingToWhatsApp(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById("custName")?.value || "";
    const addresses = document.getElementById("addresses")?.value || "";
    const pkg = document.getElementById("pkgDetails")?.value || "";

    const message = `Hello Manager, I want to book a delivery.%0A%0A*Name:* ${name}%0A*Addresses:* ${addresses}%0A*Package Details:* ${pkg}`;
    window.open(`https://wa.me/2348120067056?text=${message}`, '_blank');
}

// 4. Client Email Dispatcher
function sendClientEmail() {
    const email = document.getElementById("clientEmailInput")?.value;
    const message = document.getElementById("clientMessageInput")?.value;

    if (!email) {
        alert("Please enter a client email address.");
        return;
    }

    window.location.href = `mailto:${email}?subject=Sky%20World%20Delivery%20Update&body=${encodeURIComponent(message)}`;
}
