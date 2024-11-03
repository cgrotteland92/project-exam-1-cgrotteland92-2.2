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

          loginMessage.className = "success";
          loginMessage.innerText = "Login successful!";
          loginMessage.style.display = "block";

          setTimeout(() => (window.location.href = "../index.html"), 2000);
        } else {
          const errorData = await response.json();

          loginMessage.className = "error";
          loginMessage.innerText = `Error: ${
            errorData.errors[0].message || "Login failed."
          }`;
          loginMessage.style.display = "block";
        }
      } catch (error) {
        console.error("Error:", error);

        loginMessage.className = "error";
        loginMessage.innerText = "An error occurred. Please try again.";
        loginMessage.style.display = "block";
      }
    });
  }
});
