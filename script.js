document.getElementById('convert-btn').addEventListener('click', async () => {
  console.log('Button clicked!');
  
  const urlInput = document.getElementById('url-input').value.trim();
  const status = document.getElementById('status');

  if (!urlInput) {
    status.textContent = "Please enter at least one URL.";
    console.log('No URLs entered.');
    return;
  }

  const urls = urlInput.split('\n').map(url => url.trim()).filter(url => url);
  const results = [];
  const batchSize = 5; // Number of simultaneous requests
  const delayMs = 1000; // Delay between batches
  const retryDelayMs = 10000; // Delay before retrying a failed URL

  status.textContent = "Processing URLs...";
  console.log('Processing URLs:', urls);

  // Function to wait for a given delay
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Function to fetch the markdown with retries
  const fetchWithRetry = async (url, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`https://urltomarkdown.herokuapp.com/?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`Error for ${url}`);
        const markdown = await response.text();
        return `# ${url}\n\n${markdown}`;
      } catch (error) {
        console.error(`Attempt ${attempt} failed for ${url}:`, error);
        if (attempt < retries) {
          status.textContent = `Failed for ${url}, retrying in ${retryDelayMs / 1000} seconds (${attempt}/${retries})...`;
          await delay(retryDelayMs);
        } else {
          return `# ${url}\n\nError: ${error.message}\n`;
        }
      }
    }
  };

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize); // Split into batches
    console.log(`Processing batch: ${batch}`);

    const batchResults = await Promise.all(
      batch.map(url => fetchWithRetry(url))
    );

    results.push(...batchResults);

    // Wait before processing the next batch
    if (i + batchSize < urls.length) {
      status.textContent = `Waiting before the next batch... (${i + batchSize}/${urls.length} URLs processed)`;
      await delay(delayMs);
    }
  }

  // Generate the Markdown file
  const blob = new Blob([results.join('\n\n')], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'urls_to_markdown.txt';
  downloadLink.click();

  status.textContent = "Done! Your Markdown file has been downloaded.";
  console.log('Markdown file created and download triggered.');
});

function toggleMode() {
  document.body.classList.toggle('dark-mode');
}