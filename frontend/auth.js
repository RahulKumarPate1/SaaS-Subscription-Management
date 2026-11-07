// Base API URL pointing to your local FastAPI server backend
const API_BASE_URL = "http://127.0.0.1:8000/api/subscriptions";

// -------------------------------------------------------------------------
// Function to switch visible tabs between Login and Registration forms
// -------------------------------------------------------------------------
function switchTab(type) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const alertBox = document.getElementById("alert-box");

    alertBox.classList.add("hidden"); // Hide any existing alerts during switch

    if (type === "login") {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        tabLogin.className = "flex-1 pb-3 border-b-2 border-red-500 text-white";
        tabRegister.className = "flex-1 pb-3 border-b-2 border-transparent text-zinc-400 hover:text-white";
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        tabLogin.className = "flex-1 pb-3 border-b-2 border-transparent text-zinc-400 hover:text-white";
        tabRegister.className = "flex-1 pb-3 border-b-2 border-red-500 text-white";
    }
}

// -------------------------------------------------------------------------
// Helper function to display custom messages inside the alert box
// -------------------------------------------------------------------------
function showAlert(message, isSuccess) {
    const alertBox = document.getElementById("alert-box");
    alertBox.innerText = message;
    alertBox.classList.remove("hidden");

    if (isSuccess) {
        alertBox.className = "mt-4 p-3 rounded-xl text-center text-sm font-medium bg-green-950/50 border border-green-800 text-green-400";
    } else {
        alertBox.className = "mt-4 p-3 rounded-xl text-center text-sm font-medium bg-red-950/50 border border-red-900 text-red-400";
    }
}

// -------------------------------------------------------------------------
// Handler to intercept Login form submit and hit FastAPI authentication
// -------------------------------------------------------------------------
async function handleLogin(event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();

        if (response.ok && result.status === "Success") {
            showAlert("Login Successful! Redirecting...", true);
            
            // Saving operational user variables safely
            localStorage.setItem("user_id", result.user.user_id);
            localStorage.setItem("user_name", result.user.name);
            
            // Redirecting cleanly to dashboard file
            setTimeout(() => {
                window.location.href = "./dashboard.html";
            }, 1500);
        } else {
            // Displaying strict error message from backend pipeline
            showAlert(result.detail || "Invalid Email or Password!", false);
        }
    } catch (error) {
        showAlert("Connection Failed: Unable to link with backend API server.", false);
    }
}
// -------------------------------------------------------------------------
// Handler to intercept Registration form submit and register user data
// -------------------------------------------------------------------------
async function handleRegister(event) {
    event.preventDefault(); // Stop automatic page reload

    // 🔴 NEW SECURITY CHECK: If HTML5 regex pattern check fails, block execution instantly
    const form = event.currentTarget || event.target;
    if (!form.checkValidity()) {
        form.reportValidity(); // This forces the browser to show the custom tooltip message
        return; 
    }

    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value.trim();
    const number = document.getElementById("reg-number").value;
    const password = document.getElementById("reg-password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, number, password })
        });

        const result = await response.json();

        if (response.ok && result.status === "Success") {
            showAlert("Account created successfully! Please Sign In.", true);
            setTimeout(() => { switchTab("login"); }, 2000); 
        } else {
            // Display exact validation error from backend if any
            if (response.status === 422 && result.detail) {
                showAlert(`Validation Error: ${result.detail[0].msg}`, false);
            } else {
                showAlert(result.detail || "Registration failed! Check your fields.", false);
            }
        }
    } catch (error) {
        showAlert("Unable to connect to backend server!", false);
    }
}