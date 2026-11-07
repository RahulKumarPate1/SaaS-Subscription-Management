// // Global routing configuration point pointing towards the backend infrastructure
// const API_BASE_URL = "http://127.0.0.1:8000/api/subscriptions";

// // Cache state values pulled instantly out of browser active memory lanes
// const currentAppId = localStorage.getItem("selected_app_id");
// const currentAppName = localStorage.getItem("selected_app_name");

// // -------------------------------------------------------------------------
// // Page Lifecycle: Verify operational states and bind DOM parameters
// // -------------------------------------------------------------------------
// document.addEventListener("DOMContentLoaded", () => {
//     // Session Verification: Bounce user back to panel if state parameters are lost
//     if (!currentAppId || !localStorage.getItem("user_id")) {
//         window.location.href = "dashboard.html";
//         return;
//     }

//     // Set contextual typography values inside interface blocks
//     document.getElementById("app-title").innerText = `${currentAppName} Workspace`;
//     document.getElementById("app-id-tag").innerText = `App ID Reference: #${currentAppId}`;

//     // Execute remote network retrieval sequence
//     loadAppCustomers();
// });



// // 🔴 SMART TRICK: A common function that runs automatically when cursor leaves ANY input box
// function setupRealtimeValidation() {
//     const inputs = [
//         { id: "cust-name", errId: "error-cust-name", msg: "Name must be at least 3 characters." },
//         { id: "cust-email", errId: "error-cust-email", msg: "Please enter a valid email (e.g., name@domain.com)." },
//         { id: "cust-number", errId: "error-cust-number", msg: "Phone number must be exactly 10 digits." }
//     ];

//     inputs.forEach(input => {
//         const element = document.getElementById(input.id);
//         const errorSpan = document.getElementById(input.errId);

//         // This triggers the moment cursor leaves the input box
//         element.addEventListener("blur", () => {
//             if (!element.checkValidity()) {
//                 element.classList.add("border-red-500");
//                 errorSpan.innerText = input.msg;
//                 errorSpan.classList.remove("hidden");
//             } else {
//                 element.classList.remove("border-red-500");
//                 errorSpan.classList.add("hidden");
//             }
//         });
//     });
// }



// // -------------------------------------------------------------------------
// // Read Routine: Fetch and render customers assigned to this application instance
// // -------------------------------------------------------------------------
// async function loadAppCustomers() {
//     const tbody = document.getElementById("customers-table-body");
    
//     try {
//         const response = await fetch(`${API_BASE_URL}/customers/app/${currentAppId}`, { method: "GET" });
//         const customers = await response.json();

//         tbody.innerHTML = ""; // Clear existing UI table rows

//         if (!response.ok || customers.length === 0) {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="4" class="p-8 text-zinc-500 text-center">No active customer entities registered under this product stream yet.</td>
//                 </tr>`;
//             return;
//         }

//         // Loop execution allocating raw columns data into functional styled table vectors
//         customers.forEach(customer => {
//             const row = document.createElement("tr");
//             row.className = "hover:bg-zinc-950/40 transition duration-150";
            
//             row.innerHTML = `
//                 <td class="p-4 font-mono text-zinc-500 text-xs">#C-${customer.customer_id}</td>
//                 <td class="p-4 font-semibold text-white">${customer.name}</td>
//                 <td class="p-4">
//                     <div class="text-zinc-300 text-xs">${customer.email}</div>
//                     <div class="text-zinc-500 text-[11px] mt-0.5">${customer.number}</div>
//                 </td>
//                 <td class="p-4 text-right space-x-2">
//                     <button onclick="triggerUpdatePlaceholder(${customer.customer_id})" class="px-2.5 py-1.5 border border-zinc-800 text-amber-500 hover:bg-amber-500/10 rounded-lg text-xs font-medium transition">Update Plan</button>
//                     <button onclick="triggerDeletePlaceholder(${customer.customer_id})" class="px-2.5 py-1.5 border border-zinc-800 text-red-500 hover:bg-red-500/10 rounded-lg text-xs font-medium transition">Delete</button>
//                 </td>
//             `;
//             tbody.appendChild(row);
//         });

//     } catch (error) {
//         tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-red-400 text-center">Network Error: Unable to extract customer dataset vectors.</td></tr>`;
//     }
// }

// // -------------------------------------------------------------------------
// // Create Routine: Post new customer payload properties into database tables
// // -------------------------------------------------------------------------
// // Open frontend/app_details.js and replace handleCreateCustomer with this block
// async function handleCreateCustomer(event) {
//     event.preventDefault(); // Stop automatic page reload

//     // Grab Input Elements
//     const nameEl = document.getElementById("cust-name");
//     const emailEl = document.getElementById("cust-email");
//     const numberEl = document.getElementById("cust-number");

