"use strict";
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Single Post
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
    <div class="post-info">
      <span>By ${post.author.name}</span>
      <span>Date: ${new Date(post.created).toLocaleDateString()}</span>
    </div>
    ${
      post.media?.url
        ? `<img src="${post.media.url}" alt="${
            post.media.alt || "Blog post image"
          }" class="post-image">`
        : ""
    }
    <p>${post.body}</p>
    <div class="post-actions">
      <a id="share-link" href="#" target="_blank" class="share-button">Copy Link</a>
    </div>
  `;

  if (authToken) {
    postContainer.innerHTML += `
      <button id="edit-post-button">Edit</button>
    `;
    const editButton = document.getElementById("edit-post-button");
    editButton.addEventListener("click", () => editPost(post.id));
  }

  ShareableLink();
}

// Trending Posts
async function fetchTrendingPosts() {
  const trendingList = document.querySelector(".trending-list");

  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/cgrotteland",
      {
        method: "GET",
        headers: {
          "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      const posts = result.data;
      const trendingPosts = posts.slice(0, 5);

      trendingList.innerHTML = trendingPosts
        .map(
          (post, index) => `
      <li class="trending-item">
          <a href="singlePost.html?id=${post.id}" class="trending-link">
            <div class="trending-content">
              <img src="${post.media?.url}" alt="${post.title}" />
              <div>
                <h3>${post.title}</h3>
              </div>
            </div>
          </a>
        </li>
      `
        )
        .join("");
    } else {
      console.error("Failed to fetch trending posts:", response.statusText);
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Edit Post
function editPost(postId) {
  window.location.href = `edit.html?id=${postId}`;
}

function ShareableLink() {
  const shareableLink = `${window.location.href}`;
  const linkContainer = document.getElementById("share-link");

  if (!linkContainer) {
    console.error("Share link element not found.");
    return;
  }

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

// Initialize
getSinglePost();
fetchTrendingPosts();
