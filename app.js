const pages = {
  overview: () => `
    <section class="landing-hero">
      <div class="landing-intro"><span class="hero-kicker">NETWORK FOR INTELLIGENCE ON CHILDHOOD, INFORMATION & AI</span><h1>Inteligencia mundial<br>para proteger lo<br>que más importa.</h1><p>Investigamos. Analizamos. Comunicamos. Formamos.<br>Transformamos evidencia en decisiones y acción.</p><form class="landing-search" id="heroSearch"><span>⌕</span><input aria-label="Pregunta para NINIA" placeholder="¿Qué deseas investigar?"><button>Investigar</button></form><small>Ejemplo: ¿Cómo están enfrentando Finlandia y Australia el ciberacoso escolar?</small><div class="landing-shortcuts"><button data-page="observatory">◎ Explorar Observatorio</button><button data-page="packages">▤ Ver Knowledge Packages</button><button>ⓘ Conocer NINIA</button></div></div>
      <article class="featured-story"><img src="assets/ninia-family-hero.png" alt="Familia explorando contenido educativo en una tableta"><div class="story-shade"></div><div class="story-copy"><div><span class="story-tag">TEMA DESTACADO</span><span class="story-tag outline">NUEVA EVIDENCIA</span></div><h2>Involucrar a las familias reduce significativamente el riesgo de ciberacoso en adolescentes</h2><p>Un estudio longitudinal en 12 países demuestra que la participación familiar activa puede reducir hasta un 35% el riesgo de ciberacoso.</p><footer><span>◎ 12 países</span><span>▣ Mayo 2026</span><span>♢ Nivel de evidencia <b>★★★★★</b></span></footer></div><button class="story-button" data-page="library">Ver investigación →</button></article>
    </section>
    <div class="carousel-dots"><i class="active"></i><i></i><i></i><i></i></div>
    <section class="impact-strip">${impact('◎','196','Países monitoreados','Ver mapa →','blue')}${impact('▣','2.540','Fuentes monitoreadas','Ver fuentes →','green')}${impact('△','56.812','Investigaciones analizadas','Explorar →','purple')}${impact('♙','3.247','Programas y estrategias','Ver programas →','orange')}${impact('⌁','24/7','Observatorio activo','En tiempo real →','blue')}</section>
    <section class="evidence-layout">
      <article class="home-card working"><div class="home-title"><h2>¿Qué está funcionando?</h2><button data-page="library">Ver todas →</button></div><div class="practice-grid">${practice('Formación docente continua en bienestar digital','Finlandia · 17 estudios','high','▤')}${practice('Protocolos escolares de respuesta','Australia · 9 evaluaciones','high','◫')}${practice('Participación activa de familias','Canadá · 14 estudios','medium','⌂')}${practice('Diseño seguro de plataformas','Unión Europea · 11 estudios','high','♢')}</div></article>
      <article class="home-card not-working"><div class="home-title"><h2>¿Qué NO está funcionando?</h2><button>Ver todas →</button></div>${failure('Campañas aisladas sin continuidad','Sin impacto medible a mediano plazo. · 12 estudios lo confirman')}${failure('Charlas únicas en instituciones educativas','No generan cambios sostenidos. · 9 evaluaciones lo demuestran')}${failure('Controles parentales sin acompañamiento','Pueden generar falsa sensación de seguridad. · 7 estudios lo evidencian')}${failure('Formación sin evaluación','Sin medición, no hay mejora. · 11 estudios lo confirman')}</article>
      <article class="home-card live-panel"><div class="home-title"><h2>Observatorio en tiempo real</h2><button data-page="observatory">Ver todas →</button></div>${liveItem('Hace 2 horas','UNESCO publica nueva guía sobre IA y protección infantil','blue')}${liveItem('Hace 5 horas','Australia actualiza su estrategia nacional de bienestar digital','green')}${liveItem('Ayer','Nueva revisión sistemática sobre salud mental y redes sociales','lime')}${liveItem('Hace 2 días','Finlandia incorpora inteligencia artificial responsable en educación','green')}${liveItem('Hace 3 días','UNICEF lanza marco global para entornos digitales seguros','red')}</article>
    </section>
    <section class="lower-layout"><article class="home-card package-panel"><div class="home-title"><h2>Knowledge Packages recientes</h2><button data-page="packages">Ver todos →</button></div><div class="package-grid">${packageMini('Salud mental y redes sociales en adolescentes','Mayo 2026')}${packageMini('Regulación de plataformas y protección infantil','Mayo 2026')}${packageMini('Educación digital integral en entornos escolares','Abril 2026')}${packageMini('Inteligencia artificial y derechos de infancia','Abril 2026')}</div></article><article class="home-card org-panel"><div class="home-title"><h2>Organizaciones monitoreadas</h2><button>Ver todas →</button></div><div class="org-grid"><b>UNESCO</b><b>unicef</b><b>WHO</b><b>OECD</b><b>European Commission</b><b>WeProtect</b><b>ECPAT</b><b>ITU</b></div></article><article class="newsletter"><div><h2>Recibe lo más importante</h2><p>Boletín semanal con evidencia, análisis y recomendaciones clave.</p></div><form id="newsletterForm"><input type="email" aria-label="Correo electrónico" placeholder="Tu correo electrónico"><button>Suscribirme</button></form></article></section>
    `,
  observatory: () => `
    <section class="page-header"><div><p class="eyebrow">Observatorio global</p><h1>Riesgos y respuesta digital</h1><p>Monitoreo comparado en tiempo casi real de 193 países y 648 indicadores.</p></div><div class="header-actions"><button class="ghost-button">Exportar ↓</button><button class="primary-button">+ Crear alerta</button></div></section>
    <div class="filter-strip"><button class="filter-button active">Vista global</button><button class="filter-button">Región ⌄</button><button class="filter-button">Tema ⌄</button><button class="filter-button">2020—2026 ⌄</button><button class="filter-button">Nivel de evidencia ⌄</button></div>
    <section class="grid kpi-grid">${kpi('Índice global','67.4','+2.1 vs. 2025','◎')}${kpi('Cobertura de políticas','71%','+6 países','◇')}${kpi('Riesgo emergente','Medio','3 señales críticas','!')}${kpi('Calidad de evidencia','82%','Alta confianza','✓')}</section>
    <section class="grid section-grid"><article class="card map-card"><div class="card-header"><div><h3>Índice de protección digital</h3><p>Selecciona un país para abrir su perfil</p></div><button>Capas ⌄</button></div><div class="map-wrap" style="min-height:360px"><div class="world-map"></div><i class="map-dot d1"></i><i class="map-dot d2"></i><i class="map-dot d3"></i><i class="map-dot d4"></i><i class="map-dot d5"></i><div class="map-legend"><i style="background:#10a37f"></i>70–100 <i style="background:#d99715"></i>40–69 <i style="background:#d94c4c"></i>0–39</div></div></article><article class="card chart-card"><div class="card-header"><div><h3>Evolución del índice</h3><p>Promedio global · 2020—2026</p></div><button>Comparar +</button></div><div class="bar-chart" style="height:330px">${[105,132,146,171,198,228,254].map((v,i)=>`<i class="bar ${i===6?'active':''}" style="height:${v}px" data-label="${2020+i}"></i>`).join('')}</div></article></section>
    <article class="card table-card" style="margin-top:16px"><div class="card-header"><div><h3>Ranking de preparación nacional</h3><p>Indicadores normalizados por disponibilidad de datos</p></div><button>Metodología ↗</button></div><div class="table-toolbar"><input id="countrySearch" placeholder="Buscar país…"><button class="filter-button">Región ⌄</button></div>${countryTable()}</article>`,
  researcher: () => `
    <section class="page-header researcher-header">
      <div>
        <p class="eyebrow">Investigador IA</p>
        <h1>Workspace de investigación</h1>
        <p>Organiza proyectos, incorpora evidencia y consulta la inteligencia de NINIA desde un único espacio.</p>
      </div>
      <div class="header-actions">
        <button class="ghost-button" id="exportResearch">Exportar resumen ↓</button>
        <button class="primary-button" id="newResearchBtn">＋ Nueva investigación</button>
      </div>
    </section>

    <section class="research-workspace">
      <div class="research-kpis">
        <article><span>Proyectos activos</span><strong id="researchCount">0</strong><small>En este dispositivo</small></article>
        <article><span>Evidencias cargadas</span><strong id="evidenceCount">0</strong><small>Estado preliminar</small></article>
        <article><span>En validación</span><strong id="validationCount">0</strong><small>Revisión humana requerida</small></article>
        <article><span>Conocimiento aprobado</span><strong>0</strong><small>Conexión con NINIA-AI pendiente</small></article>
      </div>

      <div class="research-main-grid">
        <article class="workspace-card-panel">
          <div class="workspace-title-row">
            <div><p class="eyebrow">CAP-001</p><h2>Mis investigaciones</h2></div>
            <button class="text-button" id="newResearchInline">＋ Crear proyecto</button>
          </div>
          <div id="researchProjects" class="research-projects"></div>
        </article>

        <aside class="workspace-side-panel">
          <article class="workspace-card-panel compact">
            <p class="eyebrow">Admisión de evidencia</p>
            <h2>Solicitar incorporación</h2>
            <p>Ningún documento entra directamente al conocimiento. Primero pasa por cuarentena, validación automática y revisión humana.</p>
            <button class="primary-button full" id="evidenceAdmissionBtn">Iniciar solicitud</button>
            <div class="admission-flow">
              <span>CUARENTENA</span><i>→</i><span>EN VALIDACIÓN</span><i>→</i><span>APROBADO / RECHAZADO</span>
            </div>
            <div id="evidenceStatus" class="evidence-status">Aún no hay solicitudes registradas.</div>
          </article>

          <article class="workspace-card-panel compact">
            <p class="eyebrow">Estado del sistema</p>
            <div class="system-check"><span class="ok-dot"></span><div><b>Frontend operativo</b><small>Desplegado en Vercel</small></div></div>
            <div class="system-check"><span class="warn-dot"></span><div><b>NINIA-AI pendiente de conexión</b><small>La interfaz está preparada para la API</small></div></div>
            <div class="system-check"><span class="warn-dot"></span><div><b>Knowledge Base local</b><small>Se activará en la siguiente integración</small></div></div>
          </article>
        </aside>
      </div>

      <article class="workspace-card-panel ai-research-panel">
        <div class="workspace-title-row">
          <div><p class="eyebrow">Consulta inteligente</p><h2>Investiga con NINIA</h2></div>
          <button class="ghost-button" id="newChat">Nueva conversación</button>
        </div>
        <div class="researcher-layout embedded">
          <div class="chat-main">
            <div class="chat-intro" id="chatIntro">
              <div class="ai-badge">✦</div>
              <h2>Consulta la evidencia de NINIA</h2>
              <p>Las respuestas deberán basarse en conocimiento validado y citar fuentes primarias.</p>
              <div class="suggestions">
                <button>¿Qué políticas reducen el acoso digital escolar?</button>
                <button>Compara la regulación de edad en UE y LATAM</button>
                <button>Resume la evidencia sobre redes sociales y sueño</button>
                <button>Identifica vacíos de investigación en IA generativa</button>
              </div>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <form class="chat-composer" id="chatForm">
              <input id="chatInput" placeholder="Haz una pregunta de investigación…" autocomplete="off">
              <button aria-label="Enviar">↑</button>
            </form>
          </div>
          <aside class="source-panel">
            <h3>Fuentes y contexto</h3>
            <div id="sourceList"><div class="empty-source">Las fuentes citadas aparecerán aquí.</div></div>
          </aside>
        </div>
      </article>
    </section>

    <dialog id="evidenceAdmissionDialog" class="research-dialog evidence-dialog">
      <form method="dialog" id="evidenceAdmissionForm">
        <div class="dialog-head">
          <div><p class="eyebrow">Filtro de admisión</p><h2>Solicitar incorporación de evidencia</h2></div>
          <button value="cancel" aria-label="Cerrar">×</button>
        </div>
        <div class="admission-alert">La solicitud quedará en <b>CUARENTENA</b>. No alimentará la Biblioteca, el RAG ni el Observatorio hasta aprobación humana.</div>
        <label>Documento<input name="file" id="evidenceFile" type="file" accept=".pdf,.docx,.txt" required></label>
        <div class="form-grid-two">
          <label>Título<input name="title" required maxlength="180" placeholder="Título completo del documento"></label>
          <label>Año<input name="year" type="number" min="1900" max="2100" required></label>
        </div>
        <div class="form-grid-two">
          <label>Autor o entidad<input name="author" required placeholder="Autor, universidad u organización"></label>
          <label>Tipo de documento<select name="documentType" required>
            <option value="">Selecciona</option><option>Artículo científico</option><option>Informe institucional</option><option>Tesis</option><option>Normativa</option><option>Dataset</option><option>Otro</option>
          </select></label>
        </div>
        <label>Fuente o revista<input name="source" required placeholder="Revista, repositorio, organismo o editorial"></label>
        <label>URL o DOI<input name="url" type="url" placeholder="https://..."></label>
        <label>Relación con NINIA<textarea name="relation" required rows="3" placeholder="Explica por qué esta evidencia es relevante para la protección de NNA en entornos digitales"></textarea></label>
        <label class="consent-check"><input name="declaration" type="checkbox" required> Declaro que la información es auténtica, trazable y no ha sido manipulada.</label>
        <div class="dialog-actions">
          <button value="cancel" class="ghost-button">Cancelar</button>
          <button value="default" class="primary-button" id="submitEvidenceAdmission">Enviar a cuarentena</button>
        </div>
      </form>
    </dialog>

    <dialog id="researchDialog" class="research-dialog">
      <form method="dialog" id="researchForm">
        <div class="dialog-head"><div><p class="eyebrow">Nueva investigación</p><h2>Crear proyecto</h2></div><button value="cancel" aria-label="Cerrar">×</button></div>
        <label>Título<input name="title" required maxlength="120" placeholder="Ej. IA generativa y adolescencia"></label>
        <label>Pregunta de investigación<textarea name="question" required rows="4" placeholder="¿Qué quieres investigar?"></textarea></label>
        <label>Área temática<select name="topic"><option>IA generativa</option><option>Privacidad infantil</option><option>Desinformación</option><option>Plataformas digitales</option><option>AMI</option><option>Otro</option></select></label>
        <div class="dialog-actions"><button value="cancel" class="ghost-button">Cancelar</button><button value="default" class="primary-button" id="saveResearch">Crear investigación</button></div>
      </form>
    </dialog>`,
  library: () => `
    <section class="page-header"><div><p class="eyebrow">Biblioteca de evidencia</p><h1>12.486 documentos indexados</h1><p>Investigación académica, políticas públicas y datos globales, clasificados por IA y revisados con criterios transparentes.</p><div class="library-stats"><span><b>87%</b> texto completo</span><span><b>64</b> idiomas</span><span><b>1.240</b> organizaciones</span></div></div><button class="primary-button">＋ Añadir fuente</button></section>
    <div class="filter-strip"><button class="filter-button active">Toda la evidencia</button><button class="filter-button">País ⌄</button><button class="filter-button">Tema ⌄</button><button class="filter-button">Tipo de estudio ⌄</button><button class="filter-button">Evidencia ⌄</button><button class="filter-button">Fecha ⌄</button></div>
    <div class="table-toolbar card" style="padding:10px;margin-bottom:16px"><input id="paperSearch" placeholder="Buscar por título, autor, organización o palabra clave…"><button class="filter-button">Más filtros ≡</button></div>
    <section class="library-grid" id="paperGrid">${paperCards()}</section>`,
};