//     // Grab Error Span Elements
//     const nameErr = document.getElementById("error-cust-name");
//     const emailErr = document.getElementById("error-cust-email");
//     const numberErr = document.getElementById("error-cust-number");

//     // Reset old error states before validation
//     let isFormValid = true;
//     [nameEl, emailEl, numberEl].forEach(el => el.classList.remove("border-red-500"));
//     [nameErr, emailErr, numberErr].forEach(err => { err.innerText = ""; err.classList.add("hidden"); });

//     // 1. Validate Name Field
//     if (!nameEl.value.trim() || nameEl.value.trim().length < 3) {
//         nameEl.classList.add("border-red-500");
//         nameErr.innerText = "Please enter a valid name (at least 3 characters).";
//         nameErr.classList.remove("hidden");
//         isFormValid = false;
//     }

//     // 2. Validate Email Field using standard regex pattern check
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(emailEl.value.trim())) {
//         emailEl.classList.add("border-red-500");
//         emailErr.innerText = "Please enter a valid email address (e.g., name@domain.com).";
//         emailErr.classList.remove("hidden");
//         isFormValid = false;
//     }

//     // 3. Validate Phone Number Field (Exactly 10 digits)
//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(numberEl.value.trim())) {
//         numberEl.classList.add("border-red-500");
//         numberErr.innerText = "Please enter a valid 10-digit phone number.";
//         numberErr.classList.remove("hidden");
//         isFormValid = false;
//     }

//     // If any field verification fails, stop immediately and do not call the backend API
//     if (!isFormValid) return;

//     // --- Backend API Fetch Pipeline ---
//     try {
//         const response = await fetch(`${API_BASE_URL}/customers/add`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 app_id: parseInt(currentAppId),
//                 name: nameEl.value.trim(),
//                 email: emailEl.value.trim(),
//                 number: numberEl.value.trim()
//             })
//         });

//         const result = await response.json();

//         if (response.ok) {
//             // Clear inputs on success
//             nameEl.value = "";
//             emailEl.value = "";
//             numberEl.value = "";
//             loadAppCustomers(); // Refresh the table grid grid rows
//         } else {
//             // In case backend database throws validation error
//             if (response.status === 422 && result.detail) {
//                 alert(`Backend Validation Error: ${result.detail[0].msg}`);
//             } else {
//                 alert(result.message || "Transaction Denied by server engine.");
//             }
//         }
//     } catch (error) {
//         alert("Operation Aborted: Gateway network interface exception encountered.");
//     }
// }
// // -------------------------------------------------------------------------
// // Operation Mappings: Dynamic execution handles bound to structural IDs
// // -------------------------------------------------------------------------
// function triggerUpdatePlaceholder(customerId) {
//     alert(`Update operation triggered for Customer ID: ${customerId}\n(We will wire this up to our PUT endpoint shortly!)`);
// }

// function triggerDeletePlaceholder(customerId) {
//     alert(`Delete operation triggered for Customer ID: ${customerId}\n(We will wire this up to our DELETE endpoint shortly!)`);
// }

// function navigateBack() {
//     localStorage.removeItem("selected_app_id");
//     localStorage.removeItem("selected_app_name");
//     window.location.href = "dashboard.html";
// }






// ============================================================================
// SECTION 1: GLOBAL CONFIGURATION & SYSTEM STATE ENVIRONMENT
// ============================================================================
// Central backend API gateway routing target location
const API_BASE_URL = "http://127.0.0.1:8000/api/subscriptions";

// Operational state variables pulled instantly from browser memory space
const currentAppId = localStorage.getItem("selected_app_id");
const currentAppName = localStorage.getItem("selected_app_name");


// ============================================================================
// SECTION 2: APPLICATION LIFECYCLE INITIALIZER & ROUTE GUARDS
// ============================================================================
// Fires automatically as soon as the DOM layer completes compilation
document.addEventListener("DOMContentLoaded", () => {
    // Session Guard: Bounce user back to dashboard if tracking parameters are missing
    if (!currentAppId || !localStorage.getItem("user_id")) {
    window.location.href = "./dashboard.html"; 
    return;
  }

    // Dynamic typography binding to synchronize the workspace header profile
    document.getElementById("app-title").innerText = `${currentAppName} Workspace`;
    document.getElementById("app-id-tag").innerText = `App ID Reference: #${currentAppId}`;

    // Execute background database queries to compile rows
    loadAppCustomers();
    
    // Mount the modular real-time interface listeners
    setupRealtimeValidation();
});


// ============================================================================
// SECTION 3: REAL-TIME INTERACTIVE VALIDATION ENGINE (ON-BLUR VECTOR)
// ============================================================================
/**
 * Attaches real-time listeners across input nodes.
 * Triggers structural error handling immediately when user focus leaves a field.
 */
function setupRealtimeValidation() {
    const inputs = [
        { id: "cust-name", errId: "error-cust-name", msg: "Name must be at least 3 characters." },
        { id: "cust-email", errId: "error-cust-email", msg: "Please enter a valid email (e.g., name@domain.com)." },
        { id: "cust-number", errId: "error-cust-number", msg: "Phone number must be exactly 10 digits." }
    ];

    inputs.forEach(input => {
        const element = document.getElementById(input.id);
        const errorSpan = document.getElementById(input.errId);

        // Intercepts focus breakout execution states
        element.addEventListener("blur", () => {
            if (!element.checkValidity()) {
                element.classList.add("border-red-500");
                errorSpan.innerText = input.msg;
                errorSpan.classList.remove("hidden");
            } else {
                element.classList.remove("border-red-500");
                errorSpan.classList.add("hidden");
            }
        });
    });
}


// ============================================================================
// SECTION 4: DATA TRANSACTION CONTROLLERS (FORM WRITE OPERATIONS)
// ============================================================================
/**
 * Intercepts submission events, validates nodes, and dispatches JSON payloads to DB.
 */
async function handleCreateCustomer(event) {
    event.preventDefault(); // Stop native browser window reloads

    const form = event.target;
    
    // Terminal verification check: halt submission pipeline if inputs contain errors
    if (!form.checkValidity()) {
        form.reportValidity(); 
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/customers/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                app_id: parseInt(currentAppId),
                name: document.getElementById("cust-name").value.trim(),
                email: document.getElementById("cust-email").value.trim(),
                number: document.getElementById("cust-number").value.trim(),
                send_email: document.getElementById("notify-email").checked, // 🔴 Sends true/false
                send_sms: document.getElementById("notify-sms").checked      // 🔴 Sends true/false
            })
        });

        if (response.ok) {
            form.reset(); // Flushes field states and dynamic error indicators simultaneously
            loadAppCustomers(); // Re-trigger reading pipeline to sync layout data grid rows
        } else {
            alert("Server Rejected: Invalid parameters sent.");
        }
    } catch (error) {
        alert("Network Error: Unable to connect to server.");
    }
}


