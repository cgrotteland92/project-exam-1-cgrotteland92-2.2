// authCheck.js

const token = localStorage.getItem("authToken");

if (!token) {
  // Display a message indicating that editing and deleting require login
  console.log("Admin functions are restricted to logged-in users only.");
} else {
  console.log("Admin functions enabled.");
}
