const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image();
let isDrawing = false;
let startX, startY, endX, endY;

// Listen for file input and display the image on the canvas
document.getElementById("image-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    document.getElementById("output-text").textContent = "Please select an image file.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Draw the image on the canvas when it loads
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

// Mouse events for drawing cropping box
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  endX = e.clientX - rect.left;
  endY = e.clientY - rect.top;

  // Redraw the canvas and draw the cropping box
  ctx.drawImage(img, 0, 0);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;

  // Crop the image
  const width = endX - startX;
  const height = endY - startY;
  const croppedImage = ctx.getImageData(startX, startY, width, height);

  // Resize the canvas to the cropped area and draw the cropped image
  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(croppedImage, 0, 0);
});

// Button click to perform OCR
document.getElementById("process-btn").addEventListener("click", () => {
  document.getElementById("output-text").textContent = "Processing...";

  // Preprocess the cropped area before OCR
  preprocessImage(canvas, ctx);

  // Perform OCR using Tesseract.js
  Tesseract.recognize(canvas.toDataURL(), 'eng', {
    logger: (info) => console.log(info), // Logs OCR progress
    config: '--oem 3 --psm 11', // Optimized configuration for irregular text layout
  })
    .then(({ data: { text } }) => {
      document.getElementById("output-text").textContent = text || "No text found in the image.";
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("output-text").textContent = "An error occurred during processing.";
    });
});

// Function to preprocess the image: Convert to grayscale and apply adaptive thresholding
const preprocessImage = (canvas, ctx) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // Convert to grayscale
    const binaryValue = avg > 150 ? 255 : 0; // Adaptive thresholding
    data[i] = data[i + 1] = data[i + 2] = binaryValue; // Set RGB to binary value
  }

  ctx.putImageData(imageData, 0, 0); // Update the canvas with the processed image
};
