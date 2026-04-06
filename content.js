// Check if we should show the pause screen
const SESSION_KEY = 'instagram_pause_allowed';
const allowed = sessionStorage.getItem(SESSION_KEY);

if (!allowed) {
  // Stop the page from loading
  document.documentElement.innerHTML = '';

  // Load our pause page
  fetch(chrome.runtime.getURL('pause.html'))
    .then(response => response.text())
    .then(html => {
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
          messageDiv.textContent = 'Please provide a more detailed reason (at least 10 characters)';
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
