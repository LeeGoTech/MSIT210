import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".comment").forEach(comment => {
    const view = comment.querySelector(".comment-view");
    const edit = comment.querySelector(".comment-edit");
    const textEl = comment.querySelector(".comment-text");
    const textarea = comment.querySelector(".edit-comment-text");
    const content = comment.querySelector(".comment-content");
    const commentId = comment.dataset.commentId;

    // Edit button
    comment.querySelector(".edit-comment")?.addEventListener("click", () => {
      textarea.value = textEl.textContent.trim();
      view.classList.add("d-none");
      edit.classList.remove("d-none");
      content.classList.add("flex-grow-1");
      textarea.focus();
    });

    // Cancel button
    comment.querySelector(".cancel-comment-edit")?.addEventListener("click", () => {
      edit.classList.add("d-none");
      view.classList.remove("d-none");
      content.classList.remove("flex-grow-1");
    });

    // Save button
    edit?.addEventListener("submit", async e => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("text", textarea.value);
      formData.append("csrfmiddlewaretoken", csrftoken);

      try {
        const response = await fetch(`/comments/update/${commentId}/`, {
          method: "POST",
          body: formData,
          headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        const data = await response.json();

        if (data.success) {
          textEl.textContent = data.comment.text;
          edit.classList.add("d-none");
          view.classList.remove("d-none");
          content.classList.remove("flex-grow-1");
          notyf.success("Comment updated successfully.");
        } else {
          notyf.error("Failed to update comment.");
          console.error(data.errors);
        }
      } catch (error) {
        console.error(error);
        notyf.error("An error occurred.");
      }
    });
  });
});
