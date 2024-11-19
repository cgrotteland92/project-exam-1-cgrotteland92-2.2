"use strict";

async function allNewsPage() {
  const token = localStorage.getItem("authToken");

  const options = {
    method: "GET",
    headers: {
      "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const allNewsContainer = document.getElementById("all-news");
    if (!allNewsContainer) {
      throw new Error("Element with ID 'all-news' not found.");
    }
    allNewsContainer.innerHTML = "<p>Loading news...</p>";

    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/cgrotteland",
      options
    );
    const responseData = await response.json();

    if (responseData.data) {
      const newsData = responseData.data;

      let allNewsHTML = '<div class="news-container">';
      newsData.forEach((news) => {
        allNewsHTML += `<a href="./post/singlePost.html?id=${
          news.id
        }" class="news-link">
          <div class="news-item">
            <div class="news-image-box">
              ${
                news.media?.url
                  ? `<img src="${news.media.url}" alt="${
                      news.media.alt || "News thumbnail"
                    }" class="news-thumbnail">`
                  : ""
              }
            </div>
            <div class="news-content">
              <p class="news-date">${new Date(
                news.created
              ).toLocaleDateString()}</p>
              <p class="news-author">By ${news.author.name}</p>
              <h2 class="news-title">${news.title}</h2>
              <p class="news-excerpt">${news.body.slice(0, 100)}...</p>
            </div>
          </div>
        </a>`;
      });
      allNewsHTML += "</div>";
      allNewsContainer.innerHTML = allNewsHTML;
    } else {
      throw new Error("No data found.");
    }
  } catch (error) {
    console.error("Error: ", error);
    const allNewsContainer = document.getElementById("all-news");
    if (allNewsContainer) {
      allNewsContainer.innerHTML =
        "<p>Failed to load news. Please try again later.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  allNewsPage();
});