// ============================================================================
// SECTION 5: DATA READ OPERATION (DYNAMIC TABLE GRID COMPILER)
// ============================================================================
/**
 * Sends a network query to fetch assigned customers and processes them into custom HTML nodes.
 */
async function loadAppCustomers() {
    const tbody = document.getElementById("customers-table-body");
    
    try {
        const response = await fetch(`${API_BASE_URL}/customers/app/${currentAppId}`, { method: "GET" });
        const customers = await response.json();

        tbody.innerHTML = ""; // Wipe temporary data matrix loaders

        if (!response.ok || customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="p-8 text-zinc-500 text-center">No active customer entities registered under this product stream yet.</td>
                </tr>`;
            return;
        }

        // Loop array execution parsing columns directly into layout rows template mappings
        customers.forEach(customer => {
            const row = document.createElement("tr");
            row.className = "hover:bg-zinc-950/40 transition duration-150";
            
            row.innerHTML = `
                <td class="p-4 font-mono text-zinc-500 text-xs">#C-${customer.customer_id}</td>
                <td class="p-4 font-semibold text-white">${customer.name}</td>
                <td class="p-4">
                    <div class="text-zinc-300 text-xs">${customer.email}</div>
                    <div class="text-zinc-500 text-[11px] mt-0.5">${customer.number}</div>
                </td>
                <td class="p-4 text-right space-x-2">
                    <button onclick="triggerUpdatePlaceholder(${customer.customer_id})" class="px-2.5 py-1.5 border border-zinc-800 text-amber-500 hover:bg-amber-500/10 rounded-lg text-xs font-medium transition">Update Plan</button>
                    <button onclick="triggerDeletePlaceholder(${customer.customer_id})" class="px-2.5 py-1.5 border border-zinc-800 text-red-500 hover:bg-red-500/10 rounded-lg text-xs font-medium transition">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-red-400 text-center">Network Error: Unable to extract customer dataset vectors.</td></tr>`;
    }
}


// ============================================================================
// SECTION 6: OPERATIONS INTERFACE WRAPPERS & NAVIGATION SYSTEMS
// ============================================================================
function triggerUpdatePlaceholder(customerId) {
    alert(`Update operation triggered for Customer ID: ${customerId}\n(We will wire this up to our PUT endpoint shortly!)`);
}

function triggerDeletePlaceholder(customerId) {
    alert(`Delete operation triggered for Customer ID: ${customerId}\n(We will wire this up to our DELETE endpoint shortly!)`);
}

/**
 * Caches management references and routes active session back to the primary app portal view.
 */
function navigateBack() {
    localStorage.removeItem("selected_app_id");
    localStorage.removeItem("selected_app_name");
    window.location.href = "./dashboard.html";
}