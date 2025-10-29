export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving...",
  deletingText = "Deleting..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
    if (isLoading) {
      btn.textContent = deletingText;
    }
  }
}
