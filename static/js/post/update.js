import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-post]").forEach(post => {
    const view = post.querySelector(".post-view");
    const edit = post.querySelector(".post-edit");

    edit?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const postId = post.dataset.postId;
      const title = edit.querySelector(".post-title-input").value;
      const body = edit.querySelector(".post-body-input").value;

      try {
        const response = await fetch(`/posts/update/${postId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
          },
          body: new URLSearchParams({ title, body })
        });
        const data = await response.json();

        if (data.success) {
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
