(() => {
  "use strict";

  async function readyFetch(url, options) {
    if (window.NINIA_API_READY) await window.NINIA_API_READY;
    return fetch(url, options);
  }

  const API_BASE_URL =
    window.NINIA_API_BASE_URL ||
    localStorage.getItem("NINIA_API_BASE_URL") ||
    "http://localhost:8000";

  const style = document.createElement("style");
  style.textContent = `
    .ninia-upload-panel { margin-top:24px; padding:24px; border:1px solid rgba(15,61,69,.16); border-radius:18px; background:#fff; box-shadow:0 12px 36px rgba(12,43,48,.08); }
    .ninia-upload-panel h2 { margin:0 0 8px; }
    .ninia-upload-panel p { margin:0 0 18px; }
    .ninia-upload-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
    .ninia-upload-field { display:flex; flex-direction:column; gap:6px; }
    .ninia-upload-field.full { grid-column:1/-1; }
    .ninia-upload-field label { font-weight:700; }
    .ninia-upload-field input { width:100%; padding:11px 12px; border:1px solid #c9d4d6; border-radius:10px; font:inherit; box-sizing:border-box; }
    .ninia-upload-actions { display:flex; align-items:center; gap:12px; margin-top:16px; flex-wrap:wrap; }
    .ninia-upload-button { border:0; border-radius:10px; padding:12px 18px; background:#0f5963; color:#fff; font:inherit; font-weight:700; cursor:pointer; }
    .ninia-upload-button:disabled { opacity:.55; cursor:wait; }
    .ninia-upload-status { font-weight:700; }
    .ninia-upload-status.error { color:#a12222; }
    .ninia-upload-status.ok { color:#17643a; }
    .ninia-upload-result { display:none; margin-top:18px; padding:18px; border-radius:12px; background:#f3f7f7; }
    .ninia-upload-result.visible { display:block; }
    .ninia-result-list { margin:8px 0 0; padding-left:20px; }
    .ninia-api-note { margin-top:10px; font-size:.9rem; opacity:.78; }
    @media (max-width:720px) { .ninia-upload-grid { grid-template-columns:1fr; } }
  `;
  document.head.appendChild(style);

  const isResearcher = () => location.hash.replace("#","") === "researcher";
  const container = () => document.querySelector("#pageContent") || document.querySelector("main") || document.body;

  function escapeHtml(v) {
    return String(v).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    })[c]);
  }

  function createPanel() {
    const panel = document.createElement("section");
    panel.id = "niniaResearcherUpload";
    panel.className = "ninia-upload-panel";
    panel.innerHTML = `
      <h2>Incorporar evidencia</h2>
      <p>Función exclusiva para investigadores. El documento se registrará inicialmente como <strong>PROPUESTO</strong>.</p>
      <form id="niniaUploadForm">
        <div class="ninia-upload-grid">
          <div class="ninia-upload-field full">
            <label for="niniaDocument">Documento *</label>
            <input id="niniaDocument" name="file" type="file" accept=".pdf,.docx,.txt" required>
          </div>
          <div class="ninia-upload-field">
            <label for="niniaTitle">Título</label>
            <input id="niniaTitle" name="title" type="text">
          </div>
          <div class="ninia-upload-field">
            <label for="niniaSource">Entidad fuente</label>
            <input id="niniaSource" name="source_entity" type="text" placeholder="UNICEF, UNESCO, universidad...">
          </div>
          <div class="ninia-upload-field full">
            <label for="niniaDoi">URL o DOI</label>
            <input id="niniaDoi" name="source_url_or_doi" type="url" placeholder="https://...">
          </div>
        </div>
        <div class="ninia-upload-actions">
          <button class="ninia-upload-button" type="submit">Procesar documento</button>
          <span id="niniaUploadStatus" class="ninia-upload-status"></span>
        </div>
        <div class="ninia-api-note">La evidencia requiere validación humana antes de pasar a APROBADO.</div>
      </form>
      <div id="niniaUploadResult" class="ninia-upload-result" aria-live="polite"></div>
    `;
    panel.querySelector("form").addEventListener("submit", processDocument);
    return panel;
  }

  async function processDocument(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    const status = form.querySelector("#niniaUploadStatus");
    const resultBox = document.querySelector("#niniaUploadResult");
    const file = form.querySelector("#niniaDocument").files[0];

    if (!file) {
      status.textContent = "Selecciona un documento.";
      status.className = "ninia-upload-status error";
      return;
    }

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".pdf",".docx",".txt"].includes(ext)) {
      status.textContent = "Formato no permitido. Usa PDF, DOCX o TXT.";
      status.className = "ninia-upload-status error";
      return;
    }

    button.disabled = true;
    status.textContent = "NINIA está procesando el documento…";
    status.className = "ninia-upload-status";
    resultBox.classList.remove("visible");

    try {
      const response = await readyFetch(`${API_BASE_URL}/documents/process`, {
        method:"POST",
        body:new FormData(form)
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.detail || `Error HTTP ${response.status}`);

      const item = payload.knowledge_object || {};
      const risks = Array.isArray(item.digital_risks) ? item.digital_risks : ["NO_CLASIFICADO"];

      resultBox.innerHTML = `
        <h3>Ficha preliminar generada</h3>
        <p><strong>Título:</strong> ${escapeHtml(item.title || "Sin título")}</p>
        <p><strong>Fuente:</strong> ${escapeHtml(item.source_entity || "NO_IDENTIFICADO")}</p>
        <p><strong>Año:</strong> ${escapeHtml(item.year || "")}</p>
        <p><strong>Estado:</strong> ${escapeHtml(item.status || "PROPUESTO")}</p>
        <p><strong>Nivel de evidencia:</strong> ${escapeHtml(item.evidence_level || "NO_CLASIFICADO")}</p>
        <p><strong>Riesgos detectados:</strong></p>
        <ul class="ninia-result-list">${risks.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
        <p><strong>Resumen preliminar:</strong><br>${escapeHtml(item.summary || "")}</p>
      `;
      resultBox.classList.add("visible");
      status.textContent = "Documento procesado correctamente.";
      status.className = "ninia-upload-status ok";
      form.reset();
    } catch (err) {
      status.textContent = `No fue posible conectar con NINIA-AI. ${err.message}`;
      status.className = "ninia-upload-status error";
    } finally {
      button.disabled = false;
    }
  }

  function mount() {
    if (!isResearcher()) return;
    if (document.querySelector("#niniaResearcherUpload")) return;
    container().appendChild(createPanel());
  }

  window.addEventListener("ninia:page-ready", event => {
    if (event.detail?.page === "researcher") mount();
  });
  document.addEventListener("DOMContentLoaded", mount);
})();
