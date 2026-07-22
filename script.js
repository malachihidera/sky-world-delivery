function trackPackage() {
    const inputEl = document.getElementById("trackingInput");
    const resultDiv = document.getElementById("trackingResult");
    if (!inputEl || !resultDiv) return;

    const trackingNumber = inputEl.value.trim();
    if (!trackingNumber) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:8px; font-size:13px;">Please enter a tracking ID.</p>`;
        return;
    }

    const savedData = localStorage.getItem("shipment_" + trackingNumber);
    if (!savedData) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:8px; font-size:13px;">Tracking ID not found. Check number and try again.</p>`;
        return;
    }

    const data = JSON.parse(savedData);
    resultDiv.innerHTML = `
        <div style="background: #f8fafc; color: #0f172a; padding: 14px; border-radius: 6px; text-align: left; border: 1px solid #cbd5e1; margin-top:10px; font-size:13px;">
            <p style="margin:4px 0;"><strong>Tracking ID:</strong> ${data.tracking_number}</p>
            <p style="margin:4px 0;"><strong>Destination:</strong> ${data.receiver_loc || 'Global Hub'}</p>
            <p style="margin:4px 0;"><strong>Status:</strong> <span style="color:#10b981; font-weight:bold;">${data.status}</span></p>
            <button onclick="printOfficialReceipt('${data.tracking_number}')" class="btn-primary" style="width: 100%; margin-top: 12px; font-size: 13px; background-color: #0A2540; color: #FFC01D;">
                <i class="fas fa-file-pdf"></i> Print Official Customs Receipt (PDF)
            </button>
        </div>
    `;
}

function printOfficialReceipt(trackingNum) {
    const savedData = localStorage.getItem("shipment_" + trackingNum);
    if (!savedData) return;
    const d = JSON.parse(savedData);

    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Official Customs Clearance Receipt - ${d.tracking_number}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; background: #fff; }
                .receipt-container { max-width: 700px; margin: 0 auto; border: 2px solid #0A2540; padding: 30px; border-radius: 8px; position: relative; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0A2540; padding-bottom: 15px; margin-bottom: 20px; }
                .logo-area h2 { color: #0A2540; margin: 0; font-size: 22px; }
                .logo-area p { margin: 2px 0 0; font-size: 11px; color: #64748B; }
                .meta-area { text-align: right; font-size: 12px; color: #334155; }
                .title-badge { background: #0A2540; color: #FFC01D; text-align: center; padding: 8px; font-weight: bold; font-size: 14px; letter-spacing: 1px; margin-bottom: 20px; border-radius: 4px; }
                .grid-section { display: flex; justify-content: space-between; margin-bottom: 25px; gap: 20px; }
                .box { flex: 1; background: #F8FAFC; padding: 15px; border-radius: 6px; border: 1px solid #E2E8F0; }
                .box h4 { margin: 0 0 8px; color: #0A2540; font-size: 13px; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px; }
                .box p { margin: 4px 0; font-size: 12px; color: #475569; }
                .table-details { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                .table-details th, .table-details td { border: 1px solid #CBD5E1; padding: 10px; font-size: 12px; text-align: left; }
                .table-details th { background: #F1F5F9; color: #0A2540; }
                .fee-box { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
                .fee-title { font-weight: bold; color: #92400E; font-size: 13px; }
                .fee-amount { font-size: 18px; font-weight: bold; color: #B45309; }
                .footer-notes { font-size: 10px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <div class="header">
                    <div class="logo-area">
                        <h2>SKY WORLD DELIVERY</h2>
                        <p>Global Logistics & International Freight Forwarding</p>
                        <p>Reg No: RC 8475621 | 14 Hanover Square, London, UK</p>
                    </div>
                    <div class="meta-area">
                        <p><strong>Date Issued:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Ref Code:</strong> SW-CR-${Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>
                </div>

                <div class="title-badge">OFFICIAL CUSTOMS CLEARANCE & WAYBILL MANIFEST</div>

                <div class="grid-section">
                    <div class="box">
                        <h4>SENDER INFORMATION</h4>
                        <p><strong>Full Name:</strong> ${d.sender_name}</p>
                        <p><strong>Origin Location:</strong> ${d.sender_loc}</p>
                    </div>
                    <div class="box">
                        <h4>RECEIVER INFORMATION</h4>
                        <p><strong>Full Name:</strong> ${d.receiver_name}</p>
                        <p><strong>Destination Location:</strong> ${d.receiver_loc}</p>
                    </div>
                </div>

                <table class="table-details">
                    <tr>
                        <th>Tracking Number</th>
                        <th>Package Weight</th>
                        <th>Current Shipment Status</th>
                    </tr>
                    <tr>
                        <td><strong>${d.tracking_number}</strong></td>
                        <td>${d.weight}</td>
                        <td><span style="color: #047857; font-weight: bold;">${d.status}</span></td>
                    </tr>
                </table>

                <div class="fee-box">
                    <div>
                        <span class="fee-title">MANDATORY COUNTRY CUSTOMS CLEARANCE FEE:</span>
                        <p style="margin: 2px 0 0; font-size: 11px; color: #78350F;">Required for final destination customs release & dispatch.</p>
                    </div>
                    <div class="fee-amount">${d.customs_fee}</div>
                </div>

                <div class="footer-notes">
                    <p>This is an official computer-generated statement issued by Sky World Logistics Compliance Unit. All goods remain subject to international maritime and border regulatory laws.</p>
                </div>

                <div style="text-align: center; margin-top: 20px;" class="no-print">
                    <button onclick="window.print()" style="background: #0A2540; color: #FFC01D; border: none; padding: 12px 25px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 14px;">Print / Save as PDF</button>
                </div>
            </div>
        </body>
        </html>
    `);
    receiptWindow.document.close();
}

function sendBookingToWhatsApp(event) {
    if (event) event.preventDefault();
    const name = document.getElementById("custName")?.value || "";
    const addresses = document.getElementById("addresses")?.value || "";
    const pkg = document.getElementById("pkgDetails")?.value || "";
    const message = `Hello Manager, I want to book a delivery.%0A%0A*Name:* ${name}%0A*Addresses:* ${addresses}%0A*Package Details:* ${pkg}`;
    window.open(`https://wa.me/2348120067056?text=${message}`, '_blank');
}
