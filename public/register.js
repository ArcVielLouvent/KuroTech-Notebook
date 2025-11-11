// register.js
const registerForm = document.getElementById("register-form");
const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = registerUsername.value;
    const password = registerPassword.value;

    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registration successful! Please sign in.");
            location.href = "login.html";
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error, try again later.");
    }
});
