const API_URL =
  "https://mlahz1s2e0.execute-api.us-east-1.amazonaws.com/prod/shorten";

const form = document.getElementById("shorten-form");
const input = document.getElementById("url-input");
const button = document.getElementById("shorten-btn");
const errorMsg = document.getElementById("error-msg");
const result = document.getElementById("result");
const shortUrlLink = document.getElementById("short-url-link");
const copyBtn = document.getElementById("copy-btn");
const copyIcon = document.getElementById("copy-icon");
const checkIcon = document.getElementById("check-icon");
const copyLabel = document.getElementById("copy-label");

let copyResetTimer = null;

function setLoading(on) {
  button.disabled = on;
  button.classList.toggle("loading", on);
}

function showError(msg) {
  errorMsg.textContent = msg;
  input.classList.add("input-error");
}

function clearError() {
  errorMsg.textContent = "";
  input.classList.remove("input-error");
}

function showResult(shortUrl) {
  shortUrlLink.href = shortUrl;
  shortUrlLink.textContent = shortUrl;
  result.classList.add("visible");
  resetCopyButton();
}

function isValidUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();
  result.classList.remove("visible");

  const longUrl = input.value.trim();

  if (!longUrl) {
    showError("Please enter a URL.");
    input.focus();
    return;
  }

  if (!isValidUrl(longUrl)) {
    showError("Please enter a valid URL starting with http:// or https://");
    input.focus();
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ long_url: longUrl }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const data = await response.json();
        detail = data.message || data.error || "";
      } catch {
        // ignore parse errors
      }
      throw new Error(
        detail || `Server responded with status ${response.status}.`,
      );
    }

    const data = await response.json();
    const shortUrl = data.short_url || data.short_code;

    if (!shortUrl) {
      throw new Error("Unexpected response from server. Please try again.");
    }

    showResult(shortUrl);
  } catch (err) {
    if (err.name === "TypeError") {
      showError("Network error. Check your connection and try again.");
    } else {
      showError(err.message || "Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
});

function resetCopyButton() {
  clearTimeout(copyResetTimer);
  copyIcon.classList.remove("hidden");
  checkIcon.classList.add("hidden");
  copyLabel.textContent = "Copy";
  copyBtn.classList.remove("copied");
}

copyBtn.addEventListener("click", async () => {
  const url = shortUrlLink.href;
  if (!url || url === "#") return;

  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Fallback for browsers without clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  copyIcon.classList.add("hidden");
  checkIcon.classList.remove("hidden");
  copyLabel.textContent = "Copied!";
  copyBtn.classList.add("copied");

  copyResetTimer = setTimeout(resetCopyButton, 2500);
});

input.addEventListener("input", () => {
  if (errorMsg.textContent) clearError();
});
