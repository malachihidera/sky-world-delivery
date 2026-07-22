// 1. Initialize Supabase Client
const SUPABASE_URL = "https://vecqmrzqcxzcldldvhaf.supabase.co";
const SUPABASE_KEY = "sb_publishable_3oCv-YpSVxAswWuD5YjtJg_7AxaFc3x";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Tracking Function
async function trackPackage() {
  // Grab input safely (checks both trackingInput and trackingNum IDs)
  const inputEl = document.getElementById("trackingInput") || document.getElementById("trackingNum");
  const resultDiv = document.getElementById("trackingResult");

  if (!inputEl) {
    alert("Could not find the tracking input box in your HTML.");
    return;
  }

  const trackingNumber = inputEl.value.trim();

  if (!trackingNumber) {
    if (resultDiv) {
      resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">Please enter a tracking number.</p>`;
    }
    return;
  }

  // Show loading message
  if (resultDiv) {
    resultDiv.innerHTML = `<p style="color:#3b82f6; margin-top:10px;">Searching database...</p>`;
  }

  try {
    // Fetch from Supabase shipments table
    const { data, error } = await supabaseClient
      .from('shipments')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .maybeSingle();

    if (error || !data) {
      if (resultDiv) {
        resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">Package not found: <strong>${trackingNumber}</strong></p>`;
      }
      return;
    }

    // Output results onto the screen
    document.getElementById("trackingDetailsCard").style.display = "block";
    
        if (resultDiv) {
      const statusLower = (data.status || '').toLowerCase();
      let badgeBg = '#f59e0b';
      let progressWidth = '50%';

      if (statusLower.includes('deliver')) {
        badgeBg = '#22c55e';
        progressWidth = '100%';
      } else if (statusLower.includes('pending')) {
        badgeBg = '#6b7280';
        progressWidth = '15%';
      } else if (statusLower.includes('out for delivery')) {
        badgeBg = '#3b82f6';
        progressWidth = '75%';
      }

      resultDiv.innerHTML = `
        <div style="background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); text-align: left;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px;">
            <span style="font-weight: bold; font-size: 1.1rem; color: #94a3b8;">Shipment Details</span>
            <span style="background: ${badgeBg}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; text-transform: uppercase;">
              ${data.status || 'In Transit'}
            </span>
          </div>

          <div style="background: #334155; border-radius: 10px; height: 8px; width: 100%; margin-bottom: 20px; overflow: hidden;">
            <div style="background: ${badgeBg}; height: 100%; width: ${progressWidth}; transition: width 0.5s ease;"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.95rem;">
            <div>
              <p style="margin: 0; color: #64748b; font-size: 0.8rem;">TRACKING NUMBER</p>
              <p style="margin: 2px 0 0 0; font-weight: 600; color: #38bdf8;">${data.tracking_number}</p>
            </div>
            <div>
              <p style="margin: 0; color: #64748b; font-size: 0.8rem;">DESTINATION</p>
              <p style="margin: 2px 0 0 0; font-weight: 600;">${data.destination || 'N/A'}</p>
            </div>
            <div>
              <p style="margin: 0; color: #64748b; font-size: 0.8rem;">WEIGHT</p>
              <p style="margin: 2px 0 0 0; font-weight: 600;">${data.weight || 'N/A'}</p>
            </div>
            <div>
              <p style="margin: 0; color: #64748b; font-size: 0.8rem;">ESTIMATED DELIVERY</p>
              <p style="margin: 2px 0 0 0; font-weight: 600;">${data.estimated_delivery || 'In Progress'}</p>
            </div>
          </div>

        </div>
      `;
    }
  } catch (err) {
    if (resultDiv) {
      resultDiv.innerHTML = `<p style="color:#ef4444; margin-top:10px;">An error occurred while fetching data.</p>`;
    }
    console.error(err);
  }
}
// 3. Manager Update Function
async function updateShipment(event) {
  event.preventDefault();

  const trackingNum = document.getElementById("adminTrackingNum").value.trim();
  const newStatus = document.getElementById("adminStatus").value;
  const newDestination = document.getElementById("adminDestination").value.trim();
  const feedbackDiv = document.getElementById("adminFeedback");

  if (!trackingNum) {
    feedbackDiv.innerHTML = `<p style="color:#ef4444;">Please enter a tracking number.</p>`;
    return;
  }

  feedbackDiv.innerHTML = `<p style="color:#38bdf8;">Updating database...</p>`;

  // Prepare fields to update
  const updateData = { status: newStatus };
  if (newDestination) {
    updateData.destination = newDestination;
  }

  try {
    // Update record in Supabase
    const { data, error } = await supabaseClient
      .from('shipments')
      .update(updateData)
      .eq('tracking_number', trackingNum);

    if (error) {
      feedbackDiv.innerHTML = `<p style="color:#ef4444;">Error: ${error.message}</p>`;
    } else {
      feedbackDiv.innerHTML = `<p style="color:#4ade80;">Successfully updated <strong>${trackingNum}</strong> to "${newStatus}"!</p>`;
    }
  } catch (err) {
    feedbackDiv.innerHTML = `<p style="color:#ef4444;">An error occurred while updating.</p>`;
    console.error(err);
  }
}
// Create New Shipment Function in Supabase
async function createShipment(event) {
  event.preventDefault();

  const trackingNum = document.getElementById("newTrackingNum").value.trim();
  const status = document.getElementById("newStatus").value;
  const destination = document.getElementById("newDestination").value.trim();
  const feedbackDiv = document.getElementById("createFeedback");

  feedbackDiv.innerHTML = `<p style="color:#38bdf8;">Creating shipment...</p>`;

  // Insert new record into Supabase 'shipments' table
  const { data, error } = await supabaseClient
    .from('shipments')
    .insert([
      { tracking_number: trackingNum, status: status, destination: destination }
    ]);

  if (error) {
    feedbackDiv.innerHTML = `<p style="color:#ef4444;">Error: ${error.message}</p>`;
  } else {
    feedbackDiv.innerHTML = `<p style="color:#4ade80;">Successfully created tracking number <strong>${trackingNum}</strong>!</p>`;
    document.getElementById("createShipmentForm").reset();
  }
}
// Auto-Reply Chatbot Logic
function sendChatMessage() {
    const inputField = document.getElementById('chatMessageInput');
    const chatContainer = document.getElementById('chatMessagesBody');
    const userText = inputField.value.trim();
    
    if (userText === '') return;
    
    // 1. Display User Message
    chatContainer.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px;">
            <span style="background: #2563EB; color: white; padding: 8px 12px; border-radius: 8px; display: inline-block; max-width: 80%; text-align: left; font-size: 13px;">${userText}</span>
        </div>
    `;
    
    inputField.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 2. Simulate Robot / AI Typing Delay
    setTimeout(() => {
        let botReply = "Thank you for reaching out to Sky World Delivery. An agent or automated system has logged your request regarding your shipment status.";
        
        const lowerText = userText.toLowerCase();
        if (lowerText.includes('track') || lowerText.includes('status') || lowerText.includes('package')) {
            botReply = "To track your package, please enter your tracking ID into the search bar at the top of our homepage for instant live updates!";
        } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('fee')) {
            botReply = "Shipping rates depend on package weight, dimensions, and destination. Check our pricing calculator section on the site for details.";
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
            botReply = "Hello! Welcome to Sky World Delivery. How can I assist you with your logistics needs today?";
        }
        
        // 3. Display Bot Reply
        chatContainer.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px;">
                <span style="background: #E2E8F0; color: #1E293B; padding: 8px 12px; border-radius: 8px; display: inline-block; max-width: 80%; font-size: 13px;">${botReply}</span>
            </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
}
// Auto-Reply Chatbot Logic
function sendChatMessage() {
    const inputField = document.getElementById('chatMessageInput');
    const chatContainer = document.getElementById('chatMessagesBody');
    const userText = inputField.value.trim();
    
    if (userText === '') return;
    
    // 1. Display User Message
    chatContainer.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px;">
            <span style="background: #2563EB; color: white; padding: 8px 12px; border-radius: 8px; display: inline-block; max-width: 80%; text-align: left; font-size: 13px;">${userText}</span>
        </div>
    `;
    
    inputField.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 2. Simulate Robot / AI Typing Delay
    setTimeout(() => {
        let botReply = "Thank you for reaching out to Sky World Delivery. An agent or automated system has logged your request regarding your shipment status.";
        
        const lowerText = userText.toLowerCase();
        if (lowerText.includes('track') || lowerText.includes('status') || lowerText.includes('package')) {
            botReply = "To track your package, please enter your tracking ID into the search bar at the top of our homepage for instant live updates!";
        } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('fee')) {
            botReply = "Shipping rates depend on package weight, dimensions, and destination. Check our pricing calculator section on the site for details.";
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
            botReply = "Hello! Welcome to Sky World Delivery. How can I assist you with your logistics needs today?";
        }
        
        // 3. Display Bot Reply
        chatContainer.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px;">
                <span style="background: #E2E8F0; color: #1E293B; padding: 8px 12px; border-radius: 8px; display: inline-block; max-width: 80%; font-size: 13px;">${botReply}</span>
            </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
}

