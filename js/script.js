"use strict";
// ChatGPT for const options
async function getBlogPosts() {
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

      latestPosts.forEach((post) => {
        carouselHTML += `<div class="carousel-item">
            <h2>${post.title}</h2>
            <p>By ${post.author.name} on ${new Date(
          post.created
        ).toLocaleDateString()}</p>
            <p>${post.body.slice(0, 100)}...</p>
            ${
              post.media?.url
                ? `<img src="${post.media.url}" alt="${post.media.alt}" />`
                : ""
            }
            <button onclick="goToPost('${post.id}')">Read More</button>
          </div>`;
      });
      document.querySelector(".carousel-slide").innerHTML = carouselHTML;

      postsData.forEach((post) => {
        allPostsHTML += `
          <div class="post">
            <h2>${post.title}</h2>
            <p>By ${post.author.name} on ${new Date(
          post.created
        ).toLocaleDateString()}</p>
            <p>${post.body.slice(0, 100)}...</p>
            ${
              post.media?.url
                ? `<img src="${post.media.url}" alt="${post.media.alt}" />`
                : ""
            }
            <button onclick="goToPost('${post.id}')">Read More</button>
          </div>`;
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

function goToPost(postId) {
  window.location.href = `./post/index.html?id=${postId}`;
}

getBlogPosts();

let currentIndex = 0;

document.querySelector(".next").addEventListener("click", () => {
  moveToNextSlide();
});

document.querySelector(".prev").addEventListener("click", () => {
  moveToPreviousSlide();
});

function updateCarousel() {
  const carouselSlide = document.querySelector(".carousel-slide");
  carouselSlide.style.transform = `translateX(${-currentIndex * 100}%)`;
}

function moveToNextSlide() {
  const totalItems = document.querySelectorAll(`.carousel-item`).length;
  if (currentIndex >= totalItems - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  updateCarousel();
}

function moveToPreviousSlide() {
  const totalItems = document.querySelectorAll(`.carousel-item`).length;
  if (currentIndex <= 0) {
    currentIndex = totalItems - 1;
  } else {
    currentIndex--;
  }
  updateCarousel();
}
