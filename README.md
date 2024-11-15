# URLs to Markdown

This is a lightweight yet powerful tool designed to convert a list of URLs into Markdown format. Powered by [macsplit/urltomarkdown](https://github.com/macsplit/urltomarkdown), it simplifies the process of extracting Markdown content from web pages, making it an ideal utility for SEO professionals, content writers, and web developers.

---

## Preview

This tool allows you to input multiple URLs, process their content in batches, and download a single `.txt` file containing the extracted Markdown for all the URLs.

---

## Features

- **Batch Processing**: Processes multiple URLs simultaneously, with built-in retry logic for failed requests.
- **Retry on Failure**: Automatically retries failed URL fetches up to 3 times with customizable delays.
- **Throttling**: Prevents API overload by introducing a delay between batches.
- **Downloadable Markdown File**: Generates a single `.txt` file containing Markdown content for all provided URLs. Extremely useful to quickly build a knowledge base.
- **Dark/Light Mode Toggle**: Switch between light and dark themes for a more comfortable user experience.

---

## Installation

### Download or Clone the Repository
```bash
git clone https://github.com/mxcrml/urls-to-markdown.git
```

### Navigate to the Project Directory
```bash
cd urls-to-markdown
```

### Open the Tool in Your Browser
Simply open the `index.html` file in any modern browser to start using the tool.

---

## Usage

1. **Enter URLs**:
   - Paste a list of URLs into the text area, one URL per line.
   
2. **Convert to Markdown**:
   - Click the "Convert to Markdown" button to start the process.
   - The tool will process each URL and download the extracted content as a `.txt` file.

3. **Dark/Light Mode**:
   - Use the toggle button (🌑/☀️) to switch between dark and light modes dynamically.

4. **Retry on Failure**:
   - If a URL fetch fails, the tool will retry up to 3 times with a delay of 10 seconds between attempts.

---

## File Structure

- **`index.html`**: The main HTML file for the user interface.
- **`style.css`**: Handles the styling for both light and dark modes, as well as the overall layout.
- **`script.js`**: Contains the core functionality, including batch processing, retry logic, file generation, and theme toggling.

---

## Technologies Used

- **HTML5/CSS3**: For the structure and styling of the tool.
- **JavaScript (ES6)**: For handling the API calls, retries, batching, and dynamic behavior.
- **[macsplit/urltomarkdown](https://github.com/macsplit/urltomarkdown)**: The API powering the Markdown conversion.

---

## License

This project is licensed under the CC-BY-4.0 License. See the [LICENSE](LICENSE.md) file for more details.

---

## About

This tool was developed as a practical solution for extracting Markdown content from web pages in bulk. It was created with inspiration from other tools built by [Astralrank](https://astralrank.com).

---

## Contact

For questions, feedback, or support, please contact [maxime@astralrank.com](mailto:maxime@astralrank.com).