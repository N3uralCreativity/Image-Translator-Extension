# Image Translator Chrome Extension

An easy-to-use Chrome extension that extracts text from images on webpages, translates the text, and overlays the translations onto the images in real-time.
### Story time :
So, here's the story behind why I started making this extension. I'm really into reading manga—both physical copies and online mangas and manhwas. But over time, I've run into this annoying issue where some chapters aren't translated or the translations take forever. It got me pretty mad, to be honest. So I thought, why not make something myself? That's when I decided to create this extension.

I wanted it to be free because I know there's another extension out there that does something similar, but it's paid. And let's be real—we're not all made of money over here. So yeah, this project was born out of frustration and the desire to help fellow manga fans enjoy their favorite series without the wait or the cost.*

**Just a heads-up**: I'm a student developer, so this is not perfect. Even though I'm doing my best with this extension, you might notice things that could be better. But hey, I'll get there eventually, OK?

Also, since I use this extension myself, if it ever stops working, I'll be the first to know—so no need to reach out to me about that. And I want to say I'm always thankful for anyone who uses my extension and to any contributors who are willing to help out! 

## Features
- **OCR**: Uses Tesseract.js to extract text from images.
- **Translation**: Translates extracted text using LibreTranslate.
- **Overlay**: Displays translations directly on images for seamless reading.

## Language Compatibility

The extension supports OCR and translation for the following languages:

| Language             | OCR Support | Translation Support |
|----------------------|-------------|---------------------|
| English (`eng`)      | ✅          | ✅                  |
| Spanish (`spa`)      | ✅          | ✅                  |
| French (`fra`)       | ✅          | ✅                  |
| German (`deu`)       | ✅          | ❌                  |
| Italian (`ita`)      | ✅          | ❌                  |
| Portuguese (`por`)   | ✅          | ❌                  |
| Chinese (`chi_sim`)  | ✅          | ⏳                  |
| Japanese (`jpn`)     | ✅          | ⏳                  |
| Korean (`kor`)       | ✅          | ⏳                  |
| Russian (`rus`)      | ✅          | ❌                  |

*Note: languages compatibility will evolve with time just as site compatibility will appear later on.*

---

## Installation

### Option 1: Install from Source
1. **Download and Extract**:  
   Download the ZIP file containing the extension source code and extract it to a directory on your computer.

2. **Open Google Chrome**:  
   Navigate to `chrome://extensions/` in the address bar.

3. **Enable Developer Mode**:  
   Toggle the **Developer mode** switch in the top-right corner.

4. **Load the Extension**:  
   - Click on **Load unpacked**.  
   - Select the directory where you extracted the extension files.

---

## Usage
1. **Navigate to a Webpage with Images**:  
   Visit any website containing images with text, such as articles, comics, or scanned documents.

2. **Activate the Extension**:  
   Click on the **Image Translator Extension** icon in the Chrome toolbar.

3. **Wait for Processing**:  
   The extension will:  
   - Automatically collect images.  
   - Perform OCR to extract text.  
   - Translate the extracted text.  
   - Overlay the translations onto the images.

4. **View Results**:  
   Translated images will be displayed in the extension popup.

---

## Prerequisites
- **Google Chrome**: Version 88 or higher is recommended.
- **Internet Connection**: Required for fetching translations via LibreTranslate.

---

## Development Setup
1. **Install Node.js and npm** (if not already installed):  
   Download and install from [Node.js](https://nodejs.org/).

2. **Install Dependencies**:  
   - Navigate to the project directory.  
   - Run `npm install` if necessary (though the extension includes all required dependencies).

3. **Modify Source Code**:  
   Make changes to the extension files as needed.

4. **Reload the Extension**:  
   After making changes, reload the extension on the `chrome://extensions/` page.

---

## Contributing
Contributions are welcome! Follow these steps to contribute:

1. **Fork the Repository**:  
   Click the **Fork** button at the top-right of the repository page.

2. **Create a New Branch**:  
   ```bash
   git checkout -b feature/YourFeatureName
3. **Commit Your Changes**:
   ```bash
    git commit -am 'Add new feature'
4. **Push to the Branch**:
   ```bash
   git push origin feature/YourFeatureName
5. **Open a Pull Request**:
   - Navigate to your forked repository on GitHub.
   - Click on Pull Request.
   
## License
This project is licensed under the **MIT License**. See the LICENSE file for details.

## Acknowledgments
   - Tesseract.js: For providing OCR functionality.
   - LibreTranslate: For the free translation API.
   - OpenAI's ChatGPT: For assisting in project development.
