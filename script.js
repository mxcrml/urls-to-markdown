let OPENAI_API_KEY = '';

// Function to check for cached API key on page load
async function checkCachedApiKey() {
  const apiKeyInput = document.getElementById('api-key-input');
  const cachedKey = localStorage.getItem('openai_api_key');
  
  // Remove loading state regardless of cached key
  setTimeout(() => {
    apiKeyInput.classList.remove('loading');
    apiKeyInput.classList.add('loaded');
  }, 100);

  if (cachedKey) {
    const isValid = await validateApiKey(cachedKey);
    if (isValid) {
      setValidatedState(cachedKey);
    } else {
      localStorage.removeItem('openai_api_key');
    }
  }
}

// Function to set the validated state
function setValidatedState(apiKey) {
  OPENAI_API_KEY = apiKey;
  const apiKeyInput = document.getElementById('api-key-input');
  const apiKeySection = document.querySelector('.api-key-section');
  const apiKeyStatus = document.getElementById('api-key-status');
  const validateKeyBtn = document.getElementById('validate-key-btn');
  const removeKeyBtn = document.getElementById('remove-key-btn');
  const summaryBtn = document.getElementById('summary-btn');

  apiKeySection.classList.remove('needs-key');
  apiKeyInput.classList.add('locked-key');
  apiKeyInput.disabled = true;
  apiKeyInput.value = '•'.repeat(40);
  apiKeyStatus.innerHTML = '🔒 Validated';
  validateKeyBtn.style.display = 'none';
  removeKeyBtn.style.display = 'inline-block';

  // Enable summary button
  summaryBtn.classList.remove('inactive');

  localStorage.setItem('openai_api_key', apiKey);
}

// Function to remove the API key
function removeApiKey() {
  OPENAI_API_KEY = '';
  const apiKeyInput = document.getElementById('api-key-input');
  const apiKeySection = document.querySelector('.api-key-section');
  const apiKeyStatus = document.getElementById('api-key-status');
  const validateKeyBtn = document.getElementById('validate-key-btn');
  const removeKeyBtn = document.getElementById('remove-key-btn');
  const summaryBtn = document.getElementById('summary-btn');

  // Reset the input field
  apiKeyInput.value = '';
  apiKeyInput.disabled = false;
  apiKeyInput.classList.remove('locked-key');
  
  // Reset the section styling
  apiKeySection.classList.remove('pulse');
  
  // Reset the buttons
  validateKeyBtn.style.display = 'inline-block';
  validateKeyBtn.disabled = false;
  removeKeyBtn.style.display = 'none';
  
  // Clear the status
  apiKeyStatus.innerHTML = '';
  
  // Update summary button
  summaryBtn.classList.add('inactive');
  
  // Remove the key from localStorage
  localStorage.removeItem('openai_api_key');
  
  updateStatus('API key removed');
}

async function validateApiKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

// Update the validate key event listener
document.getElementById('validate-key-btn').addEventListener('click', async () => {
  const apiKeyInput = document.getElementById('api-key-input');
  const apiKeyStatus = document.getElementById('api-key-status');
  const validateKeyBtn = document.getElementById('validate-key-btn');
  
  const key = apiKeyInput.value.trim();
  
  if (!key) {
    apiKeyStatus.innerHTML = '❌ Please enter an API key';
    return;
  }
  
  validateKeyBtn.disabled = true;
  apiKeyStatus.innerHTML = '⏳ Validating...';
  
  const isValid = await validateApiKey(key);
  
  if (isValid) {
    setValidatedState(key);
  } else {
    apiKeyStatus.innerHTML = '❌ Invalid API key';
    validateKeyBtn.disabled = false;
  }
});

// Add remove key event listener
document.getElementById('remove-key-btn').addEventListener('click', removeApiKey);

// Check for cached API key when the page loads
document.addEventListener('DOMContentLoaded', checkCachedApiKey);

document.getElementById('convert-btn').disabled = true;

