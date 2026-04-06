// Background service worker for Instagram Pause extension
// Currently minimal, but can be extended for future features

chrome.runtime.onInstalled.addListener(() => {
  console.log('Instagram Pause extension installed');
});
