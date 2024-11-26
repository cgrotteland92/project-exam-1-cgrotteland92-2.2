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

async function allNewsPage() {
  const token = localStorage.getItem("authToken");
  let username = "cgrotteland"; // Default to "cgrotteland" for public view

  if (token) {
    const userDetails = decodeToken(token);
    if (userDetails?.name) {
      username = userDetails.name;
    } else {
      console.warn(
        "Failed to decode token or missing username. Defaulting to 'cgrotteland'."
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
    const allNewsContainer = document.getElementById("all-news");
    const tagDropdown = document.getElementById("tag-dropdown");
    const sortDropdown = document.getElementById("sort-dropdown");
    const createPostButton = document.getElementById("create-post-button");
    const createPostForm = document.getElementById("create-post-form");

    if (
      !allNewsContainer ||
      !tagDropdown ||
      !sortDropdown ||
      !createPostButton ||
      !createPostForm
    ) {
      throw new Error("Required elements not found.");
    }

    allNewsContainer.innerHTML = "<p>Loading news...</p>";

    // Fetch blog posts dynamically using the username
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      options
    );
    const responseData = await response.json();

    if (responseData.data) {
      let newsData = responseData.data;

      if (token) {
        createPostButton.style.display = "block";
      }

      const uniqueTags = Array.from(
        new Set(newsData.flatMap((news) => news.tags || []))
      );
      let tagDropdownHTML = '<option value="all">All</option>';
      uniqueTags.forEach((tag) => {
        tagDropdownHTML += `<option value="${tag}">${tag}</option>`;
      });
      tagDropdown.innerHTML = tagDropdownHTML;

      renderNews(newsData);

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

      sortDropdown.addEventListener("change", (event) => {
        const sortValue = event.target.value;
        if (sortValue === "newest") {
          newsData = sortPosts(newsData, "newest");
        } else if (sortValue === "oldest") {
          newsData = sortPosts(newsData, "oldest");
        }
        renderNews(newsData);
      });

      // Show the create post form only if the user is logged in
      if (token) {
        createPostForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const title = document.getElementById("post-title").value.trim();
          const body = document.getElementById("post-body").value.trim();
          const tags = document
            .getElementById("post-tags")
            .value.split(",")
            .map((tag) => tag.trim());
          const mediaUrl = document.getElementById("post-media").value.trim();

          if (!title || !body) {
            alert("Title and body are required!");
            return;
          }

          const postData = {
            title,
            body,
            tags,
            media: mediaUrl ? { url: mediaUrl } : null,
          };

          try {
            const response = await fetch(
              `https://v2.api.noroff.dev/blog/posts/${username}`,
              {
                method: "POST",
                headers: {
                  "X-Noroff-API-Key": "ca9fdebf-7c0e-4858-8136-c2e58a3c24f0",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
              }
            );

            const responseData = await response.json();
            console.log("API Response:", responseData);

            if (response.ok) {
              alert("Post created successfully!");
              createPostForm.reset();
              allNewsPage();
            } else {
              console.error("Failed to create post:", responseData);
              alert(
                `Failed to create post. Error: ${
                  responseData.errors?.[0]?.message || "Unknown error"
                }`
              );
            }
          } catch (error) {
            console.error("Error creating post:", error);
            alert(
              "An error occurred while creating the post. Please try again."
            );
          }
        });
      } else {
        createPostButton.style.display = "none";
      }
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
