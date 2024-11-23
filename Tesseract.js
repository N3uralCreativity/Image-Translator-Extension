/*
Tesseract.recognize(canvas, 'eng', {
    langPath: 'path/to/lang-data', // Update this path
    logger: m => console.log(m),
});
*/
const worker = Tesseract.createWorker({
  workerPath: chrome.runtime.getURL('tesseract/worker.min.js'),
  langPath: chrome.runtime.getURL('tessdata'),
  cachePath: chrome.runtime.getURL('tessdata'),
  corePath: chrome.runtime.getURL('tesseract/tesseract-core.wasm.js'),
  workerBlobURL: false, 
  logger: m => console.log(m),
});