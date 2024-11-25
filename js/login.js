"use strict";
// ChatGPT assistance
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login-link");

  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");

  if (togglePassword && passwordField) {
    togglePassword.addEventListener("change", function () {
      passwordField.type = this.checked ? "text" : "password";
    });
  }

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
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

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          const authToken =
            data.accessToken || data.token || data.data?.accessToken;

          if (authToken) {
            localStorage.setItem("authToken", authToken);
            console.log("Token saved:", authToken);

            document.getElementById("login-message").innerText =
              "Login successful!";
            document.getElementById("login-message").style.color = "green";

            checkLoginStatus();

            setTimeout(() => {
              window.location.replace("../index.html");
            }, 2000);
          } else {
            console.error("No access token in response data:", data);
            document.getElementById("login-message").innerText =
              "No access token found in response.";
          }
        } else {
          console.error("Login failed with response:", data);
          document.getElementById("login-message").innerText = `Error: ${
            data.errors?.[0]?.message || "Login failed."
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

  // Function to check login status
  function checkLoginStatus() {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      console.log("User is logged in.");
      if (loginLink) {
        loginLink.innerText = "Logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (event) => {
          event.preventDefault();
          localStorage.removeItem("authToken");
          alert("You have been logged out.");
          window.location.replace("../index.html");
        });
      }
    } else {
      console.log("User is not logged in.");
      if (loginLink) {
        loginLink.innerText = "Login";
        loginLink.href = "../login.html";
      }
    }
  }

  // Check login status on page load
  checkLoginStatus();
});
