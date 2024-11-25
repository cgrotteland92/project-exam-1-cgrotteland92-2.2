"use strict";
// ChatGPT assistance

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

function getRandomPosts(posts, count) {
  const shuffled = [...posts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function getBlogPosts() {
  const token = localStorage.getItem("authToken");
  let username = "cgrotteland";

  if (token) {
    const userDetails = decodeToken(token);
    if (userDetails?.name) {
      username = userDetails.name;
    } else {
      console.warn(
        "Failed to decode token or missing username. Using default."
      );
    }
  } else {
    console.warn("User not logged in. Defaulting to 'cgrotteland'.");
  }

  const options = {
    method: "GET",
    headers: {
      "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  };

  try {
    document.querySelector(".carousel-slide").innerHTML =
      "<p>Loading posts...</p>";
    document.getElementById("all-posts").innerHTML = "<p>Loading posts...</p>";
    document.getElementById("trending-posts").innerHTML =
      "<p>Loading posts...</p>";

    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      options
    );
    const responseData = await response.json();

    if (responseData.data) {
      const postsData = responseData.data;

      // Carousel
      const latestPosts = postsData.slice(0, 3);
      let carouselHTML = "";
      latestPosts.forEach((post) => {
        carouselHTML += `<div class="carousel-item">
          <h2>${post.title}</h2>
          <p>By ${post.author.name} on ${new Date(
          post.created
        ).toLocaleDateString()}</p>
          ${
            post.media?.url
              ? `<img src="${post.media.url}" alt="${post.media.alt || ""}" />`
              : ""
          }
          <button class="read-more" onclick="goToPost('${
            post.id
          }')">Read More</button>
        </div>`;
      });
      document.querySelector(".carousel-slide").innerHTML = carouselHTML;

      let currentIndex = 0;
      document.querySelector(".next").addEventListener("click", () => {
        const totalItems = document.querySelectorAll(`.carousel-item`).length;
        currentIndex = (currentIndex + 1) % totalItems;
        document.querySelector(
          ".carousel-slide"
        ).style.transform = `translateX(${-currentIndex * 100}%)`;
      });
      document.querySelector(".prev").addEventListener("click", () => {
        const totalItems = document.querySelectorAll(`.carousel-item`).length;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        document.querySelector(
          ".carousel-slide"
        ).style.transform = `translateX(${-currentIndex * 100}%)`;
      });

      // Trending Posts
      const trendingPosts = getRandomPosts(postsData, 3);
      let trendingHTML = "";
      trendingPosts.forEach((post) => {
        trendingHTML += `<a href="./post/singlePost.html?id=${
          post.id
        }" class="post-link">
    <div class="trending-post">
      ${
        post.media?.url
          ? `<img src="${post.media.url}" alt="${
              post.media.alt || "Trending post"
            }" class="trending-thumbnail">`
          : ""
      }
      <div class="post-content">
        <p class="post-date">${new Date(post.created).toLocaleDateString()}</p>
        <p class="post-author">By ${post.author.name}</p>
        <h2 class="post-title">${post.title}</h2>
      </div>
    </div>
  </a>`;
      });
      document.getElementById("trending-posts").innerHTML = trendingHTML;

      // All Posts
      const last12Posts = postsData.slice(-12);
      let allPostsHTML = '<div class="posts-container">';
      last12Posts.forEach((post) => {
        allPostsHTML += `<a href="./post/singlePost.html?id=${
          post.id
        }" class="post-link">
          <div class="post">
            <div class="post-image-box">
              ${
                post.media?.url
                  ? `<img src="${post.media.url}" alt="${
                      post.media.alt || "Blog post thumbnail"
                    }" class="post-thumbnail">`
                  : ""
              }
            </div>
            <div class="post-content">
              <p class="post-date">${new Date(
                post.created
              ).toLocaleDateString()}</p>
              <p class="post-author">By ${post.author.name}</p>
              <h2 class="post-title">${post.title}</h2>
              <p class="post-excerpt">${post.body.slice(0, 100)}...</p>
            </div>
          </div>
        </a>`;
      });
      allPostsHTML += "</div>";
      document.getElementById("all-posts").innerHTML = allPostsHTML;
    } else {
      throw new Error("No data found.");
    }
  } catch (error) {
    console.error("Error: ", error);
    document.querySelector(".carousel-slide").innerHTML =
      "<p>Failed to load posts. Please try again later.</p>";
    document.getElementById("all-posts").innerHTML =
      "<p>Failed to load posts. Please try again later.</p>";
    document.getElementById("trending-posts").innerHTML =
      "<p>Failed to load posts. Please try again later.</p>";
  }
}

function goToPost(postId) {
  window.location.href = `./post/singlePost.html?id=${postId}`;
}

document.addEventListener("DOMContentLoaded", () => {
  getBlogPosts();
});
