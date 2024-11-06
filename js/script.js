"use strict";
// Function to fetch and display blog posts
async function getBlogPosts() {
  const options = {
    method: "GET",
    headers: {
      "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
      "Content-Type": "application/json",
    },
  };

  try {
    document.querySelector(".carousel-slide").innerHTML =
      "<p>Loading posts...</p>";
    document.getElementById("all-posts").innerHTML = "<p>Loading posts...</p>";

    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/cgrotteland",
      options
    );
    const responseData = await response.json();
    console.log(responseData);

    if (responseData.data) {
      const postsData = responseData.data;
      const latestPosts = postsData.slice(0, 3);
      let carouselHTML = "";
      let allPostsHTML = "";

      // Carousel for the latest posts
      latestPosts.forEach((post) => {
        carouselHTML += `<div class="carousel-item">
            <h2>${post.title}</h2>
            <p>By ${post.author.name} on ${new Date(
          post.created
        ).toLocaleDateString()}</p>
            <p>${post.body.slice(0, 80)}...</p>
            ${
              post.media?.url
                ? `<img src="${post.media.url}" alt="${post.media.alt}" />`
                : ""
            }
            <button onclick="goToPost('${post.id}')">Read More</button>
          </div>`;
      });
      document.querySelector(".carousel-slide").innerHTML = carouselHTML;

      // Carousel navigation
      let currentIndex = 0;
      document
        .querySelector(".next")
        .addEventListener("click", moveToNextSlide);
      document
        .querySelector(".prev")
        .addEventListener("click", moveToPreviousSlide);

      function updateCarousel() {
        const carouselSlide = document.querySelector(".carousel-slide");
        carouselSlide.style.transform = `translateX(${-currentIndex * 100}%)`;
      }

      function moveToNextSlide() {
        const totalItems = document.querySelectorAll(`.carousel-item`).length;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }

      function moveToPreviousSlide() {
        const totalItems = document.querySelectorAll(`.carousel-item`).length;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      }

      // All remaining posts below the carousel
      const remainingPosts = postsData.slice(3);
      remainingPosts.forEach((post) => {
        allPostsHTML += `
          <a href="./post/singlePost.html?id=${post.id}" class="post-link">
            <div class="post">
              <h2>${post.title}</h2>
              <p>By ${post.author.name} on ${new Date(
          post.created
        ).toLocaleDateString()}</p>
              ${
                post.media?.url
                  ? `<img src="${post.media.url}" alt="${
                      post.media.alt || "Blog post thumbnail"
                    }" class="post-thumbnail">`
                  : ""
              }
              <p>${post.body.slice(0, 100)}...</p>
            </div>
          </a>`;
      });

      document.getElementById("all-posts").innerHTML = allPostsHTML;
    } else {
      console.error("No data found");
      document.querySelector(".carousel-slide").innerHTML =
        "<p>No data found.</p>";
      document.getElementById("all-posts").innerHTML = "<p>No data found.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    document.querySelector(".carousel-slide").innerHTML =
      "<p>Failed to load posts. Please try again later.</p>";
    document.getElementById("all-posts").innerHTML =
      "<p>Failed to load posts. Please try again later.</p>";
  }
}

// Function to navigate to the single post page
function goToPost(postId) {
  window.location.href = `./post/singlePost.html?id=${postId}`;
}

// Initialize fetching of blog posts
getBlogPosts();
