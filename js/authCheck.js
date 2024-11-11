// Check if the current page is an admin-only page
const isAdminPage = window.location.pathname.includes("admin"); // Replace with the specific path for admin-only pages

if (isAdminPage) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("Admin functions are restricted to logged-in users only.");
    // Redirect to the login page if the user is not authenticated
    setTimeout(() => {
      window.location.href = "../account/login.html";
    }, 100);
  } else {
    console.log("Admin functions enabled.");
  }
} else {
  console.log("Public page - no authentication required.");
}
