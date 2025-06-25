document.addEventListener("DOMContentLoaded", () => {
  const deleteForms = document.querySelectorAll(
    'form[action*="_method=DELETE"]'
  );

  deleteForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this movie?"
      );
      if (!confirmDelete) {
        event.preventDefault(); // Stop the form from submitting if user cancels
      }
    });
  });
});
