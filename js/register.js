const form = document.getElementById("register-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // ChatGPT assistance
  const apiKey = "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0";
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const email = document.getElementById("email").value.trim();
  function validateEmail(email) {
    const emailRules = /^[\w-.]+@stud\.noroff\.no$/;
    return emailRules.test(email);
  }

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

  if (!isValid) return;

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: {
        "X-Noroff-API-Key": apiKey,
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
