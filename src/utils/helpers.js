export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    // Set the loading text
    console.log(`Setting text to ${loadingText}`);
  } else {
    // Set non loading text
  }
}
