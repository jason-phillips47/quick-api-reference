console.log("sw-tips.js")
// Fetch tip & save in storage
const updateTip = async () => {
    const response = await fetch('https://extension-tips.glitch.me/tips.json');
    const tips = await response.json();
    const randomIndex = Math.floor(Math.random() * tips.length);
    return chrome.storage.local.set({ tip: tips[randomIndex] });
  };
  
  const ALARM_NAME = 'tip';
  
  // Check if alarm exists to avoid resetting the timer.
  // The alarm might be removed when the browser session restarts.
/**
 * Creates an alarm if it does not already exist.
 * The alarm is used to trigger a function periodically.
 * The alarm is checked before creating to avoid resetting the timer.
 * If the alarm already exists, nothing happens.
 * If the alarm does not exist, it is created with a delay of 1 minute and a period of 24 hours.
 * After creating the alarm, the function updateTip() is called.
 */
async function createAlarm() {
    // Check if alarm already exists
    const alarm = await chrome.alarms.get(ALARM_NAME);
    if (typeof alarm === 'undefined') {
      // Create alarm with delay of 1 minute and period of 24 hours
      chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: 1,
        periodInMinutes: 1440
      });
      // Call updateTip() function
      updateTip();
    }
  }
  createAlarm();
  chrome.alarms.onAlarm.addListener(updateTip);

// Send tip to content script via messaging
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.greeting === 'tip') {
      chrome.storage.local.get('tip').then(sendResponse);
      return true;
    }
  });