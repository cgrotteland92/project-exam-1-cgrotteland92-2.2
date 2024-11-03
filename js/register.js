"use strict";

document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/api/v2/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        document.getElementById("login-message").innerText =
          "Login successful!";
        document.getElementById("login-message").style.color = "green";
        setTimeout(() => (window.location.href = "feed.html"), 2000);
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
