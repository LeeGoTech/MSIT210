import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".comment").forEach(comment => {
    const deleteBtn = comment.querySelector(".delete-record");

    deleteBtn?.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this comment?")) return;

      try {
        const response = await fetch(`/comments/delete/${comment.dataset.commentId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
          }
        });
        const data = await response.json();

        if (data.success) {
          const commentsCountEl = comment.closest(".card-body")?.querySelector(".comments-count");
          if (commentsCountEl) {
            commentsCountEl.textContent = Math.max((parseInt(commentsCountEl.textContent) || 0) - 1, 0);
          }
          comment.remove();
          notyf.success("Comment deleted successfully.");
        } else {
          notyf.error(data.error || "Failed to delete comment.");
        }
      } catch (err) {
        console.error(err);
        notyf.error("An error occurred.");
      }
    });
  });
});
