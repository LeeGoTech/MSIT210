document.addEventListener("DOMContentLoaded", () => {
  var deleteComment = false;
  // Global function for getting CSRF cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  // Create an instance of Notyf
  var notyf = new Notyf({
    position: {
      x: 'right',
      y: 'top',
      duration: 3000,
    },
  });

  const form = document.getElementById('post-create-form');
  const postsContainer = document.querySelector('#posts-container');
  const createPostUrl = postsContainer.dataset.createPostUrl; // ✅ correct

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const response = await fetch(createPostUrl, {  // <-- use variable, not template tag
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
      notyf.success('Post created successfully');
      setTimeout(function() {
        location.reload();
      }, 3000);
    } else {
      notyf.error('Error creating post');
      console.error(data);
    }
  });

  document.querySelectorAll("[data-post]").forEach(post => {
    const view = post.querySelector(".post-view")
    const edit = post.querySelector(".post-edit")
    const editBtn = post.querySelector(".edit-post")
    const cancelBtn = post.querySelector(".cancel-edit")

    editBtn.addEventListener("click", () => {
      view.classList.add("d-none")
      edit.classList.remove("d-none")
    })

    cancelBtn.addEventListener("click", () => {
      edit.classList.add("d-none")
      view.classList.remove("d-none")
    })

    edit.addEventListener("submit", async (e) => {
      e.preventDefault()
      const postId = post.dataset.postId
      const title = edit.querySelector(".post-title-input").value
      const body = edit.querySelector(".post-body-input").value

      try {
        const response = await fetch(`/posts/update/${postId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
          },
          body: new URLSearchParams({ title, body })
        })

        const data = await response.json()
        if (data.success) {
          // Update UI
          view.querySelector(".post-title").textContent = data.title
          view.querySelector(".post-body").textContent = data.body

          edit.classList.add("d-none")
          view.classList.remove("d-none")

          notyf.success("Post updated successfully")
        } else {
          notyf.error(data.error || "Error updating post")
        }
      } catch (error) {
        console.error(error)
        notyf.error("Server error")
      }
    })

    // Delete
    const deleteBtn = post.querySelector(".delete-record")
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this post?")) return;

      const postId = post.dataset.postId

      try {
        const response = await fetch(`/posts/delete/${postId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
          }
        })

        const data = await response.json()
        if (data.success) {
          post.closest('.card')?.remove() // remove the entire card
          notyf.success("Post deleted successfully")
        } else {
          notyf.error(data.error || "Error deleting post")
        }
      } catch (error) {
        console.error(error)
        notyf.error("Server error")
      }
    })
  })

  document.querySelectorAll(".comment").forEach(comment => {
    const view = comment.querySelector(".comment-view")
    const edit = comment.querySelector(".comment-edit")
    const content = comment.querySelector(".comment-content")

    const textEl = comment.querySelector(".comment-text")
    const textarea = comment.querySelector(".edit-comment-text")

    const commentId = comment.dataset.commentId

    // Edit button
    comment.querySelector(".edit-comment").addEventListener("click", () => {
      textarea.value = textEl.textContent.trim()
      view.classList.add("d-none")
      edit.classList.remove("d-none")
      content.classList.add("flex-grow-1")
      textarea.focus()
    })

    // Cancel button
    comment.querySelector(".cancel-comment-edit").addEventListener("click", () => {
      edit.classList.add("d-none")
      view.classList.remove("d-none")
      content.classList.remove("flex-grow-1")
    })

    // Save button -> submit edit to backend
    edit.addEventListener("submit", async e => {
      e.preventDefault()

      const formData = new FormData()
      formData.append("text", textarea.value)
      formData.append("csrfmiddlewaretoken", document.querySelector('[name=csrfmiddlewaretoken]').value)

      try {
        const response = await fetch(`/comments/update/${commentId}/`, {
          method: "POST",
          body: formData,
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          }
        })

        const data = await response.json()

        if (data.success) {
          // Update frontend
          textEl.textContent = data.comment.text
          edit.classList.add("d-none")
          view.classList.remove("d-none")
          content.classList.remove("flex-grow-1")
          notyf.success("Comment updated successfully")
        } else {
          notyf.error("Failed to update comment")
          console.error(data.errors)
        }
      } catch (error) {
        console.error(error)
        notyf.error("An error occurred")
      }
    })

    const deleteBtn = comment.querySelector(".delete-record")

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this comment?")) return

      try {
        const response = await fetch(`/comments/delete/${commentId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
          }
        })
        const data = await response.json()
        if (data.success) {


          // Update comments count
          const commentsCountEl = comment.closest(".card-body").querySelector(".comments-count")
          if (commentsCountEl) {
            let count = parseInt(commentsCountEl.textContent)
            commentsCountEl.textContent = Math.max(count - 1, 0)
          }
          // Remove comment from DOM
          comment.remove()

          notyf.success("Comment deleted successfully")
        } else {
          notyf.error(data.error || "Failed to delete comment")
        }
      } catch (err) {
        console.error(err)
        notyf.error("An error occurred")
      }
    })
  })

  document.querySelectorAll("[data-comment-form]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault()
      const postId = form.dataset.postId
      const textarea = form.querySelector(".new-comment-text")
      const text = textarea.value.trim()
      if (!text) return

      try {
        const response = await fetch(`/comments/create/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({ post_id: postId, text, author: "You" })
        })
        const data = await response.json()
        if (data.success) {
          const commentsContainer = form.closest(".card-body").querySelector(".comments-container")
          commentsContainer.insertAdjacentHTML("beforeend", data.html)
          textarea.value = ""

          const countEl = form.closest(".card-body").querySelector(".comments-count")
          if (countEl) {
            const currentCount = parseInt(countEl.textContent, 10) || 0
            countEl.textContent = currentCount + 1
          }

          notyf.success("Comment added successfully")
          setTimeout(function() {
            location.reload();
          }, 3000);
        } else if(deleteComment){

        }else {
          notyf.error(data.error || "Error adding comment")
        }
      } catch (error) {
        console.error(error)
        notyf.error("Server error")
      }
    })
  })
})