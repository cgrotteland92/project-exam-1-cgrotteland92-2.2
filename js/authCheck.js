const isAdminPage = window.location.pathname.endsWith("edit.html");

if (isAdminPage) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("Admin functions are restricted to logged-in users only.");
    setTimeout(() => {
      window.location.href = "../account/login.html";
    }, 100);
  } else {
    console.log("Admin functions enabled.");
  }
} else {
  console.log("Public page - no authentication required.");
}
