
(() => {
  'use strict';

  const API_BASE_URL =
    window.NINIA_API_BASE_URL ||
    localStorage.getItem('NINIA_API_BASE_URL') ||
    'http://localhost:8000';

  const state = {
    status: 'approved',
    items: [],
    loading: false,
    error: null,
  };

  const escapeHtml = value =>
    String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const first = (...values) =>
    values.find(value =>
      value !== undefined &&
      value !== null &&
      value !== ''
    );

  function normalizeKnowledgeItem(raw = {}) {
    const provenance = raw.provenance || {};
    const topics = Array.isArray(raw.topics)
      ? raw.topics.filter(Boolean)
      : raw.main_topic
        ? [raw.main_topic]
        : [];

    return {
      id: first(
        raw.knowledge_id,
        raw.id,
        raw.document_id,
        provenance.sha256
      ),
      title: first(raw.title, raw.name, 'Documento sin título'),
      summary: first(
        raw.summary,
        raw.abstract,
        raw.description,
        'Resumen pendiente de validación.'
      ),
      source: first(
        raw.source_entity,
        raw.source,
        raw.organization,
        'Fuente no registrada'
      ),
      sourceUrl: first(
        raw.source_url_or_doi,
        raw.doi,
        raw.url,
        ''
      ),
      year: first(raw.publication_year, raw.year, ''),
      documentType: first(raw.document_type, raw.type, 'Documento'),
      language: first(
        raw.original_language,
        raw.language,
        'No detectado'
      ),
      evidenceLevel: first(
        raw.evidence_level,
        'NO_CLASIFICADO'
      ),
      evidenceStatus: String(first(
        raw.evidence_status,
        raw.status,
        'PROPUESTO'
      )).toUpperCase(),
      topics,
      provenance,
    };
  }

  function statusLabel(value) {
    const labels = {
      APROBADO: 'Aprobado',
      PROPUESTO: 'Propuesto',
      EN_VALIDACION: 'En validación',
      RECHAZADO: 'Rechazado',
    };
    return labels[value] || value || 'No clasificado';
  }

  function card(item) {
    const topics = item.topics.length
      ? item.topics.slice(0, 4).map(topic =>
          `<span class="knowledge-topic">${escapeHtml(topic)}</span>`
        ).join('')
      : '<span class="knowledge-topic muted">Sin temas clasificados</span>';

    const source = item.sourceUrl
      ? `<a href="${escapeHtml(item.sourceUrl)}"
            target="_blank"
            rel="noopener noreferrer">Consultar fuente</a>`
      : '<span>Fuente sin enlace registrado</span>';

    return `
      <article class="paper-card knowledge-api-card"
        data-searchable="${escapeHtml([
          item.title,
          item.summary,
          item.source,
          item.language,
          ...item.topics
        ].join(' ').toLowerCase())}">
        <div class="knowledge-card-head">
          <span class="document-type">${escapeHtml(item.documentType)}</span>
          <span class="knowledge-status status-${escapeHtml(
            item.evidenceStatus.toLowerCase()
          )}">
            ${escapeHtml(statusLabel(item.evidenceStatus))}
          </span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <div class="knowledge-meta">
          <span><b>Fuente:</b> ${escapeHtml(item.source)}</span>
          <span><b>Año:</b> ${escapeHtml(item.year || 'No registrado')}</span>
          <span><b>Idioma original:</b> ${escapeHtml(item.language)}</span>
          <span><b>Evidencia:</b> ${escapeHtml(item.evidenceLevel)}</span>
        </div>
        <div class="knowledge-topics">${topics}</div>
        <footer class="knowledge-card-footer">
          ${source}
          <code>${escapeHtml(item.id || 'sin-id')}</code>
        </footer>
      </article>
    `;
  }

  function render(items) {
    const grid = document.getElementById('paperGrid');
    if (!grid) return;

    if (!items.length) {
      grid.innerHTML = `
        <div class="library-empty card">
          <h3>No hay conocimiento disponible en este estado</h3>
          <p>La validación humana sigue siendo obligatoria.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(card).join('');
  }

  function renderError(error) {
    const grid = document.getElementById('paperGrid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="library-error card">
        <h3>No fue posible consultar la Biblioteca</h3>
        <p>${escapeHtml(error.message || error)}</p>
        <button class="primary-button" id="retryKnowledge">
          Reintentar
        </button>
      </div>
    `;

    document.getElementById('retryKnowledge')?.addEventListener(
      'click',
      () => loadKnowledge(state.status)
    );
  }

  async function loadKnowledge(status = 'approved') {
    const grid = document.getElementById('paperGrid');
    if (!grid || state.loading) return;

    state.loading = true;
    state.status = status;
    state.error = null;

    grid.innerHTML = `
      <div class="library-loading card">
        Consultando conocimiento en NINIA…
      </div>
    `;

    try {
      const url = new URL(
        `${API_BASE_URL.replace(/\/$/, '')}/knowledge`
      );
      url.searchParams.set('status', status);

      const response = await readyFetch(url.toString(), {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Knowledge API respondió ${response.status}`);
      }

      const payload = await response.json();
      const rawItems = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.items)
          ? payload.items
          : [];

      state.items = rawItems.map(normalizeKnowledgeItem);
      render(state.items);
    } catch (error) {
      state.error = error;
      renderError(error);
    } finally {
      state.loading = false;
    }
  }

  function filterCards(query) {
    const normalized = String(query || '').trim().toLowerCase();

    document
      .querySelectorAll('#paperGrid .knowledge-api-card')
      .forEach(node => {
        node.hidden = Boolean(
          normalized &&
          !node.dataset.searchable.includes(normalized)
        );
      });
  }

  function bindLibrary() {
    if (window.location.hash !== '#library') return;

    const grid = document.getElementById('paperGrid');
    const search = document.getElementById('paperSearch');

    if (!grid || grid.dataset.niniaApiBound === 'true') return;

    grid.dataset.niniaApiBound = 'true';
    search?.addEventListener('input', event =>
      filterCards(event.target.value)
    );

    loadKnowledge('approved');
  }

  window.addEventListener('ninia:page-ready', event => {
    if (event.detail?.page === 'library') bindLibrary();
  });
  document.addEventListener('DOMContentLoaded', bindLibrary);

  window.NINIA_KNOWLEDGE_ADAPTER = {
    load: loadKnowledge,
    normalize: normalizeKnowledgeItem,
    state,
  };
})();
