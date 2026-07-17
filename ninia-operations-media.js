(() => {
  "use strict";

  const TRUST_LEVEL_A = [
    "UNICEF", "WHO", "OMS", "UNESCO", "OECD", "OCDE",
    "UNITED NATIONS", "NACIONES UNIDAS", "EUROPEAN COMMISSION",
    "COMISIÓN EUROPEA", "COUNCIL OF EUROPE", "CONSEJO DE EUROPA",
    "ITU", "UIT", "WORLD BANK", "BANCO MUNDIAL"
  ];

  const state = {
    status: null,
    knowledge: [],
    audience: "families",
    loading: false,
    timer: null,
  };

  const apiBase = () => String(
    window.NINIA_API_BASE_URL ||
    localStorage.getItem("NINIA_API_BASE_URL") ||
    "http://localhost:8000"
  ).replace(/\/$/, "");

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  async function request(path, options = {}) {
    const response = await fetch(`${apiBase()}${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || `Error HTTP ${response.status}`);
    }
    return payload;
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function percent(value) {
    const parsed = number(value);
    return `${(parsed <= 1 ? parsed * 100 : parsed).toFixed(2)}%`;
  }

  function currentPage() {
    return (location.hash || "#overview").slice(1);
  }

  function operationMarkup() {
    const s = state.status || {};
    const corpus = s.corpus || s.corpus_audit || {};
    const counts = corpus.counts || corpus;
    const training = s.training || {};
    const acquisition = s.acquisition || {};
    const model = s.model || s.latest_model || {};
    const health = s.status || "DESCONOCIDO";

    return `
      <section class="page-header operations-header">
        <div>
          <p class="eyebrow">CENTRO DE OPERACIONES</p>
          <h1>NINIA en tiempo real</h1>
          <p>Ejecuta misiones controladas y observa la evolución de evidencia, conocimiento, corpus y modelo.</p>
        </div>
        <div class="header-actions">
          <button class="ghost-button" id="refreshOperations">Actualizar</button>
          <button class="primary-button" id="runMission">▶ Ejecutar misión</button>
        </div>
      </section>

      <section class="operations-status-strip">
        <article><span>Estado</span><strong class="status-live">● ${esc(health)}</strong><small>Backend: ${esc(apiBase())}</small></article>
        <article><span>Propuestos</span><strong>${number(counts.proposed)}</strong><small>Requieren revisión</small></article>
        <article><span>Aprobados</span><strong>${number(counts.approved)}</strong><small>Conocimiento oficial</small></article>
        <article><span>Corpus score</span><strong>${number(corpus.corpus_score?.value ?? corpus.corpus_score).toFixed(2)}</strong><small>No es accuracy</small></article>
      </section>

      <section class="operations-grid">
        <article class="card operation-card">
          <div class="card-header"><div><h3>Última adquisición</h3><p>Fuentes oficiales y cola de evidencia</p></div><span class="operation-badge">LIVE</span></div>
          <dl>
            <div><dt>Descubiertos</dt><dd>${number(acquisition.documents_discovered)}</dd></div>
            <div><dt>Adquiridos</dt><dd>${number(acquisition.documents_acquired)}</dd></div>
            <div><dt>Rechazados</dt><dd>${number(acquisition.documents_rejected)}</dd></div>
            <div><dt>Duplicados</dt><dd>${number(acquisition.duplicates)}</dd></div>
          </dl>
        </article>

        <article class="card operation-card">
          <div class="card-header"><div><h3>Training gate</h3><p>Entrenamiento solo cuando existe evidencia suficiente</p></div></div>
          <div class="gate ${training.ready || training.status === "TRAINED" ? "open" : "closed"}">
            <strong>${training.ready || training.status === "TRAINED" ? "ABIERTO" : "BLOQUEADO"}</strong>
            <span>${esc(training.status || corpus.training_gate?.reasons?.[0] || "Esperando crecimiento del corpus")}</span>
          </div>
          <p class="operation-note">El modelo oficial no cambia con entrenamientos experimentales ni con métricas no auditadas.</p>
        </article>

        <article class="card operation-card">
          <div class="card-header"><div><h3>Modelo oficial</h3><p>Baseline científicamente registrado</p></div></div>
          <dl>
            <div><dt>Versión</dt><dd>${esc(model.version || s.baseline_model_version || "v0.1-real")}</dd></div>
            <div><dt>Accuracy estricta</dt><dd>${percent(model.strict_accuracy ?? s.baseline_metrics?.strict_document_accuracy ?? 0.2731)}</dd></div>
            <div><dt>Macro-F1 estricta</dt><dd>${percent(model.strict_macro_f1 ?? s.baseline_metrics?.strict_document_macro_f1 ?? 0.1257)}</dd></div>
          </dl>
        </article>

        <article class="card operation-card activity-log">
          <div class="card-header"><div><h3>Actividad</h3><p>Última ejecución registrada</p></div></div>
          <code>${esc(s.run_id || s.latest_run_id || "Sin ejecución registrada")}</code>
          <p>${esc(s.updated_at || s.generated_at || "Actualiza para consultar el backend.")}</p>
          <div id="missionFeedback" class="mission-feedback"></div>
        </article>
      </section>
    `;
  }

  function trustLevel(source) {
    const normalized = String(source || "").toUpperCase();
    return TRUST_LEVEL_A.some(item => normalized.includes(item)) ? "A" : "B";
  }

  function audienceLabel(value) {
    return {
      families: "Familias",
      teachers: "Docentes",
      youth: "Niñas, niños y adolescentes",
      policy: "Reguladores",
      research: "Investigadores",
      general: "Público general",
    }[value] || value;
  }

  function summaryFor(item) {
    const raw = item.summary || item.abstract || item.content || item.description || "";
    const clean = String(raw).replace(/\s+/g, " ").trim();
    const base = clean || `Nueva evidencia validada sobre ${(item.topics || ["protección digital"])[0]}.`;
    const short = base.length > 280 ? `${base.slice(0, 277)}…` : base;
    if (state.audience === "youth") return `En palabras sencillas: ${short}`;
    if (state.audience === "teachers") return `Clave para el aula: ${short}`;
    if (state.audience === "families") return `Lo que las familias deben saber: ${short}`;
    if (state.audience === "policy") return `Implicación para política pública: ${short}`;
    if (state.audience === "research") return `Síntesis de evidencia: ${short}`;
    return short;
  }

  function mediaCard(item) {
    const source = item.source_entity || item.source || item.organization || "Fuente no registrada";
    const level = trustLevel(source);
    const informative = true;
    const autoPublished = level === "A" && informative;
    const status = autoPublished ? "PUBLICADO_AUTOMÁTICAMENTE" : "REVISIÓN_EDITORIAL";
    const topics = Array.isArray(item.topics) ? item.topics.slice(0, 3) : [];
    const id = item.knowledge_id || item.id || "sin-id";
    const title = item.title || "Nueva evidencia validada";

    return `
      <article class="media-knowledge-card">
        <div class="media-card-top">
          <span class="trust-chip trust-${level.toLowerCase()}">Fuente nivel ${level}</span>
          <span class="publication-chip ${autoPublished ? "published" : "review"}">${status.replaceAll("_", " ")}</span>
        </div>
        <p class="eyebrow">${esc(audienceLabel(state.audience))}</p>
        <h2>${esc(title)}</h2>
        <p>${esc(summaryFor(item))}</p>
        <div class="media-topics">${topics.map(topic => `<span>${esc(topic)}</span>`).join("")}</div>
        <footer>
          <div><b>Fuente:</b> ${esc(source)} · <b>Año:</b> ${esc(item.publication_year || item.year || "N/D")}</div>
          <code>${esc(id)}</code>
        </footer>
      </article>
    `;
  }

  function mediaMarkup() {
    return `
      <section class="page-header media-center-header">
        <div>
          <p class="eyebrow">CENTRO DE MEDIOS NINIA</p>
          <h1>Conocimiento que se convierte en información útil</h1>
          <p>Productos automáticos construidos únicamente desde conocimiento aprobado y con trazabilidad visible.</p>
        </div>
        <button class="ghost-button" id="refreshMedia">Actualizar</button>
      </section>

      <section class="media-policy card">
        <div><strong>Publicación adaptativa</strong><p>Fuentes nivel A + síntesis informativa fiel: publicación automática con auditoría posterior. Los demás casos requieren revisión proporcional al riesgo.</p></div>
        <span>Sin sensacionalismo · sin afirmaciones no respaldadas</span>
      </section>

      <section class="audience-switcher" aria-label="Público objetivo">
        ${["families","teachers","youth","policy","research","general"].map(value =>
          `<button data-audience="${value}" class="${state.audience === value ? "active" : ""}">${esc(audienceLabel(value))}</button>`
        ).join("")}
      </section>

      <section id="mediaKnowledgeFeed" class="media-knowledge-grid">
        ${state.loading
          ? '<article class="card loading-card">Cargando conocimiento aprobado…</article>'
          : state.knowledge.length
            ? state.knowledge.map(mediaCard).join("")
            : '<article class="card loading-card">Aún no hay Knowledge Objects aprobados disponibles desde la API.</article>'}
      </section>
    `;
  }

  async function loadStatus() {
    state.status = await request("/operations/status");
    if (currentPage() === "operations") renderOperations();
  }

  async function loadKnowledge() {
    state.loading = true;
    if (currentPage() === "media") renderMedia();
    const payload = await request("/knowledge?status=approved");
    state.knowledge = Array.isArray(payload) ? payload : (payload.items || payload.knowledge || []);
    state.loading = false;
    if (currentPage() === "media") renderMedia();
  }

  function renderOperations() {
    const root = document.getElementById("pageContent");
    if (!root || currentPage() !== "operations") return;
    root.innerHTML = operationMarkup();
    document.getElementById("refreshOperations")?.addEventListener("click", () => {
      loadStatus().catch(showError);
    });
    document.getElementById("runMission")?.addEventListener("click", runMission);
  }

  function renderMedia() {
    const root = document.getElementById("pageContent");
    if (!root || currentPage() !== "media") return;
    root.innerHTML = mediaMarkup();
    document.getElementById("refreshMedia")?.addEventListener("click", () => {
      loadKnowledge().catch(showError);
    });
    root.querySelectorAll("[data-audience]").forEach(button => {
      button.addEventListener("click", () => {
        state.audience = button.dataset.audience;
        renderMedia();
      });
    });
  }

  async function runMission() {
    const button = document.getElementById("runMission");
    const feedback = document.getElementById("missionFeedback");
    if (button) button.disabled = true;
    if (feedback) feedback.textContent = "Ejecutando misión controlada…";
    try {
      const result = await request("/operations/run", {
        method: "POST",
        body: JSON.stringify({
          source_ids: [],
          max_documents_per_source: 1,
          max_total_documents: 3,
          train_if_ready: true,
        }),
      });
      state.status = result;
      renderOperations();
    } catch (error) {
      showError(error);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function showError(error) {
    const root = document.getElementById("pageContent");
    if (!root) return;
    const box = document.createElement("div");
    box.className = "operations-error";
    box.textContent = `No fue posible consultar NINIA-AI: ${error.message}`;
    root.prepend(box);
  }

  function activatePage() {
    clearInterval(state.timer);
    if (currentPage() === "operations") {
      renderOperations();
      loadStatus().catch(showError);
      state.timer = setInterval(() => loadStatus().catch(() => {}), 5000);
    } else if (currentPage() === "media") {
      renderMedia();
      loadKnowledge().catch(showError);
    }
  }

  // app.js se carga antes de este módulo y renderiza la página
  // durante hashchange/DOMContentLoaded. No se observa #pageContent aquí:
  // renderOperations() y renderMedia() modifican ese mismo nodo y una
  // observación recursiva produciría un ciclo infinito de renderizado.
  window.addEventListener("ninia:page-ready", event => {
    if (["operations", "media"].includes(event.detail?.page)) activatePage();
  });
  document.addEventListener("DOMContentLoaded", activatePage);
})();