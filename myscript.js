const iframe = document.getElementById('webview');
const hamburger = document.getElementById('hamburger');
const urlDialog = document.getElementById('urlDialog');
const urlInput = document.getElementById('urlInput');
const closeBtn = document.getElementById('closeBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const progressBar = document.getElementById('progressBar');
const errorScreen = document.getElementById('errorScreen');
const errorBtn = document.getElementById('errorBtn');

// Load saved URL or default
window.addEventListener('DOMContentLoaded', () => {
  const savedUrl = localStorage.getItem('lastUrl') || 'https://example.com/';
  iframe.src = savedUrl;
  urlInput.value = savedUrl;
});

// Hamburger show near top-right corner
document.addEventListener('mousemove', e => {
  const margin = 100;
  hamburger.style.opacity =
    (e.clientY < margin && e.clientX > window.innerWidth - margin) ? 1 : 0.05;
});

// Open dialog
hamburger.addEventListener('click', () => {
  urlDialog.showModal();
  urlInput.focus();
});

// Close dialog
closeBtn.addEventListener('click', () => urlDialog.close());

// Clear saved URL
clearBtn.addEventListener('click', () => {
  urlInput.value = 'https://example.com/';
  localStorage.removeItem('lastUrl');
});

// Save + load
saveBtn.addEventListener('click', () => loadUrl(urlInput.value.trim()));
urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') loadUrl(urlInput.value.trim());
});

function loadUrl(url) {
  if (!url) {
    urlDialog.close();
    return;
  }
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  iframe.src = url;
  localStorage.setItem('lastUrl', url);
  urlDialog.close();
  hideError();
  showProgress();
}

// Simulated progress bar animation
function showProgress() {
  progressBar.style.display = 'block';
  progressBar.style.width = '10%';
  let width = 10;
  const timer = setInterval(() => {
    width += 10;
    if (width >= 90) clearInterval(timer);
    progressBar.style.width = width + '%';
  }, 200);
}

// When iframe successfully loads
iframe.addEventListener('load', () => {
  progressBar.style.width = '100%';
  setTimeout(() => {
    progressBar.style.display = 'none';
    progressBar.style.width = '0';
  }, 400);
  hideError();
});

// Timeout-based error detection
function showError() {
  progressBar.style.display = 'none';
  errorScreen.style.display = 'flex';
}

function hideError() {
  errorScreen.style.display = 'none';
}

// Retry button
errorBtn.addEventListener('click', () => {
  hideError();
  loadUrl(urlInput.value.trim());
});

// Fallback if iframe doesn’t trigger load (network fail)
function monitorLoad() {
  const currentUrl = iframe.src;
  let loaded = false;

  const checker = setTimeout(() => {
    if (!loaded) showError();
  }, 8000);

  iframe.addEventListener('load', () => {
    loaded = true;
    clearTimeout(checker);
  });
}

iframe.addEventListener('loadstart', monitorLoad);
