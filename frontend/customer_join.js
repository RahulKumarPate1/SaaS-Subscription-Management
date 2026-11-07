const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function triggerFieldError(inputElementId, errorElementId, condition, errorMessage) {
    const inputField = document.getElementById(inputElementId);
    const errorTag = document.getElementById(errorElementId);
    
    if (condition) {
        errorTag.innerText = errorMessage;
        errorTag.classList.remove("hidden");
        inputField.classList.add("border-red-500");
    } else {
        errorTag.classList.add("hidden");
        inputField.classList.remove("border-red-500");
    }
}

// Realtime Blur Triggers
document.getElementById("custName").addEventListener("blur", function() {
    triggerFieldError("custName", "nameError", this.value.trim().length < 2 && this.value.trim().length > 0, "Name field requires at least 2 characters.");
});

document.getElementById("custEmail").addEventListener("blur", function() {
    const val = this.value.trim();
    triggerFieldError("custEmail", "emailError", val.length > 0 && !emailRegex.test(val), "Invalid Email: Missing '@' or domain extension (e.g., .com).");
});

document.getElementById("custNumber").addEventListener("blur", function() {
    const val = this.value.trim();
    triggerFieldError("custNumber", "numberError", val.length > 0 && (val.length < 10 || isNaN(val)), "Invalid Phone: Must contain exactly 10 numeric digits.");
});

// Form Submit Implementation
document.getElementById("onboardingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const activeAppId = urlParams.get("app_id") || "1";

    const name = document.getElementById("custName").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const number = document.getElementById("custNumber").value.trim();
    const sendEmail = document.getElementById("sendEmail").checked;
    const sendSms = document.getElementById("sendSms").checked;

    if (name.length < 2 || !emailRegex.test(email) || number.length < 10 || isNaN(number)) {
        return; 
    }

    // Mapping payload structure exactly matching backend direct parsing keys
    const payload = {
        app_id: parseInt(activeAppId),
        name: name,
        email: email,
        number: number,
        send_email: sendEmail,
        send_sms: sendSms
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/subscriptions/customers/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Success! Your preference matrix has been securely synchronized.");
            document.getElementById("onboardingForm").reset();
        } else {
            alert("Server Error: " + (result.detail || "Unable to parse request."));
        }
    } catch (error) {
        alert("Network linkage error to backend engine matrix.");
    }
});