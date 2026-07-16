(() => {
  "use strict";

  async function readyFetch(url, options) {
    if (window.NINIA_API_READY) await window.NINIA_API_READY;
    return fetch(url, options);
  }

  const state = {
    status: null,
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
    const response = await readyFetch(`${apiBase()}${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        payload.detail || `Error HTTP ${response.status}`
      );
    }
    return payload;
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function missionCard(mission) {
    const domains = (mission.domains || []).slice(0, 3);
    const regions = (mission.regions || []).slice(0, 3);
    return `
      <article class="mission-card">
        <div class="mission-card-head">
          <div>
            <span class="mission-code">${esc(mission.mission_id)}</span>
            <h3>${esc(mission.title)}</h3>
          </div>
          <span class="mission-status">
            ${esc(mission.status || "PLANNED")}
          </span>
        </div>
        <p>${esc(mission.objective)}</p>
        <div class="mission-tags">
          ${domains.map(
            item => `<span>${esc(item)}</span>`
          ).join("")}
          ${regions.map(
            item => `<span class="region">${esc(item)}</span>`
          ).join("")}
        </div>
        <dl>
          <div>
            <dt>Evidencia</dt>
            <dd>${number(mission.evidence_count)}</dd>
          </div>
          <div>
            <dt>Knowledge Objects</dt>
            <dd>${number(mission.knowledge_objects)}</dd>
          </div>
          <div>
            <dt>Media</dt>
            <dd>${number(mission.media_products)}</dd>
          </div>
          <div>
            <dt>AMI</dt>
            <dd>${number(mission.ami_resources)}</dd>
          </div>
        </dl>
      </article>
    `;
  }

  function coverageRows(values, emptyText) {
    const entries = Object.entries(values || {});
    if (!entries.length) {
      return `<p class="observatory-empty">${esc(emptyText)}</p>`;
    }
    const max = Math.max(
      ...entries.map(([, value]) => number(value)),
      1
    );
    return entries
      .sort((a, b) => number(b[1]) - number(a[1]))
      .map(([label, value]) => `
        <div class="coverage-row">
          <div>
            <span>${esc(label)}</span>
            <strong>${number(value)}</strong>
          </div>
          <i>
            <b style="width:${
              Math.max(8, (number(value) / max) * 100)
            }%"></b>
          </i>
        </div>
      `)
      .join("");
  }

  function markup() {
    const status = state.status || {};
    const sources = status.sources || {};
    const missions = status.missions || {};
    const knowledge = status.knowledge || {};
    const coverage = status.coverage || {};
    const ecosystems = status.ecosystems || {};

    return `
      <section class="page-header global-observatory-header">
        <div>
          <p class="eyebrow">GLOBAL OBSERVATORY</p>
          <h1>Inteligencia mundial orientada por misiones</h1>
          <p>
            Monitorea, investiga y transforma evidencia en conocimiento,
            comunicación, AMI y propuestas de acción para proteger a NNA
            en entornos digitales.
          </p>
        </div>
        <div class="header-actions">
          <button
            class="ghost-button"
            id="refreshGlobalObservatory"
          >Actualizar</button>
          <button
            class="primary-button"
            id="createGlobalMission"
          >＋ Nueva misión</button>
        </div>
      </section>

      <section class="global-kpis">
        <article>
          <span>Fuentes configuradas</span>
          <strong>${number(sources.configured)}</strong>
          <small>${number(sources.active)} activas</small>
        </article>
        <article>
          <span>Misiones</span>
          <strong>${number(missions.total)}</strong>
          <small>${number(missions.active)} activas</small>
        </article>
        <article>
          <span>KO propuestos</span>
          <strong>${number(knowledge.proposed)}</strong>
          <small>Revisión humana</small>
        </article>
        <article>
          <span>KO aprobados</span>
          <strong>${number(knowledge.approved)}</strong>
          <small>Fuente única de verdad</small>
        </article>
        <article>
          <span>Corpus score</span>
          <strong>${number(
            knowledge.corpus_score
          ).toFixed(2)}</strong>
          <small>No es accuracy</small>
        </article>
      </section>

      <section class="global-observatory-grid">
        <article class="card mission-panel">
          <div class="card-header">
            <div>
              <h2>Mission Center</h2>
              <p>Unidad operativa principal de NINIA</p>
            </div>
            <span class="live-chip">LIVE</span>
          </div>
          <div class="mission-list">
            ${
              (missions.items || []).map(missionCard).join("") ||
              '<p class="observatory-empty">' +
              'Aún no existen misiones.</p>'
            }
          </div>
        </article>

        <aside class="observatory-side">
          <article class="card coverage-card">
            <div class="card-header">
              <div>
                <h3>Cobertura por dominio</h3>
                <p>Representación dentro del corpus NINIA</p>
              </div>
            </div>
            ${coverageRows(
              coverage.domains,
              "Sin dominios registrados."
            )}
          </article>
          <article class="card coverage-card">
            <div class="card-header">
              <div>
                <h3>Cobertura por región</h3>
                <p>No clasifica países ni regiones</p>
              </div>
            </div>
            ${coverageRows(
              coverage.regions,
              "Sin regiones registradas."
            )}
          </article>
        </aside>
      </section>

      <section class="ecosystem-strip">
        ${Object.entries(ecosystems).map(
          ([key, value]) => `
            <article>
              <span>${esc(key.replaceAll("_", " "))}</span>
              <strong>${esc(value)}</strong>
            </article>
          `
        ).join("")}
      </section>

      <section class="card observatory-principle">
        <div>
          <p class="eyebrow">UNA SOLA FUENTE DE VERDAD</p>
          <h2>
            Del monitoreo mundial a AMI, Media Center y Action Lab
          </h2>
          <p>
            Todos los productos públicos y educativos deben derivarse
            de Knowledge Objects aprobados y conservar trazabilidad.
          </p>
        </div>
        <div class="observatory-flow">
          <span>Monitorear</span><b>→</b>
          <span>Investigar</span><b>→</b>
          <span>Validar</span><b>→</b>
          <span>Comunicar</span><b>→</b>
          <span>Formar</span><b>→</b>
          <span>Proponer</span>
        </div>
      </section>

      <div
        id="observatoryMessage"
        class="observatory-message"
        role="status"
      ></div>
    `;
  }

  function showMessage(message, error = false) {
    const element = document.getElementById(
      "observatoryMessage"
    );
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("error", error);
  }

  async function load() {
    if (state.loading) return;
    state.loading = true;
    try {
      state.status = await request("/observatory/status");
      render();
    } catch (error) {
      showMessage(
        `No fue posible consultar el Observatorio: ${
          error.message
        }`,
        true
      );
    } finally {
      state.loading = false;
    }
  }

  async function createMission() {
    const title = prompt(
      "Título de la misión:",
      "Regulatory Intelligence"
    );
    if (!title) return;

    const objective = prompt(
      "Objetivo:",
      "Cerrar brechas de conocimiento para proteger a NNA."
    );
    if (!objective) return;

    const domain = prompt(
      "Dominio principal:",
      "Regulatory Intelligence"
    );
    if (!domain) return;

    const region = prompt(
      "Región:",
      "GLOBAL"
    ) || "GLOBAL";

    try {
      await request("/observatory/missions", {
        method: "POST",
        body: JSON.stringify({
          title,
          objective,
          domains: [domain],
          regions: [region],
          source_ids: [],
        }),
      });
      showMessage("Misión creada correctamente.");
      await load();
    } catch (error) {
      showMessage(
        `No fue posible crear la misión: ${error.message}`,
        true
      );
    }
  }

  function bind() {
    document.getElementById(
      "refreshGlobalObservatory"
    )?.addEventListener("click", load);

    document.getElementById(
      "createGlobalMission"
    )?.addEventListener("click", createMission);
  }

  function render() {
    const page = (location.hash || "#overview").slice(1);
    if (page !== "observatory") return;

    const container = document.getElementById("pageContent");
    if (!container) return;

    container.innerHTML = markup();
    bind();
  }

  function activate() {
    const page = (location.hash || "#overview").slice(1);
    if (page !== "observatory") return;

    render();
    load();
    clearInterval(state.timer);
    state.timer = setInterval(load, 10000);
  }

  window.addEventListener("hashchange", activate);
  document.addEventListener("DOMContentLoaded", activate);

  const observer = new MutationObserver(() => {
    const page = (location.hash || "#overview").slice(1);
    if (
      page === "observatory" &&
      !document.querySelector(
        ".global-observatory-header"
      )
    ) {
      activate();
    }
  });

  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true,
    }
  );
})();
