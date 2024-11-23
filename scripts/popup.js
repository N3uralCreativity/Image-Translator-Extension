// popup.js
const worker = Tesseract.createWorker({
  workerPath: chrome.runtime.getURL("tesseract/worker.min.js"),
  corePath: chrome.runtime.getURL("tesseract/tesseract-core.wasm.js"),
  logger: (m) => console.log(m),
});

let currentTabUrl = "";

// Resolve relative URLs to absolute URLs
function resolveUrl(url) {
  try {
    return new URL(url, currentTabUrl).href;
  } catch (e) {
    return null;
  }
}

// Process an image with OCR and overlay results
async function processImage(src) {
  const absoluteSrc = resolveUrl(src);
  if (!absoluteSrc) return null;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Avoid CORS issues
    img.src = absoluteSrc;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      try {
        // Load and initialize the Tesseract worker
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        // Perform OCRx
        const { data } = await worker.recognize(canvas);
        console.log("OCR Text:", data.text);

        // Optional: You can overlay text on the image here if needed

        // Convert the canvas back to an image URL
        const processedImageSrc = canvas.toDataURL();
        resolve(processedImageSrc);
      } catch (error) {
        console.error("Error processing image:", error);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.error("Error loading image:", absoluteSrc);
      resolve(null);
    };
  });
}

// Display images in the popup
async function displayImages(imageSources) {
  const imageContainer = document.getElementById("imageContainer");
  imageContainer.innerHTML = ""; // Clear previous content

  // Show loading message
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Processing images, please wait...";
  imageContainer.appendChild(loadingMessage);

  for (const src of imageSources) {
    const processedSrc = await processImage(src);
    if (processedSrc) {
      const imgElement = document.createElement("img");
      imgElement.src = processedSrc;
      imageContainer.appendChild(imgElement);
    }
  }

  // Remove the loading message
  imageContainer.removeChild(loadingMessage);
}

// Inject content script to collect images
function injectContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const activeTab = tabs[0];
    currentTabUrl = activeTab.url;

    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["contentScript.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error injecting content script:",
            chrome.runtime.lastError,
          );
        }
      },
    );
  });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.imageSources) {
    displayImages(message.imageSources);
  }
});

// Initialize extension
document.addEventListener("DOMContentLoaded", () => {
  injectContentScript();
});

/* .Old
// Define the languages you want Tesseract.js to recognize
const languages = 'eng+spa+fra'; // Add or remove language codes as needed

// Create a Tesseract worker
const worker = Tesseract.createWorker({
  workerPath: chrome.runtime.getURL('tesseract/worker.min.js'),
  langPath: chrome.runtime.getURL('tessdata'),
  cachePath: chrome.runtime.getURL('tessdata'), // Ensures Tesseract.js uses local language data
  corePath: chrome.runtime.getURL('tesseract/tesseract-core.wasm.js'),
  logger: m => console.log(m), // Optional: Logs progress to console
});

let currentTabUrl = '';

// Function to resolve relative URLs to absolute URLs
function resolveUrl(url) {
  try {
    return new URL(url, currentTabUrl).href;
  } catch (e) {
    return null;
  }
}

// Function to translate text using LibreTranslate
async function translateText(text, targetLang) {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLang,
        format: 'text',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result && result.translatedText) {
      return result.translatedText;
    } else {
      console.error('Translation error:', result);
      return text; // Return original text if translation fails
    }
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text if there's an error
  }
}

// Function to process an image: OCR, translate, and overlay text
async function processImage(src) {
  const absoluteSrc = resolveUrl(src);
  if (!absoluteSrc) return null;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To avoid CORS issues
    img.src = absoluteSrc;

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      try {
        // Initialize the Tesseract worker
        await worker.load();
        await worker.loadLanguage(languages);
        await worker.initialize(languages);

        // Perform OCR on the image
        const { data } = await worker.recognize(canvas);

        // Extract recognized text and word boxes
        const { words } = data;

        // Concatenate all the text
        const fullText = words.map(word => word.text).join(' ');

        // Translate the extracted text to English
        const translatedText = await translateText(fullText, 'en');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the original image
        ctx.drawImage(img, 0, 0);

        // Overlay white boxes and translated text
        ctx.font = '16px Arial';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';

        // Optional: Adjust this part to overlay text appropriately
        // For simplicity, we'll overlay the translated text at the top-left corner
        const lines = translatedText.split('\n');
        let y = 0;
        lines.forEach(line => {
          const metrics = ctx.measureText(line);
          const lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 4;

          // Draw white rectangle behind text
          ctx.fillStyle = 'white';
          ctx.fillRect(0, y, metrics.width, lineHeight);

          // Draw the text
          ctx.fillStyle = 'black';
          ctx.fillText(line, 0, y);

          y += lineHeight;
        });

        // Convert the canvas back to an image URL
        const processedImageSrc = canvas.toDataURL();

        resolve(processedImageSrc);
      } catch (error) {
        console.error('Error processing image:', error);
        resolve(null);
      } finally {
        // Optionally terminate the worker if you're done processing all images
        // await worker.terminate();
      }
    };

    img.onerror = () => {
      console.error('Error loading image:', absoluteSrc);
      resolve(null);
    };
  });
}

// Function to display images in the popup
async function displayImages(imageSources) {
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.innerHTML = ''; // Clear previous content

  // Show a loading message
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Processing images, please wait...';
  imageContainer.appendChild(loadingMessage);

  for (const src of imageSources) {
    const processedSrc = await processImage(src);
    if (processedSrc) {
      const imgElement = document.createElement('img');
      imgElement.src = processedSrc;
      imageContainer.appendChild(imgElement);
    }
  }

  // Remove the loading message
  imageContainer.removeChild(loadingMessage);
}

// Function to inject the content script to collect image sources
function injectContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length === 0) return;
    const activeTab = tabs[0];
    currentTabUrl = activeTab.url; // Store the current tab's URL

    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ['contentScript.js'],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error injecting script:', chrome.runtime.lastError);
        }
      }
    );
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.imageSources) {
    displayImages(message.imageSources);
  }
});

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  injectContentScript();
});
*/

/* .Old
// Function to translate text using LibreTranslate
async function translateText(text, targetLang) {
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      if (result && result.translatedText) {
        return result.translatedText;
      } else {
        console.error('Translation error:', result);
        return text; // Return original text if translation fails
      }
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return original text if there's an error
    }
  }
  
  // Function to display OCR results
  async function displayResults(ocrResults) {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Clear previous content
  
    for (const result of ocrResults) {
      const translatedText = await translateText(result.text, 'en');
  
      const div = document.createElement('div');
      div.className = 'result';
  
      const img = document.createElement('img');
      img.src = result.src;
      img.className = 'ocr-image';
  
      const textDiv = document.createElement('div');
      textDiv.className = 'translated-text';
      textDiv.textContent = translatedText;
  
      div.appendChild(img);
      div.appendChild(textDiv);
  
      imageContainer.appendChild(div);
    }
  }
  
  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.ocrResults) {
      displayResults(message.ocrResults);
    }
  });
  
  // Initialize the extension
  document.addEventListener('DOMContentLoaded', () => {
    // The content script is already injected via the manifest
    // Optionally, you can send a message to trigger processing
  });
  
*/