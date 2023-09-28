console.log("sw-omnibox.js")
// Save default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      chrome.storage.local.set({
        apiSuggestions: ['tabs', 'storage', 'scripting']
      });
    }
  });
const URL_CHROME_EXTENSIONS_DOC =
  'https://developer.chrome.com/docs/extensions/reference/';
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a Chrome API or choose from past searches'
  });
  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
  const suggestions = apiSuggestions.map((api) => {
    return { content: api, description: `Open chrome.${api} API` };
  });
  suggest(suggestions);
});

// Open the reference page of the chosen API
chrome.omnibox.onInputEntered.addListener((input) => {
    chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input });
    // Save the latest keyword
    updateHistory(input);
  });

/**
 * Updates the history of API suggestions.
 * @param {string} input - The new API suggestion.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function updateHistory(input) {
    // Retrieve the current API suggestions from local storage
    const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
    
    // Add the new API suggestion to the beginning of the array
    apiSuggestions.unshift(input);
    
    // Remove any excess API suggestions beyond the specified limit
    apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
    
    // Update the API suggestions in local storage
    return chrome.storage.local.set({ apiSuggestions });
  }