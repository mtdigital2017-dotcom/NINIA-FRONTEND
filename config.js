(() => {
  "use strict";

  const KEY = "NINIA_API_BASE_URL";
  const params = new URLSearchParams(window.location.search);
  const queryValue = String(params.get("api") || "").trim();
  const storedValue = String(localStorage.getItem(KEY) || "").trim();
  const localHost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );

  function normalize(value) {
    const clean = String(value || "").trim().replace(/\/+$/, "");
    if (!clean) return "";

    try {
      const url = new URL(clean);
      if (!["http:", "https:"].includes(url.protocol)) {
        return "";
      }
      return url.toString().replace(/\/+$/, "");
    } catch {
      return "";
    }
  }

  const selected = normalize(
    queryValue ||
    storedValue ||
    (localHost ? "http://localhost:8000" : "")
  );

  if (queryValue && selected) {
    localStorage.setItem(KEY, selected);
  }

  window.NINIA_API_BASE_URL = selected;
  window.NINIA_API_CONFIG = {
    key: KEY,
    configured: Boolean(selected),
    local: localHost,
    get() {
      return normalize(
        window.NINIA_API_BASE_URL ||
        localStorage.getItem(KEY) ||
        ""
      );
    },
    set(value) {
      const normalized = normalize(value);
      if (!normalized) {
        throw new Error(
          "La URL debe comenzar con http:// o https://"
        );
      }
      localStorage.setItem(KEY, normalized);
      window.NINIA_API_BASE_URL = normalized;
      return normalized;
    },
    clear() {
      localStorage.removeItem(KEY);
      window.NINIA_API_BASE_URL = (
        localHost ? "http://localhost:8000" : ""
      );
    },
  };
})();
