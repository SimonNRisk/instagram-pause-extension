# Instagram Pause Extension

A simple Chrome extension that adds a mindful pause before accessing Instagram. When you try to visit Instagram, you'll be prompted to explain why you want to use it, then wait 15 seconds before continuing.

## Features

- Intercepts Instagram page loads
- Prompts for a reason (minimum 10 characters)
- 15-second countdown after submitting reason
- Session-based: only prompts once per browser session

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `instagram-pause-extension` folder
5. The extension is now active!

## How It Works

When you navigate to Instagram, the extension will:
1. Show a pause screen instead of Instagram
2. Ask you to write why you want to use Instagram
3. Require at least 10 characters in your response
4. Start a 15-second countdown once you submit
5. Allow you to continue after the countdown finishes

The pause only happens once per browser session. If you close and reopen your browser, you'll be prompted again.

## Files

- `manifest.json` - Extension configuration
- `content.js` - Script that intercepts Instagram page loads
- `pause.html` - The pause screen UI
- `background.js` - Background service worker

## Uninstalling

Go to `chrome://extensions/` and click "Remove" on the Instagram Pause extension.