const labels={operations:['Centro de Operaciones','Misiones, corpus, entrenamiento y actividad de NINIA en tiempo real.','◉',['Estado operativo','Misiones controladas','Training gate']],compare:['Comparador','Compara políticas, programas, países e investigaciones en una misma vista.','⇄',['País vs. país','Indicadores alineados','Exportación ejecutiva']],trends:['Tendencias y prospectiva','Modelos predictivos, series de tiempo y alertas tempranas con trazabilidad.','⌁',['Señales emergentes','Escenarios futuros','Modelos predictivos']],media:['Media Intelligence','Monitoreo internacional de noticias, redes, podcasts, video y desinformación.','◫',['Sentimiento global','Narrativas coordinadas','Mapa de cobertura']],packages:['Knowledge Packages','Productos de conocimiento listos para la decisión, con evidencia, casos y recomendaciones.','◇',['Resumen ejecutivo','Recomendaciones','Bibliografía trazable']],studio:['AI Studio','Laboratorio para modelos, clasificadores, embeddings, OCR y pipelines RAG.','⌘',['Registro de modelos','Estado de pipelines','Evaluaciones']],academy:['NINIA Academy','Formación especializada para investigadores, reguladores y responsables de políticas.','△',['Rutas de aprendizaje','Microlearning','Certificaciones']]};
Object.entries(labels).forEach(([key,v])=>pages[key]=()=>`<section class="page-header"><div><p class="eyebrow">NINIA PLATFORM</p><h1>${v[0]}</h1><p>${v[1]}</p></div><button class="primary-button">Crear nuevo +</button></section><section class="skeleton-page card"><div class="skeleton-icon">${v[2]}</div><h2>${v[0]}</h2><p>${v[1]} Este módulo forma parte del mismo sistema de inteligencia y conserva navegación, filtros, fuentes y asistente contextual.</p><div class="skeleton-modules">${v[3].map(x=>`<span>${x} →</span>`).join('')}</div></section>`);

