document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: fetchImagesFromPage
      },
      (results) => {
        const imageContainer = document.getElementById("image-container");
        if (results && results[0].result.length > 0) {
          results[0].result.forEach((src) => {
            const img = document.createElement("img");
            img.src = src;
            imageContainer.appendChild(img);
          });
        } else {
          imageContainer.textContent = "No images found.";
        }
      }
    );
  });
});

function fetchImagesFromPage() {
  return Array.from(document.images).map((img) => img.src);
}
