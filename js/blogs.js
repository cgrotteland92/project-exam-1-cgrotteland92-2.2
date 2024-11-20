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
    const tagDropdown = document.getElementById("tag-dropdown");
    const sortDropdown = document.getElementById("sort-dropdown");

    if (!allNewsContainer || !tagDropdown || !sortDropdown) {
      throw new Error("Required elements not found.");
    }

    allNewsContainer.innerHTML = "<p>Loading news...</p>";

    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/cgrotteland",
      options
    );
    const responseData = await response.json();

    if (responseData.data) {
      let newsData = responseData.data;

      // Dropdown - chatgpt assistance
      const uniqueTags = Array.from(
        new Set(newsData.flatMap((news) => news.tags || []))
      );
      let tagDropdownHTML = '<option value="all">All</option>';
      uniqueTags.forEach((tag) => {
        tagDropdownHTML += `<option value="${tag}">${tag}</option>`;
      });
      tagDropdown.innerHTML = tagDropdownHTML;

      //
      renderNews(newsData);

      // Filter Tag
      tagDropdown.addEventListener("change", (event) => {
        const selectedTag = event.target.value;
        if (selectedTag === "all") {
          renderNews(newsData);
        } else {
          const filteredNews = newsData.filter((news) =>
            news.tags.includes(selectedTag)
          );
          renderNews(filteredNews);
        }
      });

      // Filter Date
      sortDropdown.addEventListener("change", (event) => {
        const sortValue = event.target.value;
        if (sortValue === "newest") {
          newsData = sortPosts(newsData, "newest");
        } else if (sortValue === "oldest") {
          newsData = sortPosts(newsData, "oldest");
        }
        renderNews(newsData);
      });
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

function sortPosts(posts, sortOrder) {
  return posts.sort((a, b) => {
    const dateA = new Date(a.created);
    const dateB = new Date(b.created);

    if (sortOrder === "newest") {
      return dateB - dateA;
    } else if (sortOrder === "oldest") {
      return dateA - dateB;
    }
  });
}

function renderNews(newsData) {
  const allNewsContainer = document.getElementById("all-news");
  if (!allNewsContainer) return;

  if (newsData.length === 0) {
    allNewsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

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
}

document.addEventListener("DOMContentLoaded", () => {
  allNewsPage();
});
