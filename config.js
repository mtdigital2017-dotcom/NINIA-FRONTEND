(() => {
  "use strict";

  const STORAGE_KEY = "NINIA_API_BASE_URL";
  const LOCAL_API = "http://localhost:8000";
  const PRODUCTION_CANDIDATES = [
    "https://ninia-ai.vercel.app"
  ];
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  function normalize(value) {
    const clean = String(value || "").trim().replace(/\/+$/, "");
    if (!clean) return "";
    try {
      const url = new URL(clean);
      return ["http:", "https:"].includes(url.protocol)
        ? url.toString().replace(/\/+$/, "")
        : "";
    } catch {
      return "";
    }
  }

  async function isHealthy(baseUrl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${baseUrl}/health`, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  const stored = normalize(localStorage.getItem(STORAGE_KEY));
  window.NINIA_API_BASE_URL = isLocal ? LOCAL_API : (stored || PRODUCTION_CANDIDATES[0]);
  window.NINIA_API_READY = (async () => {
    const candidates = isLocal
      ? [LOCAL_API]
      : [...new Set([stored, ...PRODUCTION_CANDIDATES].filter(Boolean))];

    for (const candidate of candidates) {
      const normalized = normalize(candidate);
      if (normalized && await isHealthy(normalized)) {
        window.NINIA_API_BASE_URL = normalized;
        localStorage.setItem(STORAGE_KEY, normalized);
        return normalized;
      }
    }

    throw new Error("No fue posible conectar con el backend público de NINIA.");
  })();

  window.NINIA_API_CONFIG = {
    storageKey: STORAGE_KEY,
    get: () => normalize(window.NINIA_API_BASE_URL),
    ready: () => window.NINIA_API_READY
  };
})();
