"use strict";
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function getSinglePost() {
  const postId = getPostIdFromUrl();
  if (!postId) {
    document.getElementById("post-content").innerHTML = "<p>Post not found</p>";
    return;
  }
  const options = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2dyb3R0ZWxhbmQiLCJlbWFpbCI6ImNocmdybzAyMTIyQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzI5NzA4ODYzfQ.7JaI651Kw-OpJGMp-HlM4n3WUcV_12YHYfzJygZZWRA",
      "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/cgrotteland/${postId}`,
      options
    );
    const result = await response.json();

    console.log("Fetch result:", result);

    if (result.data) {
      // Chat GPT assistance as my code was not working, result.data was object not array
      const post = result.data;
      displayPost(post);
    } else {
      document.getElementById("post-content").innerHTML =
        "<p>Post not found</p>";
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    document.getElementById("post-content").innerHTML = "<p>Post not found</p>";
  }
}

function displayPost(post) {
  const postContainer = document.getElementById("post-content");
  if (!post.title) {
    postContainer.innerHTML = "<p>Post not found</p>";
    return;
  }

  postContainer.innerHTML = `
    <h1>${post.title}</h1>
    <p>By ${post.author?.name || "Unknown author"} on ${new Date(
    post.created
  ).toLocaleDateString()}</p>
    ${
      post.media?.url
        ? `<img src="${post.media.url}" alt="${
            post.media.alt || "Blog post image"
          }" class="post-image">`
        : ""
    }
    <div class="post-body">${post.body || "Content not available."}</div>
  `;
}

// ChatGPT assistance
function displayShareableLink() {
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
displayShareableLink();
