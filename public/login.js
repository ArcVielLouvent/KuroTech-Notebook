document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Simpan token dan role di localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      alert("Login successful!");
      window.location.href = "notebook.html"; // arahkan ke halaman notebook
    } else {
      alert(data.message || "Login failed!");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Unable to connect to server.");
  }
});