async function generateSummary(markdown) {
  if (!OPENAI_API_KEY) {
    throw new Error('Please validate your API key first');
  }
  
  try {
    // Add size validation
    if (!markdown || markdown.trim().length === 0) {
      throw new Error('No content to summarize');
    }

    console.log('Markdown length:', markdown.length);
    
    // If content is too large, you might want to truncate it
    const maxLength = 12000; // Adjust this value based on token limits
    const truncatedMarkdown = markdown.length > maxLength 
      ? markdown.slice(0, maxLength) + '...'
      : markdown;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: `You are a specialized data extraction assistant that creates comprehensive summaries focused on key facts and insights. Your summaries should be:
          - Factual and precise, free of commentary or interpretation
          - Formatted as bullet points in Markdown
          - Written in the same language as the provided input content`
        }, {
          role: 'user',
          content: `Analyze the following content and create a Markdown formatted bullet-point summary of the most important facts and insights. Present them in order of importance, using clear and concise French:

${truncatedMarkdown}`
        }],
        temperature: 0.5,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

// Add these functions for the new buttons
function setupSummaryActions() {
  const copyBtn = document.getElementById('copy-summary-btn');
  const downloadBtn = document.getElementById('download-summary-btn');
  const summaryContent = document.getElementById('summary-content');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summaryContent.textContent);
      
      // Visual feedback
      const originalEmoji = copyBtn.textContent;
      copyBtn.textContent = '✓';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.textContent = originalEmoji;
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  });

  downloadBtn.addEventListener('click', () => {
    const summaryText = summaryContent.textContent;
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    
    downloadLink.href = url;
    downloadLink.download = 'summary.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  });
}

// Update the handleUrlConversion function
async function handleUrlConversion() {
  const urlInput = document.getElementById('url-input').value.trim();
  if (!urlInput) {
    updateStatus("Please enter at least one URL.");
    return;
  }

  try {
    updateStatus("Processing URLs...");
    const urls = urlInput.split('\n').map(url => url.trim()).filter(url => url);
    const results = [];
    const batchSize = 5;
    const delayMs = 1000;
    const retryDelayMs = 10000;

    // Function to wait for a given delay
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Function to fetch the markdown with retries
    const fetchWithRetry = async (url, retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch(`https://urltomarkdown-api.fly.dev/?url=${encodeURIComponent(url)}`);
          if (!response.ok) throw new Error(`Error for ${url}`);
          const markdown = await response.text();
          return `# ${url}\n\n${markdown}`;
        } catch (error) {
          console.error(`Attempt ${attempt} failed for ${url}:`, error);
          if (attempt < retries) {
            updateStatus(`Failed for ${url}, retrying in ${retryDelayMs / 1000} seconds (${attempt}/${retries})...`);
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
        updateStatus(`Waiting before the next batch... (${i + batchSize}/${urls.length} URLs processed)`);
        await delay(delayMs);
      }
    }

    // Store and display the markdown content
    window.markdownContent = results.join('\n\n');
    
    const markdownContainer = document.getElementById('markdown-container');
    const markdownContent = document.getElementById('markdown-content');
    
    markdownContent.textContent = window.markdownContent;
    markdownContainer.style.display = 'block';
    
    updateStatus("Done! Your Markdown file has been downloaded.");
  } catch (error) {
    console.error('Error details:', error);
    updateStatus("Failed to convert URLs: " + error.message);
  }
}

// Update the handleSummaryGeneration function
async function handleSummaryGeneration() {
  const urlInput = document.getElementById('url-input').value.trim();
  const status = document.getElementById('status');
  const summaryBtn = document.getElementById('summary-btn');
  const originalBtnText = summaryBtn.textContent;

  try {
    // If no URLs entered, show a helpful message
    if (!urlInput) {
      status.textContent = "Please enter URLs first.";
      return;
    }

    // If markdown hasn't been generated yet, run the conversion first
    if (!window.markdownContent) {
      status.textContent = "Converting URLs to Markdown...";
      summaryBtn.textContent = "Converting...";
      summaryBtn.disabled = true;
      
      await handleUrlConversion();
      
      // Re-enable the button with original text
      summaryBtn.textContent = originalBtnText;
      summaryBtn.disabled = false;
    }

    // Now generate the summary
    status.textContent = "Generating summary...";
    summaryBtn.textContent = "Generating...";
    summaryBtn.disabled = true;
    
    const summary = await generateSummary(window.markdownContent);
    
    const summaryContainer = document.getElementById('summary-container');
    const summaryContent = document.getElementById('summary-content');
    
    summaryContent.textContent = summary;
    summaryContainer.style.display = 'block';
    status.textContent = "Summary generated successfully!";
    
    // Reset button state
    summaryBtn.textContent = originalBtnText;
    summaryBtn.disabled = false;
  } catch (error) {
    console.error('Error details:', error);
    status.textContent = "Failed to generate summary: " + error.message;
    
    // Reset button state
    summaryBtn.textContent = originalBtnText;
    summaryBtn.disabled = false;
  }
}

// Function to setup action buttons for a content container
function setupContentActions(contentId, copyBtnId, downloadBtnId) {
  const contentElement = document.getElementById(contentId);
  const copyBtn = document.getElementById(copyBtnId);
  const downloadBtn = document.getElementById(downloadBtnId);

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contentElement.textContent);
      
      // Visual feedback
      const originalEmoji = copyBtn.textContent;
      copyBtn.textContent = '✓';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.textContent = originalEmoji;
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error(`Failed to copy ${contentId}:`, err);
    }
  });

  downloadBtn.addEventListener('click', () => {
    const text = contentElement.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    
    downloadLink.href = url;
    downloadLink.download = `${contentId}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  });
}

function toggleMode() {
  document.body.classList.toggle('dark-mode');
}
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  checkCachedApiKey();
  document.getElementById('convert-btn').disabled = false;
  
  // Initialize summary button as inactive
  const summaryBtn = document.getElementById('summary-btn');
  summaryBtn.classList.add('inactive');
  
  const apiKeySection = document.querySelector('.api-key-section');
  let pulseTimeout;

  // Add hover event listener
  summaryBtn.addEventListener('mouseenter', () => {
    if (!OPENAI_API_KEY) {  // Only trigger if no API key
      // Clear any existing animation
      apiKeySection.classList.remove('pulse');
      clearTimeout(pulseTimeout);
      
      // Force a reflow to restart the animation
      void apiKeySection.offsetWidth;
      
      // Add pulse class
      apiKeySection.classList.add('pulse');
      
      // Remove pulse class after 10 seconds
      pulseTimeout = setTimeout(() => {
        apiKeySection.classList.remove('pulse');
      }, 10000);
    }
  });

  // Optional: Stop animation when mouse leaves the button
  summaryBtn.addEventListener('mouseleave', () => {
    if (!OPENAI_API_KEY) {
      clearTimeout(pulseTimeout);
      apiKeySection.classList.remove('pulse');
    }
  });

  // Click event for the summary button
  summaryBtn.addEventListener('click', (e) => {
    if (!OPENAI_API_KEY) {
      e.preventDefault();
      apiKeySection.scrollIntoView({ behavior: 'smooth' });
      updateStatus("Please add your OpenAI API key to use the summary feature");
    } else {
      handleSummaryGeneration();
    }
  });
  
  // Setup other event listeners
  setupContentActions('markdown-content', 'copy-markdown-btn', 'download-markdown-btn');
  setupContentActions('summary-content', 'copy-summary-btn', 'download-summary-btn');
  document.getElementById('convert-btn').addEventListener('click', handleUrlConversion);
  document.getElementById('summary-btn').addEventListener('click', handleSummaryGeneration);
});

// Update status display function
function updateStatus(message) {
  const statusContainer = document.querySelector('.status-container');
  const status = document.getElementById('status');
  
  if (message && message.trim() !== '') {
    status.textContent = message;
    statusContainer.style.display = 'block';  // Use style.display instead of classList
  } else {
    status.textContent = '';
    statusContainer.style.display = 'none';
  }
}

// Clear status when needed
function clearStatus() {
  updateStatus('');
}
