"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("You must be logged in to edit a post.");
    window.location.href = "/account/login.html";
  }

  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    alert("No post ID found.");
    window.location.href = "../index.html";
  }

  async function fetchPostData() {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
          },
        }
      );
      const data = await response.json();
      const post = data.data;

      document.getElementById("title").value = post.title;
      document.getElementById("body").value = post.body;
      if (post.media?.url) {
        document.getElementById("image").value = post.media.url;
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
      alert("Error loading post data.");
    }
  }

  fetchPostData();

  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const imageUrl = document.getElementById("image").value;

    const updatedData = {
      title: title,
      body: body,
      media: imageUrl ? { url: imageUrl } : null,
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        document.getElementById("edit-message").innerText =
          "Post updated successfully!";
        document.getElementById("edit-message").style.color = "green";
        setTimeout(() => (window.location.href = "../index.html"), 2000);
      } else {
        throw new Error("Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      document.getElementById("edit-message").innerText =
        "Error updating post. Please try again.";
      document.getElementById("edit-message").style.color = "red";
    }
  });
});
