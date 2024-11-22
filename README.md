# URLs to Markdown

This is a lightweight yet powerful tool designed to convert a list of URLs into Markdown format and generate AI-powered summaries. Powered by [macsplit/urltomarkdown](https://github.com/macsplit/urltomarkdown) and OpenAI's GPT-4, it simplifies the process of extracting and summarizing content from web pages, making it an ideal utility for SEO professionals, content writers, and web developers.

---

## Preview

This tool allows you to input multiple URLs, process their content in batches, and view or download the extracted Markdown content. With an OpenAI API key, you can also generate concise summaries of the content.

<img width="100%" alt="urls-to-markdown-preview" src="[https://github.com/user-attachments/assets/fc88bdf4-4bee-499a-8ef5-6dadb4548b35">

---

## Features

- **Batch Processing**: Processes multiple URLs simultaneously, with built-in retry logic for failed requests.
- **AI-Powered Summaries**: Generate concise summaries of your content using OpenAI's GPT-4 (requires API key).
- **Interactive UI**: View Markdown content and summaries directly in the interface with copy and download options.
- **Retry on Failure**: Automatically retries failed URL fetches up to 3 times with customizable delays.
- **Throttling**: Prevents API overload by introducing a delay between batches.
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
   
2. **Optional: Add OpenAI API Key**:
   - To use the AI summary feature, add your OpenAI API key.
   - The key is stored locally and can be removed at any time.
   - [Get an API key](https://platform.openai.com/docs/quickstart)
   - [View API pricing](https://openai.com/api/pricing/)

3. **Convert to Markdown**:
   - Click the "Convert to Markdown" button to start the process.
   - View the extracted content directly in the interface.
   - Use the copy or download buttons to save the content.

4. **Generate Summary (Optional)**:
   - With a valid API key, click "Generate Summary" to create an AI-powered summary.
   - View, copy, or download the generated summary.

5. **Dark/Light Mode**:
   - Use the toggle button (🌑/☀️) to switch between dark and light modes dynamically.

---

## File Structure

- **`index.html`**: The main HTML file for the user interface.
- **`style.css`**: Handles the styling for both light and dark modes, as well as the overall layout.
- **`script.js`**: Contains the core functionality, including batch processing, AI integration, and theme toggling.

---

## Technologies Used

- **HTML5/CSS3**: For the structure and styling of the tool.
- **JavaScript (ES6)**: For handling the API calls, retries, batching, and dynamic behavior.
- **[macsplit/urltomarkdown](https://github.com/macsplit/urltomarkdown)**: The API powering the Markdown conversion.
- **OpenAI API**: Powers the AI summary generation feature.

---

## License

This project is licensed under the CC-BY-4.0 License. See the [LICENSE](LICENSE.md) file for more details.

---

## About

This tool was developed as a practical solution for extracting and summarizing content from web pages in bulk. It was created with inspiration from other tools built by [Astralrank](https://astralrank.com).

---

## Contact

For questions, feedback, or support, please contact [maxime@astralrank.com](mailto:maxime@astralrank.com).
