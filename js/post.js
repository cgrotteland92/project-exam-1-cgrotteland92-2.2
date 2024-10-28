"use strict";
function getPostFromUrl() {
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
      `https://v2.api.noroff.dev/blog/posts/${postId}`,
      options
    );
    const post = await response.json();

    displayPost(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    document.getElementById("post-content").innerHTML = "<p>Post not found</p>";
  }
}
