import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-post]").forEach(post => {
    const deleteBtn = post.querySelector(".delete-record");

    deleteBtn?.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this post?")) return;

      const postId = post.dataset.postId;

      try {
        const response = await fetch(`/posts/delete/${postId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
          }
        });

        const data = await response.json();

        if (data.success) {
          post.closest('.card')?.remove(); // Remove the whole card
          notyf.success("Post deleted successfully.");
        } else {
          notyf.error(data.error || "Error deleting post.");
        }
      } catch (err) {
        console.error(err);
        notyf.error("Server error.");
      }
    });
  });
});
