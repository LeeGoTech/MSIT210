import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  // Check if we need to show a "Comment added" message from previous reload
  if (sessionStorage.getItem("commentAdded")) {
    notyf.success("Comment added successfully.");
    sessionStorage.removeItem("commentAdded");
  }

  document.querySelectorAll("[data-comment-form]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const postId = form.dataset.postId;
      const textarea = form.querySelector(".new-comment-text");
      const text = textarea.value.trim();
      if (!text) return;

      try {
        const response = await fetch(`/comments/create/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({ post_id: postId, text, author: "You" })
        });
        const data = await response.json();

        if (data.success) {
          // Set a flag in sessionStorage before reload
          sessionStorage.setItem("commentAdded", "true");

          // Reload page
          location.reload();
        } else {
          notyf.error(data.error || "Error adding comment.");
        }
      } catch (error) {
        console.error(error);
        notyf.error("Server error.");
      }
    });
  });
});
