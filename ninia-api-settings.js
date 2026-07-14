(() => {
  "use strict";

  const config = () => window.NINIA_API_CONFIG;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentBase() {
    return config()?.get?.() || "";
  }

  async function testBackend(baseUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `${baseUrl.replace(/\/+$/, "")}/health`,
        {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        }
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.detail || `Error HTTP ${response.status}`
        );
      }
      return payload;
    } finally {
      clearTimeout(timeout);
    }
  }

  function ensureMarkup() {
    if (document.getElementById("niniaApiSettings")) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <button
        id="niniaApiButton"
        class="ninia-api-button"
        type="button"
        aria-label="Configurar conexión API"
      >⚙ API</button>

      <div
        id="niniaApiSettings"
        class="ninia-api-modal"
        aria-hidden="true"
      >
        <section
          class="ninia-api-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="niniaApiTitle"
        >
          <button
            id="niniaApiClose"
            class="ninia-api-close"
            aria-label="Cerrar"
          >×</button>

          <p class="ninia-api-kicker">CONEXIÓN OPERATIVA</p>
          <h2 id="niniaApiTitle">Backend NINIA-AI</h2>
          <p>
            Introduce la URL pública del backend. Ejemplo:
            <code>https://tu-backend.onrender.com</code>
          </p>

          <label class="ninia-api-label">
            URL del backend
            <input
              id="niniaApiInput"
              type="url"
              placeholder="https://..."
              autocomplete="url"
            >
          </label>

          <div class="ninia-api-actions">
            <button
              id="niniaApiTest"
              class="ninia-api-secondary"
              type="button"
            >Probar conexión</button>
            <button
              id="niniaApiSave"
              class="ninia-api-primary"
              type="button"
            >Guardar y recargar</button>
          </div>

          <div
            id="niniaApiResult"
            class="ninia-api-result"
            role="status"
          ></div>
        </section>
      </div>
    `;
    document.body.append(...wrapper.children);

    const button = document.getElementById("niniaApiButton");
    const modal = document.getElementById("niniaApiSettings");
    const close = document.getElementById("niniaApiClose");
    const input = document.getElementById("niniaApiInput");
    const test = document.getElementById("niniaApiTest");
    const save = document.getElementById("niniaApiSave");
    const result = document.getElementById("niniaApiResult");

    function open() {
      input.value = currentBase();
      result.textContent = currentBase()
        ? `Configurado: ${currentBase()}`
        : "Backend aún no configurado.";
      result.className = "ninia-api-result";
      modal.setAttribute("aria-hidden", "false");
      input.focus();
    }

    function hide() {
      modal.setAttribute("aria-hidden", "true");
    }

    button.addEventListener("click", open);
    close.addEventListener("click", hide);
    modal.addEventListener("click", event => {
      if (event.target === modal) hide();
    });

    test.addEventListener("click", async () => {
      try {
        const normalized = config().set(input.value);
        result.textContent = "Probando conexión…";
        result.className = "ninia-api-result";
        const payload = await testBackend(normalized);
        result.textContent = (
          `Conexión correcta. NINIA-AI ${
            payload.version || ""
          }`
        ).trim();
        result.className = "ninia-api-result ok";
      } catch (error) {
        result.textContent = `No conecta: ${error.message}`;
        result.className = "ninia-api-result error";
      }
    });

    save.addEventListener("click", async () => {
      try {
        const normalized = config().set(input.value);
        result.textContent = "Verificando antes de guardar…";
        result.className = "ninia-api-result";
        await testBackend(normalized);
        result.textContent = "Conexión guardada. Recargando…";
        result.className = "ninia-api-result ok";
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        result.textContent = `No se guardó: ${error.message}`;
        result.className = "ninia-api-result error";
      }
    });

    if (!currentBase()) {
      button.classList.add("needs-config");
      button.title = "Configura la URL pública de NINIA-AI";
    }
  }

  document.addEventListener("DOMContentLoaded", ensureMarkup);
})();
