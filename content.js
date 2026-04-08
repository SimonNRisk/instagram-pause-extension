// Check if we should show the pause screen
const SESSION_KEY = 'pause_allowed';

function shouldGateCurrentUrl() {
  const { hostname, pathname } = window.location;

  // Instagram: extension only runs on instagram.com anyway.
  if (hostname.endsWith('instagram.com')) return true;

  // YouTube Shorts: only gate the Shorts section.
  if (hostname === 'www.youtube.com' && pathname.startsWith('/shorts/')) return true;

  return false;
}

function showPauseScreen() {
  // Stop the page from loading
  document.documentElement.innerHTML = '';

  // Load our pause page
  fetch(chrome.runtime.getURL('pause.html'))
    .then((response) => response.text())
    .then((html) => {
      document.open();
      document.write(html);
      document.close();

      // Set up the form handler
      const form = document.getElementById('pauseForm');
      const reasonInput = document.getElementById('reason');
      const submitBtn = document.getElementById('submitBtn');
      const timerDiv = document.getElementById('timer');
      const messageDiv = document.getElementById('message');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const reason = reasonInput.value.trim();

        if (reason.length < 10) {
          messageDiv.textContent =
            'Please provide a more detailed reason (at least 10 characters)';
          messageDiv.style.color = '#ff6b6b';
          return;
        }

        // Disable form
        reasonInput.disabled = true;
        submitBtn.disabled = true;

        // Show countdown
        messageDiv.textContent = 'Thank you. Reflecting on your reason...';
        messageDiv.style.color = '#4ecdc4';
        timerDiv.style.display = 'block';

        let timeLeft = 15;
        const countdown = setInterval(() => {
          timeLeft--;
          timerDiv.textContent = `Continuing in ${timeLeft} seconds...`;

          if (timeLeft <= 0) {
            clearInterval(countdown);
            sessionStorage.setItem(SESSION_KEY, 'true');
            location.reload();
          }
        }, 1000);

        timerDiv.textContent = `Continuing in ${timeLeft} seconds...`;
      });
    });
}

function maybeGate() {
  if (!shouldGateCurrentUrl()) return;

  const allowed = sessionStorage.getItem(SESSION_KEY);
  if (allowed) return;

  showPauseScreen();
}

// Run once on initial injection.
maybeGate();

// YouTube is a SPA: navigating between Shorts can change the URL without reload,
// so we re-check when the URL changes.
let lastHref = window.location.href;
function onPotentialNavigation() {
  const href = window.location.href;
  if (href === lastHref) return;
  lastHref = href;
  maybeGate();
}

const originalPushState = history.pushState;
history.pushState = function (...args) {
  const ret = originalPushState.apply(this, args);
  onPotentialNavigation();
  return ret;
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  const ret = originalReplaceState.apply(this, args);
  onPotentialNavigation();
  return ret;
};

window.addEventListener('popstate', onPotentialNavigation);

// Fallback: some navigations are reflected via DOM changes; this is cheap and robust.
new MutationObserver(onPotentialNavigation).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
