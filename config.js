(() => {
  "use strict";
  const STORAGE_KEY = "NINIA_API_BASE_URL";
  const params = new URLSearchParams(window.location.search);
  const queryValue = String(params.get("api") || "").trim();
  const storedValue = String(localStorage.getItem(STORAGE_KEY) || "").trim();
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  function normalize(value) {
    const clean = String(value || "").trim().replace(/\/+$/, "");
    if (!clean) return "";
    try {
      const url = new URL(clean);
      if (!["http:", "https:"].includes(url.protocol)) return "";
      return url.toString().replace(/\/+$/, "");
    } catch {
      return "";
    }
  }

  const selected = normalize(queryValue || storedValue || (isLocal ? "http://localhost:8000" : ""));
  if (queryValue && selected) localStorage.setItem(STORAGE_KEY, selected);

  window.NINIA_API_BASE_URL = selected;
  window.NINIA_API_CONFIG = {
    storageKey: STORAGE_KEY,
    get() {
      return normalize(window.NINIA_API_BASE_URL || localStorage.getItem(STORAGE_KEY) || "");
    },
    set(value) {
      const normalized = normalize(value);
      if (!normalized) throw new Error("La URL debe comenzar con http:// o https://");
      localStorage.setItem(STORAGE_KEY, normalized);
      window.NINIA_API_BASE_URL = normalized;
      return normalized;
    },
    clear() {
      localStorage.removeItem(STORAGE_KEY);
      window.NINIA_API_BASE_URL = isLocal ? "http://localhost:8000" : "";
    }
  };
})();
