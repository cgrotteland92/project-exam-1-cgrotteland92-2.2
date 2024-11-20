"use strict";
// ChatGPT assistance
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function getSinglePost() {
  const postId = getPostIdFromUrl();
  const postContainer = document.getElementById("post-content");

  postContainer.innerHTML = "";

  if (!postId) {
    postContainer.innerHTML = "<p>Post not found</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/cgrotteland/${postId}`,
      {
        method: "GET",
        headers: {
          "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2dyb3R0ZWxhbmQiLCJlbWFpbCI6ImNocmdybzAyMTIyQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzI5NzA4ODYzfQ.7JaI651Kw-OpJGMp-HlM4n3WUcV_12YHYfzJygZZWRA",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      displayPost(result.data);
    } else {
      console.error("Error fetching post:", response.status);
      postContainer.innerHTML = "<p>Post not found or unauthorized.</p>";
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    postContainer.innerHTML = "<p>Post not found.</p>";
  }
}

function displayPost(post) {
  const postContainer = document.getElementById("post-content");
  const authToken = localStorage.getItem("authToken");

  if (!post || !post.title) {
    postContainer.innerHTML = "<p>Post not found</p>";
    return;
  }

  postContainer.innerHTML = `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
    ${
      post.media?.url
        ? `<img src="${post.media.url}" alt="${
            post.media.alt || "Blog post image"
          }" class="post-image">`
        : ""
    }
  `;

  if (authToken) {
    postContainer.innerHTML += `
      <button id="edit-post-button">Edit</button>
    `;
    const editButton = document.getElementById("edit-post-button");
    editButton.addEventListener("click", () => editPost(post.id));
  }
}

function editPost(postId) {
  window.location.href = `edit.html?id=${postId}`;
}

async function deletePost(postId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You must be logged in to delete a post.");
    return;
  }

  const confirmation = confirm("Are you sure you want to delete this post?");
  if (!confirmation) return;

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/cgrotteland/${postId}`,
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
      console.error("Failed to delete post:", response.statusText);
      alert("Failed to delete post. You may not have permission.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("An error occurred while deleting the post.");
  }
}

function ShareableLink() {
  const shareableLink = `${window.location.href}`;
  const linkContainer = document.getElementById("share-link");

  linkContainer.addEventListener("click", (event) => {
    event.preventDefault();

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying link to clipboard", err);
      });
  });
}

getSinglePost();
ShareableLink();