function kpi(label,value,trend,icon){return `<article class="card kpi-card"><div class="kpi-head"><span>${label}</span><i class="kpi-icon">${icon}</i></div><div class="kpi-value">${value}</div><span class="trend-up">${trend}</span></article>`}
function impact(icon,value,label,link,color){return `<article class="impact-item"><i class="impact-icon ${color}">${icon}</i><div><b>${value}</b><span>${label}</span><button>${link}</button></div></article>`}
function practice(title,meta,level,icon){return `<div class="practice"><div class="practice-image p-${icon.charCodeAt(0)%4}"><span>★★★★★</span><i>${icon}</i></div><h3>${title}</h3><p>${meta}</p><em class="evidence ${level==='high'?'high':'medium'}">Evidencia ${level==='high'?'alta':'media'}</em></div>`}
function failure(title,desc){return `<div class="failure"><i>×</i><div><h3>${title}</h3><p>${desc}</p></div></div>`}
function liveItem(time,title,color){return `<div class="live-item"><i class="${color}"></i><div><small>${time}</small><h3>${title}</h3></div></div>`}
function packageMini(title,date){return `<div class="package-mini"><h3>${title}</h3><p>▣ ${date} <b>★★★★★</b> <em>Nuevo</em></p><button>Explorar →</button></div>`}
function researchItems(){return [['Diseño seguro por edad: una revisión sistemática','UNICEF Innocenti · 2026','Alta'],['Adolescentes e IA generativa: oportunidades y riesgos','Nature Human Behaviour · 2026','Alta'],['Efectividad de controles parentales en plataformas','OECD Digital Economy · 2025','Media']].map(x=>`<div class="research-item"><span class="doc-icon">▤</span><div><h4>${x[0]}</h4><span class="meta">${x[1]}</span></div><span class="evidence ${x[2]==='Alta'?'high':'medium'}">${x[2]}</span></div>`).join('')}
function alertItem(t,d,time){return `<div class="alert-item"><span class="alert-symbol">!</span><div><h4>${t}</h4><p>${d}</p></div><span class="alert-time">${time}</span></div>`}
function countryTable(){const rows=[['1','Finlandia','92.4','↑ 2','Europa'],['2','Suecia','90.8','—','Europa'],['3','Canadá','89.7','↑ 1','Norteamérica'],['4','Australia','88.9','↓ 1','Oceanía'],['5','Uruguay','84.2','↑ 4','Latinoamérica']];return `<table><thead><tr><th>Pos.</th><th>País</th><th>Índice</th><th>Cambio</th><th>Región</th><th>Evidencia</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${r[0]}</td><td><span class="country"><i class="flag"></i>${r[1]}</span></td><td class="score">${r[2]}</td><td class="${r[3].includes('↑')?'rank-up':r[3].includes('↓')?'rank-down':''}">${r[3]}</td><td>${r[4]}</td><td><span class="evidence high">Alta</span></td></tr>`).join('')}</tbody></table>`}
function paperCards(){return [['Revisión sistemática','Safety by design for children: global evidence review','UNICEF Innocenti','Analiza 84 intervenciones de diseño y sus efectos sobre exposición, privacidad y bienestar.','Alta'],['Estudio longitudinal','Social media, sleep and adolescent wellbeing','Nature Human Behaviour','Seguimiento de 6.400 adolescentes durante cuatro años en siete países.','Alta'],['Policy brief','Age assurance: regulatory approaches in 32 countries','OECD','Comparación de modelos regulatorios, implementación y garantías de privacidad.','Media'],['Meta-análisis','Cyberbullying prevention in school settings','JAMA Pediatrics','Efectividad comparada de programas escolares en 18 sistemas educativos.','Alta'],['Datos','Global Kids Online: 2026 indicators','UNICEF · LSE','Indicadores armonizados de acceso, habilidades, oportunidades y riesgos digitales.','Alta'],['Working paper','Generative AI companions and minors','MIT Media Lab','Señales emergentes sobre dependencia, confianza y antropomorfización.','Baja']].map((x,i)=>`<article class="card paper-card"><div class="paper-top"><span class="paper-type">${x[0]}</span><button class="save-button" aria-label="Guardar investigación">♡</button></div><h3>${x[1]}</h3><p>${x[3]}</p><div class="paper-footer"><span class="meta">${x[2]} · 2026</span><span class="evidence ${x[4]==='Alta'?'high':x[4]==='Media'?'medium':'low'}">${x[4]}</span></div></article>`).join('')}

const content=document.getElementById('pageContent');
function navigate(page){page=pages[page]?page:'overview';content.innerHTML=pages[page]();document.querySelectorAll('.public-nav [data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===page));document.getElementById('sidebar').classList.remove('open');window.location.hash=page;window.scrollTo(0,0);bindPageEvents(page)}
function bindPageEvents(page){content.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>navigate(b.dataset.page));content.querySelectorAll('.filter-button').forEach(b=>b.onclick=()=>{b.classList.toggle('active');showToast(b.classList.contains('active')?'Filtro aplicado':'Filtro eliminado')});content.querySelectorAll('.save-button').forEach(b=>b.onclick=()=>{b.textContent=b.textContent==='♡'?'♥':'♡';showToast(b.textContent==='♥'?'Guardado en favoritos':'Eliminado de favoritos')});if(page==='overview'){document.getElementById('heroSearch').onsubmit=e=>{e.preventDefault();const q=e.target.querySelector('input').value.trim();navigate('researcher');if(q){document.getElementById('chatInput').value=q;sendChat(q)}};document.getElementById('newsletterForm').onsubmit=e=>{e.preventDefault();showToast('Gracias. Revisa tu correo para confirmar la suscripción');e.target.reset()}}if(page==='researcher'){bindResearcherWorkspace();bindChat();}if(page==='library'){document.getElementById('paperSearch').oninput=e=>filterCards(e.target.value)}if(page==='observatory'){document.getElementById('countrySearch').oninput=e=>{document.querySelectorAll('tbody tr').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(e.target.value.toLowerCase()))}}}

const RESEARCH_STORAGE_KEY='ninia_research_projects_v1';
const EVIDENCE_STORAGE_KEY='ninia_evidence_requests_v2';

function getResearchProjects(){
  try{return JSON.parse(localStorage.getItem(RESEARCH_STORAGE_KEY)||'[]')}catch{return []}
}
function saveResearchProjects(items){
  localStorage.setItem(RESEARCH_STORAGE_KEY,JSON.stringify(items));
}
function bindResearcherWorkspace(){
  const dialog=document.getElementById('researchDialog');
  const form=document.getElementById('researchForm');
  const openDialog=()=>dialog&&dialog.showModal();
  document.getElementById('newResearchBtn').onclick=openDialog;
  document.getElementById('newResearchInline').onclick=openDialog;
  document.getElementById('exportResearch').onclick=()=>showToast('Resumen de investigaciones preparado');
  form.onsubmit=e=>{
    e.preventDefault();
    const data=new FormData(form);
    const projects=getResearchProjects();
    projects.unshift({
      id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
      title:data.get('title').trim(),
      question:data.get('question').trim(),
      topic:data.get('topic'),
      status:'Borrador',
      createdAt:new Date().toISOString()
    });
    saveResearchProjects(projects);
    form.reset();
    dialog.close();
    renderResearchProjects();
    showToast('Investigación creada');
  };
  const admissionDialog=document.getElementById('evidenceAdmissionDialog');
  const admissionForm=document.getElementById('evidenceAdmissionForm');
  document.getElementById('evidenceAdmissionBtn').onclick=()=>admissionDialog.showModal();
  admissionForm.onsubmit=e=>{
    e.preventDefault();
    const data=new FormData(admissionForm);
    const file=data.get('file');
    if(!file||!file.name){showToast('Selecciona un documento');return}
    const allowed=['pdf','docx','txt'];
    const ext=file.name.split('.').pop().toLowerCase();
    if(!allowed.includes(ext)){showToast('Formato no permitido');return}
    const requests=getEvidenceRequests();
    const duplicate=requests.some(item=>item.fileName===file.name&&item.fileSize===file.size);
    if(duplicate){showToast('Posible duplicado detectado');return}
    requests.unshift({
      id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
      fileName:file.name,
      fileSize:file.size,
      title:String(data.get('title')||'').trim(),
      year:String(data.get('year')||'').trim(),
      author:String(data.get('author')||'').trim(),
      documentType:String(data.get('documentType')||'').trim(),
      source:String(data.get('source')||'').trim(),
      url:String(data.get('url')||'').trim(),
      relation:String(data.get('relation')||'').trim(),
      status:'CUARENTENA',
      submittedAt:new Date().toISOString()
    });
    saveEvidenceRequests(requests);
    admissionForm.reset();
    admissionDialog.close();
    renderEvidenceStatus();
    updateResearchKpis();
    showToast('Solicitud enviada a cuarentena');
  };
  renderResearchProjects();
  renderEvidenceStatus();
  updateResearchKpis();
}
function renderResearchProjects(){
  const target=document.getElementById('researchProjects');
  if(!target)return;
  const projects=getResearchProjects();
  if(!projects.length){
    target.innerHTML=`<div class="research-empty"><span>◫</span><h3>Aún no tienes investigaciones</h3><p>Crea tu primer proyecto para organizar preguntas, evidencia y resultados.</p><button class="primary-button" id="emptyCreate">Crear primera investigación</button></div>`;
    document.getElementById('emptyCreate').onclick=()=>document.getElementById('researchDialog').showModal();
    return;
  }
  target.innerHTML=projects.map(item=>`
    <article class="research-project-card">
      <div class="research-project-icon">⌁</div>
      <div>
        <div class="project-meta"><span>${escapeHtml(item.topic)}</span><span>${new Date(item.createdAt).toLocaleDateString('es')}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.question)}</p>
      </div>
      <div class="project-status"><span>${escapeHtml(item.status)}</span><button data-open-project="${item.id}">Abrir →</button></div>
    </article>`).join('');
  target.querySelectorAll('[data-open-project]').forEach(btn=>btn.onclick=()=>showToast('Vista de proyecto preparada para la siguiente versión'));
}
function getEvidenceRequests(){
  try{return JSON.parse(localStorage.getItem(EVIDENCE_STORAGE_KEY)||'[]')}catch{return []}
}
function saveEvidenceRequests(items){
  localStorage.setItem(EVIDENCE_STORAGE_KEY,JSON.stringify(items));
}
function renderEvidenceStatus(){
  const target=document.getElementById('evidenceStatus');
  if(!target)return;
  const requests=getEvidenceRequests();
  if(!requests.length){
    target.textContent='Aún no hay solicitudes registradas.';
    return;
  }
  const item=requests[0];
  target.innerHTML=`<b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.author)} · Estado: ${escapeHtml(item.status)}</small>`;
}

function updateResearchKpis(){
  const projects=getResearchProjects();
  const requests=getEvidenceRequests();
  const evidence=requests.length;
  const validation=requests.filter(item=>item.status==='CUARENTENA'||item.status==='EN VALIDACIÓN').length;
  const count=document.getElementById('researchCount');
  const ecount=document.getElementById('evidenceCount');
  const vcount=document.getElementById('validationCount');
  if(count)count.textContent=projects.length;
  if(ecount)ecount.textContent=evidence;
  if(vcount)vcount.textContent=validation;
}

function bindChat(){document.getElementById('chatForm').onsubmit=e=>{e.preventDefault();sendChat(document.getElementById('chatInput').value)};document.querySelectorAll('.suggestions button').forEach(b=>b.onclick=()=>sendChat(b.textContent));document.getElementById('newChat').onclick=()=>navigate('researcher');document.getElementById('exportChat').onclick=()=>showToast('Conversación preparada para exportar')}
function sendChat(q){if(!q.trim())return;const intro=document.getElementById('chatIntro'),msgs=document.getElementById('chatMessages'),input=document.getElementById('chatInput');intro.style.display='none';msgs.style.display='block';msgs.innerHTML+=`<div class="chat-message user">${escapeHtml(q)}</div><div class="chat-message ai"><strong>✦ NINIA está analizando 12.486 fuentes…</strong><span class="typing">Buscando evidencia relevante, evaluando calidad y contrastando resultados.</span></div>`;input.value='';setTimeout(()=>{const last=msgs.querySelector('.chat-message.ai:last-child');last.innerHTML=`<strong>✦ Síntesis de evidencia</strong>La evidencia disponible indica que las intervenciones más efectivas combinan diseño seguro por defecto, alfabetización digital y mecanismos de reporte accesibles. Los efectos son mayores cuando existe coordinación entre escuelas, familias y plataformas <span class="citation">1</span>.<br><br>La calidad general de la evidencia es <b>moderada-alta</b>: hay consistencia entre revisiones sistemáticas, aunque persisten vacíos en países de ingresos medios y bajos <span class="citation">2</span> <span class="citation">3</span>.`;document.getElementById('sourceList').innerHTML=['UNICEF Innocenti · Evidence review 2026','OECD · Children & Young People Online','Nature Human Behaviour · Longitudinal study'].map((x,i)=>`<div class="source-card"><b>${i+1}. ${x}</b><small>${i===0?'Revisión sistemática':'Investigación primaria'} · Evidencia alta</small></div>`).join('');msgs.scrollTop=msgs.scrollHeight},900)}
function filterCards(q){document.querySelectorAll('.paper-card').forEach(c=>c.hidden=!c.textContent.toLowerCase().includes(q.toLowerCase()))}
function escapeHtml(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
let toastTimer;function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}

document.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigate(el.dataset.page)}));
document.getElementById('menuBtn').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
document.getElementById('aiOrb').onclick=()=>navigate('researcher');
document.getElementById('footerNewsletter').onsubmit=e=>{e.preventDefault();showToast('Gracias. Revisa tu correo para confirmar la suscripción');e.target.reset()};
const palette=document.getElementById('commandPalette');document.getElementById('commandBtn').onclick=()=>{palette.classList.add('open');palette.setAttribute('aria-hidden','false');setTimeout(()=>document.getElementById('globalSearch').focus(),30)};palette.onclick=e=>{if(e.target===palette)closePalette()};function closePalette(){palette.classList.remove('open');palette.setAttribute('aria-hidden','true')};document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('commandBtn').click()}if(e.key==='Escape')closePalette();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='i'){e.preventDefault();navigate('researcher')}});document.querySelectorAll('.command-box [data-query]').forEach(b=>b.onclick=()=>{closePalette();navigate('researcher');const q=b.dataset.query;document.getElementById('chatInput').value=q;sendChat(q)});document.getElementById('globalSearch').onkeydown=e=>{if(e.key==='Enter'&&e.target.value.trim()){const q=e.target.value;closePalette();navigate('researcher');document.getElementById('chatInput').value=q;sendChat(q)}};
navigate(location.hash.slice(1)||'overview');
