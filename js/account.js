"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    // Toggle password visibility
    document
      .getElementById("togglePassword")
      .addEventListener("change", function () {
        const passwordField = document.getElementById("password");
        passwordField.type = this.checked ? "text" : "password";
      });

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

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("authToken", data.token);
          document.getElementById("login-message").innerText =
            "Login successful!";
          document.getElementById("login-message").style.color = "green";

          // Redirect to index.html in root directory
          setTimeout(() => (window.location.href = "../index.html"), 2000);
        } else {
          const errorData = await response.json();
          document.getElementById("login-message").innerText = `Error: ${
            errorData.errors[0].message || "Login failed."
          }`;
          document.getElementById("login-message").style.color = "red";
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("login-message").innerText =
          "An error occurred. Please try again.";
        document.getElementById("login-message").style.color = "red";
      }
    });
  }
});
