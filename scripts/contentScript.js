// contentScript.js
/*
(function() {
    const imageSources = new Set();
  
    // Function to add image sources to the set
    function addImageSource(src) {
      if (src && !src.startsWith('data:')) { // Exclude data URIs if desired
        imageSources.add(src);
      }
    }
  
    // Collect images from <img> tags
    document.querySelectorAll('img').forEach(img => {
      // Standard src attribute
      addImageSource(img.src);
  
      // Handle common lazy-loading attributes
      ['data-src', 'data-lazy', 'data-original', 'data-srcset', 'srcset'].forEach(attr => {
        const attrValue = img.getAttribute(attr);
        if (attrValue) {
          if (attr === 'data-srcset' || attr === 'srcset') {
            attrValue.split(',').forEach(src => {
              addImageSource(src.trim().split(' ')[0]);
            });
          } else {
            addImageSource(attrValue);
          }
        }
      });
    });
  
    // Collect images from <source> tags in <picture> elements
    document.querySelectorAll('picture source').forEach(source => {
      ['src', 'data-src', 'srcset', 'data-srcset'].forEach(attr => {
        const attrValue = source.getAttribute(attr);
        if (attrValue) {
          attrValue.split(',').forEach(src => {
            addImageSource(src.trim().split(' ')[0]);
          });
        }
      });
    });
  
    // Collect poster images from <video> tags
    document.querySelectorAll('video').forEach(video => {
      addImageSource(video.poster);
    });
  
    // Collect background images from inline styles
    document.querySelectorAll('*[style*="background"]').forEach(element => {
      const style = window.getComputedStyle(element);
      const bgImage = style.getPropertyValue('background-image');
      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (matches && matches[1]) {
          addImageSource(matches[1]);
        }
      }
    });
  
    // Collect background images from CSS stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
      let rules;
      try {
        rules = sheet.cssRules || sheet.rules;
      } catch (e) {
        // Ignore sheets from other domains
        return;
      }
      if (rules) {
        Array.from(rules).forEach(rule => {
          if (rule.style && rule.style.backgroundImage && rule.style.backgroundImage !== 'none') {
            const bgImage = rule.style.backgroundImage;
            const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
            if (matches && matches[1]) {
              addImageSource(matches[1]);
            }
          }
        });
      }
    });
  
    // Send the list of image sources back to the popup script
    chrome.runtime.sendMessage({ imageSources: Array.from(imageSources) });
  })();

 // contentScript.js
*/
/*
(async function() {
    // Define the languages you want Tesseract.js to recognize
    const languages = 'eng+spa+fra'; // Add or remove languages as needed
  
    // Create a Tesseract worker
    const worker = Tesseract.createWorker({
      workerPath: chrome.runtime.getURL('tesseract/worker.min.js'),
      langPath: chrome.runtime.getURL('tessdata'),
      cachePath: chrome.runtime.getURL('tessdata'),
      corePath: chrome.runtime.getURL('tesseract/tesseract-core.wasm.js'),
      logger: m => console.log(m)
    });
  
    await worker.load();
    await worker.loadLanguage(languages);
    await worker.initialize(languages);
  
    // Function to collect image elements from the page
    function collectImageElements() {
      const images = [];
  
      // Collect images from <img> tags
      document.querySelectorAll('img').forEach(img => {
        images.push(img);
      });
  
      // Collect images from CSS background-image properties
      document.querySelectorAll('*').forEach(element => {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
          if (urlMatch && urlMatch[1]) {
            const img = new Image();
            img.src = urlMatch[1];
            images.push(img);
          }
        }
      });
  
      return images;
    }
  
    // Function to process images and perform OCR
    async function processImages(images) {
      const results = [];
  
      for (const img of images) {
        try {
          await new Promise((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          });
  
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
  
          const { data } = await worker.recognize(canvas);
  
          results.push({
            src: img.src,
            text: data.text
          });
        } catch (error) {
          console.error('Error processing image:', img.src, error);
        }
      }
  
      return results;
    }
  
    // Collect image elements
    const images = collectImageElements();
  
    // Process images and perform OCR
    const ocrResults = await processImages(images);
  
    // Terminate the worker
    await worker.terminate();
  
    // Send the OCR results to the popup
    chrome.runtime.sendMessage({ ocrResults });
  })();
   
*/

(function () {
    const imageSources = new Set();
  
    // Add an image source to the set
    function addImageSource(src) {
      if (src && !src.startsWith("data:")) {
        imageSources.add(src);
      }
    }
  
    // Collect images from <img> tags
    document.querySelectorAll("img").forEach((img) => {
      addImageSource(img.src);
  
      // Handle common lazy-loading attributes
      ["data-src", "data-lazy", "data-original", "data-srcset", "srcset"].forEach((attr) => {
        const attrValue = img.getAttribute(attr);
        if (attrValue) {
          if (attr === "data-srcset" || attr === "srcset") {
            attrValue.split(",").forEach((src) => {
              addImageSource(src.trim().split(" ")[0]);
            });
          } else {
            addImageSource(attrValue);
          }
        }
      });
    });
  
    // Collect images from <source> tags in <picture> elements
    document.querySelectorAll("picture source").forEach((source) => {
      ["src", "data-src", "srcset", "data-srcset"].forEach((attr) => {
        const attrValue = source.getAttribute(attr);
        if (attrValue) {
          attrValue.split(",").forEach((src) => {
            addImageSource(src.trim().split(" ")[0]);
          });
        }
      });
    });
  
    // Collect poster images from <video> tags
    document.querySelectorAll("video").forEach((video) => {
      addImageSource(video.poster);
    });
  
    // Collect background images from inline styles
    document.querySelectorAll('*[style*="background"]').forEach((element) => {
      const style = window.getComputedStyle(element);
      const bgImage = style.getPropertyValue("background-image");
      if (bgImage && bgImage !== "none") {
        const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (matches && matches[1]) {
          addImageSource(matches[1]);
        }
      }
    });
  
    // Send image sources to popup
    chrome.runtime.sendMessage({ imageSources: Array.from(imageSources) });
  })();
  