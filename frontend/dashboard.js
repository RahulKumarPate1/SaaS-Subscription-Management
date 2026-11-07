// Base routing configuration target pointing to the FastAPI execution layer
const API_BASE_URL = "http://127.0.0.1:8000/api/subscriptions";

// -------------------------------------------------------------------------
// Lifecycle Execution: Initialize page context and verify secure presence
// -------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentUserId = localStorage.getItem("user_id");
    const currentUserName = localStorage.getItem("user_name");

    // Session Route Guard: If credentials do not exist, bounce user back to auth portal
    if (!currentUserId) {
        window.location.href = "index.html";
        return;
    }

    // Set greeting context inside target element node
    document.getElementById("welcome-user").innerText = `Workspace: ${currentUserName}`;
    
    // Trigger remote fetch pipeline to retrieve data arrays
    loadUserApplications();
});

// -------------------------------------------------------------------------
// Network Pipeline: Retrieve application entities from database storage
// -------------------------------------------------------------------------
async function loadUserApplications() {
    const container = document.getElementById("apps-container");
    
    try {
        // Fetch request targeted towards the backend retrieval router layer
        const response = await fetch(`${API_BASE_URL}/apps/all`, { method: "GET" });
        const apps = await response.json();

        // Flush target node content container structures
        container.innerHTML = "";

        if (!response.ok || apps.length === 0) {
            container.innerHTML = `<p class="text-zinc-500 text-sm col-span-full">No active applications found. Click 'Register New App' to start scaling.</p>`;
            return;
        }

        // Loop execution parsing database columns to programmatic design matrix instances
        apps.forEach(app => {
            const card = document.createElement("div");
            card.className = "p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-red-500/50 transition duration-200 cursor-pointer flex flex-col justify-between";
            
            // Setting a programmatic structural layout template with dataset mapping anchors
            card.innerHTML = `
                <div>
                    <div class="w-10 h-10 rounded-lg bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500 font-bold mb-4 text-sm">
                        ${app.app_name.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 class="text-lg font-bold tracking-tight text-white">${app.app_name}</h3>
                    <p class="text-zinc-400 text-xs mt-1">App ID Reference Matrix: #${app.app_id}</p>
                </div>
                <div class="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-semibold text-red-400 group">
                    <span>Manage Customers</span>
                    <span class="transform translate-x-0 transition duration-200 group-hover:translate-x-1">→</span>
                </div>
            `;
            
            // Set dynamic event listeners bound to explicit runtime execution IDs
            card.onclick = () => selectApp(app.app_id, app.app_name);
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = `<p class="text-red-400 text-sm col-span-full">API Connection Error: System unable to establish remote backend mapping handshake.</p>`;
    }
}

// -------------------------------------------------------------------------
// Control Layer: Toggle modal view visualization parameters
// -------------------------------------------------------------------------
function toggleAppModal(shouldOpen) {
    const modal = document.getElementById("app-modal");
    if (shouldOpen) {
        modal.classList.remove("hidden");
    } else {
        modal.classList.add("hidden");
        document.getElementById("modal-app-name").value = "";
    }
}

// -------------------------------------------------------------------------
// Form Transaction: Post fresh data row payloads into application registry
// -------------------------------------------------------------------------
async function handleCreateApp(event) {
    event.preventDefault();
    const appNameInput = document.getElementById("modal-app-name").value;
    const currentUserId = localStorage.getItem("user_id");

    try {
        const response = await fetch(`${API_BASE_URL}/apps/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ app_name: appNameInput, user_id: parseInt(currentUserId) })
        });

        if (response.ok) {
            toggleAppModal(false);
            loadUserApplications(); // Reload data layout structures sequentially
        } else {
            alert("Execution Denied: Invalid parameters parsed to storage engine schema.");
        }
    } catch (error) {
        alert("Transaction Failed: API endpoint network mapping failure.");
    }
}

// -------------------------------------------------------------------------
// Navigation Layer: Cache tracking variables and open detail page context
// -------------------------------------------------------------------------
function selectApp(appId, appName) {
    localStorage.setItem("selected_app_id", appId);
    localStorage.setItem("selected_app_name", appName);
    window.location.href = "app_details.html";
    // window.location.href = "app_details.html"; // Triggers mapping to customer dashboard screen next
}

// -------------------------------------------------------------------------
// Destruction Routine: Wipe operational system state vectors and bounce
// -------------------------------------------------------------------------
function handleLogout() {
    localStorage.clear();
    window.location.href = "index.html";
}