const token = localStorage.getItem("authToken");

if (!token) {
  console.log("Admin functions are restricted to logged-in users only.");
  window.location.href = "login.html";
  document.getElementById("login-message").innerText =
    "Please log in to access admin functions.";
} else {
  console.log("Admin functions enabled.");
}
