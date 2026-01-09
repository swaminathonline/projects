let isSignup = false;

/* 🔗 LIVE BACKEND URL */
const API_BASE = "https://proposal-fuwy.onrender.com";

function requireLogin() {
    document.getElementById("auth").scrollIntoView({
        behavior: "smooth"
    });
}

/* SWITCH LOGIN ↔ SIGNUP */
function switchToSignup() {
    isSignup = true;

    document.getElementById("auth-title").innerText = "Create Your Account 💝";
    document.getElementById("auth-subtitle").innerText =
        "Sign up and start creating magical proposals";

    document.getElementById("name").style.display = "block";
    document.querySelector("button[type='submit']").innerText = "Create Account";

    document.querySelector(".toggle-text").innerHTML =
        `Already have an account? <span onclick="switchToLogin()">Login</span>`;
}

function switchToLogin() {
    isSignup = false;

    document.getElementById("auth-title").innerText = "Login to Continue ";
    document.getElementById("auth-subtitle").innerText =
        "Please login to access this feature";

    document.getElementById("name").style.display = "none";
    document.querySelector("button[type='submit']").innerText = "Login";

    document.querySelector(".toggle-text").innerHTML =
        `Don’t have an account? <span onclick="switchToSignup()">Sign Up</span>`;
}

/* FORM SUBMIT */
document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const url = isSignup
        ? `${API_BASE}/api/auth/signup`
        : `${API_BASE}/api/auth/login`;

    const body = isSignup
        ? { name, email, password }
        : { email, password };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Something went wrong");
            return;
        }

        /* ✅ LOGIN SUCCESS */
        if (!isSignup) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href =
                "https://techy-ui.github.io/proposal/Frontend/dashboard/dashboard.html";
        }

        /* ✅ SIGNUP SUCCESS */
        if (isSignup) {
            alert("Signup successful! Please login.");
            switchToLogin();
        }

    } catch (err) {
        alert("Server error. Try again later.");
    }
});
