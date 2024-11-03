"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    // Toggle password visibility
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");

    if (togglePassword && passwordField) {
      togglePassword.addEventListener("change", function () {
        passwordField.type = this.checked ? "text" : "password";
      });
    }

    // Handle form submission
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email === "" || password === "") {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
          method: "POST",
          headers: {
            "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        console.log(`Response status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("authToken", data.token);

          const loginMessage = document.getElementById("login-message");
          if (loginMessage) {
            loginMessage.innerText = "Login successful!";
            loginMessage.style.color = "green";
          }

          // Redirect to index.html in root directory
          setTimeout(() => (window.location.href = "../index.html"), 2000);
        } else {
          const errorData = await response.json();
          const loginMessage = document.getElementById("login-message");
          if (loginMessage) {
            loginMessage.innerText = `Error: ${
              errorData.errors[0].message || "Login failed."
            }`;
            loginMessage.style.color = "red";
          }
        }
      } catch (error) {
        console.error("Error:", error);
        const loginMessage = document.getElementById("login-message");
        if (loginMessage) {
          loginMessage.innerText = "An error occurred. Please try again.";
          loginMessage.style.color = "red";
        }
      }
    });
  }
});
