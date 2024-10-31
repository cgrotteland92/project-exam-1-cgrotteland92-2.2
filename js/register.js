"use strict";

document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  const userData = { name, password, email };

  localStorage.setItem("user", JSON.stringify(userData));
  document.getElementById("register-form").innerText = "Registered!";

  setTimeout(() => (window.location.href = "login.html"), 2000);
});
