(() => {
  "use strict";

  const stored = localStorage.getItem("NINIA_API_BASE_URL");
  const local = ["localhost", "127.0.0.1"].includes(location.hostname);

  window.NINIA_API_BASE_URL = (
    stored ||
    (local ? "http://localhost:8000" : "")
  ).replace(/\/$/, "");
})();
