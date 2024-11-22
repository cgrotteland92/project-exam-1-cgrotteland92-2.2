"use strict";
// ChatGPT assistance
const form = document.getElementById("register-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  clearErrors();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  let isValid = true;

  if (username === "") {
    showError("usernameError", "Username is required.");
    isValid = false;
  }

  if (!validateEmail(email)) {
    showError("emailError", "Please enter a valid email.");
    isValid = false;
  }

  if (password.length < 8) {
    showError("passwordError", "Password must be at least 8 characters long.");
    isValid = false;
  }

  if (!isValid) return; // Stop if validation fails

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: {
        "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, email, password }),
    });

    if (response.ok) {
      alert("Registration successful!");
      form.reset();
      window.location.href = "login.html";
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred while registering. Please try again later.");
  }
});
