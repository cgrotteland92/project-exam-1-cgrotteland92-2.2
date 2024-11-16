"use strict";
// ChatGPT assistance
document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("authToken");
  const postId = new URLSearchParams(window.location.search).get("id");
  const username = "cgrotteland";

  if (!token) {
    alert("You must be logged in to edit or delete a post.");
    window.location.href = "/account/login.html";
    return;
  }

  if (!postId) {
    alert("No post ID found.");
    window.location.href = "../index.html";
    return;
  }

  const editForm = document.getElementById("edit-form");
  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");
  const imageInput = document.getElementById("image");
  const deleteButton = document.getElementById("delete-button");
  const editMessage = document.getElementById("edit-message");

  async function fetchPostData() {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const post = data.data;
        titleInput.value = post.title;
        bodyInput.value = post.body;
        if (post.media?.url) imageInput.value = post.media.url;
      } else {
        throw new Error("Post not found or unable to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
      alert("Error loading post data.");
    }
  }

  await fetchPostData();

  // Edit
  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedData = {
      title: titleInput.value,
      body: bodyInput.value,
      media: imageInput.value ? { url: imageInput.value } : null,
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`,
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
        editMessage.innerText = "Post updated successfully!";
        editMessage.style.color = "green";
        setTimeout(() => (window.location.href = "../index.html"), 2000);
      } else {
        throw new Error("Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      editMessage.innerText = "Error updating post. Please try again.";
      editMessage.style.color = "red";
    }
  });

  // Delete
  deleteButton.addEventListener("click", async function () {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Post deleted successfully!");
        window.location.href = "../index.html";
      } else {
        throw new Error("Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred. Please try again.");
    }
  });
});