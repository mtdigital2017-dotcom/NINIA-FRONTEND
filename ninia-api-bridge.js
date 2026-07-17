(() => {
  "use strict";

  const apiBase = () => String(
    window.NINIA_API_BASE_URL ||
    localStorage.getItem("NINIA_API_BASE_URL") ||
    "http://localhost:8000"
  ).replace(/\/$/, "");

  const PROFILE_KEY = "ninia_researcher_profile_v1";

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  async function request(path, options = {}) {
    if (window.NINIA_API_READY) await window.NINIA_API_READY;
    const response = await fetch(`${apiBase()}${path}`, {
      headers: {
        Accept: "application/json",
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

  function ensureConnectionPanel() {
    const card = document.querySelector(".system-check .warn-dot")?.closest(".system-check");
    if (!card) return;
    request("/health")
      .then(payload => {
        card.innerHTML = `
          <span class="ok-dot"></span>
          <div>
            <b>Backend conectado</b>
            <small>NINIA-AI ${escapeHtml(payload.version || "")}</small>
          </div>`;
      })
      .catch(error => {
        card.innerHTML = `
          <span class="warn-dot"></span>
          <div>
            <b>Backend desconectado</b>
            <small>${escapeHtml(error.message)}</small>
          </div>`;
      });
  }

  function addResearcherFields(form) {
    if (!form || form.dataset.apiFields === "true") return;
    form.dataset.apiFields = "true";

    const relation = form.querySelector('[name="relation"]')?.closest("label");
    if (!relation) return;

    const profile = getProfile();
    const block = document.createElement("div");
    block.className = "ninia-api-profile-fields";
    block.innerHTML = `
      <div class="form-grid-two">
        <label>Nombre del investigador
          <input name="researcher_name" required value="${escapeHtml(profile.name || "")}">
        </label>
        <label>Correo institucional
          <input name="researcher_email" type="email" required value="${escapeHtml(profile.email || "")}">
        </label>
      </div>
      <div class="form-grid-two">
        <label>Institución
          <input name="institution" required value="${escapeHtml(profile.institution || "")}">
        </label>
        <label>País
          <input name="country" required value="${escapeHtml(profile.country || "")}">
        </label>
      </div>
      <div class="form-grid-two">
        <label>Especialidad
          <select name="specialty" required>
            <option value="">Cargando especialidades…</option>
          </select>
        </label>
        <label>ORCID
          <input name="orcid" value="${escapeHtml(profile.orcid || "")}" placeholder="0000-0000-0000-0000">
        </label>
      </div>`;
    relation.after(block);

    request("/researcher/specialties")
      .then(payload => {
        const select = form.querySelector('[name="specialty"]');
        const items = Array.isArray(payload.items) ? payload.items : [];
        select.innerHTML = '<option value="">Selecciona</option>' +
          items.map(item => `<option value="${escapeHtml(item.id)}">${
            escapeHtml(item.label || item.name || item.id)
          }</option>`).join("");
        if (profile.specialty) select.value = profile.specialty;
      })
      .catch(() => {
        form.querySelector('[name="specialty"]').innerHTML =
          '<option value="">No fue posible cargar especialidades</option>';
      });
  }

  async function submitEvidence(form) {
    const submit = form.querySelector("#submitEvidenceAdmission");
    submit.disabled = true;

    try {
      const data = new FormData(form);
      const profile = {
        name: String(data.get("researcher_name") || "").trim(),
        email: String(data.get("researcher_email") || "").trim().toLowerCase(),
        institution: String(data.get("institution") || "").trim(),
        country: String(data.get("country") || "").trim(),
        specialty: String(data.get("specialty") || "").trim(),
        orcid: String(data.get("orcid") || "").trim(),
      };
      saveProfile(profile);

      const payload = new FormData();
      payload.append("file", data.get("file"));
      payload.append("title", data.get("title"));
      payload.append("year", data.get("year"));
      payload.append("author", data.get("author"));
      payload.append("source", data.get("source"));
      payload.append("document_type", data.get("documentType"));
      payload.append("relation_to_ninia", data.get("relation"));
      payload.append("specialty", profile.specialty);
      payload.append("researcher_name", profile.name);
      payload.append("researcher_email", profile.email);
      payload.append("institution", profile.institution);
      payload.append("country", profile.country);
      payload.append("source_url_or_doi", data.get("url") || "");
      payload.append("orcid", profile.orcid);
      payload.append(
        "declaration_accepted",
        data.get("declaration") ? "true" : "false"
      );

      const result = await request("/evidence/requests", {
        method: "POST",
        body: payload,
      });

      form.reset();
      form.closest("dialog")?.close();
      await loadPrivateRequests();
      window.NINIA_KNOWLEDGE_ADAPTER?.load("approved");
      window.showToast?.(
        `Documento en ${result.request?.status || "CUARENTENA"}`
      );
    } catch (error) {
      window.showToast?.(error.message);
      throw error;
    } finally {
      submit.disabled = false;
    }
  }

  async function loadPrivateRequests() {
    const target = document.getElementById("evidenceStatus");
    if (!target) return;

    const profile = getProfile();
    if (!profile.email) {
      target.textContent = "Completa tu correo institucional para consultar tus documentos.";
      return;
    }

    target.textContent = "Consultando tus documentos…";

    try {
      const params = new URLSearchParams({
        researcher_email: profile.email,
      });
      const payload = await request(`/evidence/requests?${params}`);
      const items = Array.isArray(payload.items) ? payload.items : [];

      const evidenceCount = document.getElementById("evidenceCount");
      const validationCount = document.getElementById("validationCount");
      if (evidenceCount) evidenceCount.textContent = items.length;
      if (validationCount) {
        validationCount.textContent = items.filter(item =>
          ["CUARENTENA", "EN_VALIDACION"].includes(item.status)
        ).length;
      }

      if (!items.length) {
        target.textContent = "Aún no tienes solicitudes registradas.";
        return;
      }

      target.innerHTML = items.slice(0, 6).map(item => `
        <article class="ninia-private-request">
          <b>${escapeHtml(item.title)}</b>
          <small>${escapeHtml(item.author)} · ${escapeHtml(item.status)}</small>
          <small>${escapeHtml(item.processing_status || "PENDIENTE")}</small>
        </article>
      `).join("");
    } catch (error) {
      target.textContent = `No fue posible consultar tus documentos: ${error.message}`;
    }
  }

  function bindResearcher() {
    if (location.hash !== "#researcher") return;

    ensureConnectionPanel();

    const form = document.getElementById("evidenceAdmissionForm");
    if (!form) return;

    addResearcherFields(form);

    if (form.dataset.apiBound !== "true") {
      form.dataset.apiBound = "true";
      form.addEventListener("submit", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitEvidence(form).catch(() => {});
      }, true);
    }

    loadPrivateRequests();
  }

  window.addEventListener("ninia:page-ready", event => {
    if (event.detail?.page === "researcher") bindResearcher();
  });
  document.addEventListener("DOMContentLoaded", bindResearcher);

  window.NINIA_API_BRIDGE = {
    health: () => request("/health"),
    loadPrivateRequests,
    getProfile,
  };
})();
