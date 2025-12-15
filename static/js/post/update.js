import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-post]").forEach(post => {
    const view = post.querySelector(".post-view");
    const edit = post.querySelector(".post-edit");
    const editBtn = post.querySelector(".edit-post");
    const cancelBtn = post.querySelector(".cancel-edit");

    if (!view || !edit || !editBtn || !cancelBtn) return;

    // Show edit form
    editBtn.addEventListener("click", () => {
      view.classList.add("d-none");
      edit.classList.remove("d-none");
    });

    // Cancel edit
    cancelBtn.addEventListener("click", () => {
      edit.classList.add("d-none");
      view.classList.remove("d-none");
    });

    // Submit update
    edit.addEventListener("submit", async (e) => {
      e.preventDefault();

      const postId = post.dataset.postId;
      const title = edit.querySelector(".post-title-input")?.value;
      const body = edit.querySelector(".post-body-input")?.value;

      try {
        const response = await fetch(`/posts/update/${postId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({ title, body })
        });

        const data = await response.json();

        if (data.success) {
          // Update UI
          view.querySelector(".post-title").textContent = data.title;
          view.querySelector(".post-body").textContent = data.body;

          edit.classList.add("d-none");
          view.classList.remove("d-none");

          notyf.success("Post updated successfully.");
        } else {
          notyf.error(data.error || "Error updating post.");
        }
      } catch (error) {
        console.error(error);
        notyf.error("Server error.");
      }
    });
  });
});
