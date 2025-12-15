import { csrftoken, notyf } from '../utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('post-create-form');
  const postsContainer = document.querySelector('#posts-container');
  const createPostUrl = postsContainer.dataset.createPostUrl;

  // Check if we need to show a "Post created" message from previous reload
  if (sessionStorage.getItem("postCreated")) {
    notyf.success("Post created successfully.");
    sessionStorage.removeItem("postCreated");
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(createPostUrl, {
        method: "POST",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrftoken
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        postsContainer.insertAdjacentHTML('afterbegin', data.html);
        form.reset();

        // Set a flag before reloading
        sessionStorage.setItem("postCreated", "true");

        // Reload page
        location.reload();
      } else {
        notyf.error('Error creating post.');
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      notyf.error("Server error.");
    }
  });
});
