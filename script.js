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

        // Display results dynamically
        resultDiv.innerHTML = `
            <p style="margin-top:10px;"><strong>Tracking ID:</strong> ${data.tracking_number}</p>
            <p><strong>Destination:</strong> ${data.destination || 'Pending'}</p>
            <p><strong>Package Weight:</strong> ${data.weight || 'N/A'}</p>
            <p><strong>Current Status:</strong> <span style="color:#10b981; font-weight:bold;">${data.status}</span></p>
        `;
    } catch (err) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">An error occurred while tracking.</p>`;
    }
}

// 3. Admin Create / Update Function
async function handleAdminSubmit(event) {
    if (event) event.preventDefault();
    
    const trackingNum = document.getElementById("newTrackingNum")?.value.trim();
    const destination = document.getElementById("newDestination")?.value.trim();
    const status = document.getElementById("newStatus")?.value || "Order Received";
    const feedbackDiv = document.getElementById("createFeedback");

    if (!trackingNum) {
        if (feedbackDiv) feedbackDiv.innerHTML = `<span style="color:red;">Please enter a tracking number.</span>`;
        return;
    }

    try {
        // Upsert saves or updates the record directly in Supabase
        const { error } = await supabaseClient
            .from('shipments')
            .upsert([
                { tracking_number: trackingNum, destination: destination, status: status, weight: "2.5 kg" }
            ], { onConflict: ['tracking_number'] });

        if (error) throw error;

        if (feedbackDiv) {
            feedbackDiv.innerHTML = `<span style="color:green; font-weight:bold;">Successfully saved tracking number ${trackingNum} to Supabase!</span>`;
        }
    } catch (err) {
        if (feedbackDiv) {
            feedbackDiv.innerHTML = `<span style="color:red;">Error saving: ${err.message}</span>`;
        }
    }
}
