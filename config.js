(() => {
  "use strict";

  const STORAGE_KEY = "NINIA_API_BASE_URL";
  const params = new URLSearchParams(window.location.search);
  const queryValue = String(params.get("api") || "").trim();
  const storedValue = String(localStorage.getItem(STORAGE_KEY) || "").trim();
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  const PRODUCTION_CANDIDATES = [
    "https://ninia-ai-mtdigital2017.onrender.com",
    "https://ninia-ai.vercel.app"
  ];

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

  async function isHealthy(baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: "GET",
        cache: "no-store",
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async function resolveApiBaseUrl() {
    const explicit = normalize(queryValue || storedValue);
    if (explicit && await isHealthy(explicit)) {
      localStorage.setItem(STORAGE_KEY, explicit);
      return explicit;
    }

    if (isLocal) {
      const local = "http://localhost:8000";
      if (await isHealthy(local)) return local;
    }

    for (const candidate of PRODUCTION_CANDIDATES) {
      if (await isHealthy(candidate)) {
        localStorage.setItem(STORAGE_KEY, candidate);
        return candidate;
      }
    }

    return normalize(explicit || (isLocal ? "http://localhost:8000" : PRODUCTION_CANDIDATES[0]));
  }

  window.NINIA_API_BASE_URL = normalize(
    queryValue ||
    storedValue ||
    (isLocal ? "http://localhost:8000" : PRODUCTION_CANDIDATES[0])
  );

  window.NINIA_API_READY = resolveApiBaseUrl().then((resolved) => {
    window.NINIA_API_BASE_URL = resolved;
    return resolved;
  });

  window.NINIA_API_CONFIG = {
    storageKey: STORAGE_KEY,
    candidates: [...PRODUCTION_CANDIDATES],
    get() {
      return normalize(
        window.NINIA_API_BASE_URL ||
        localStorage.getItem(STORAGE_KEY) ||
        ""
      );
    },
    async resolve() {
      return window.NINIA_API_READY;
    },
    set(value) {
      const normalized = normalize(value);
      if (!normalized) throw new Error("La URL debe comenzar con http:// o https://");
      localStorage.setItem(STORAGE_KEY, normalized);
      window.NINIA_API_BASE_URL = normalized;
      window.NINIA_API_READY = Promise.resolve(normalized);
      return normalized;
    },
    clear() {
      localStorage.removeItem(STORAGE_KEY);
      window.NINIA_API_BASE_URL = isLocal
        ? "http://localhost:8000"
        : PRODUCTION_CANDIDATES[0];
      window.NINIA_API_READY = resolveApiBaseUrl();
    }
  };
})();
