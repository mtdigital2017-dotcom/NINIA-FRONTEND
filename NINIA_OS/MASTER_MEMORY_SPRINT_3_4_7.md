# MASTER MEMORY — SPRINT 3.4.7

## Estado
CORRECCIÓN GLOBAL DE NAVEGACIÓN LISTA PARA PUBLICACIÓN

## Objetivo
Eliminar definitivamente los bloqueos del navegador en Researcher, Media, Operaciones, Biblioteca y Observatorio sin modificar backend, Render ni Vercel.

## Evidencia
- Inicio carga correctamente.
- Backend Render está operativo.
- Los bloqueos aparecen al navegar a módulos dinámicos.
- El problema ocurre también en incógnito.
- Chrome muestra `RESULT_CODE_HUNG` o `La página no responde`.
- Sprint 3.4.6 eliminó correctamente el ciclo local de Operations/Media, pero permanecían observadores globales en otros módulos.

## Causa raíz consolidada
Varios módulos observaban todo `document.body` o `document.documentElement` mediante `MutationObserver`.

Cada navegación ejecutaba este patrón:
1. `app.js` reemplaza `#pageContent`.
2. Uno o más observadores globales detectan el cambio.
3. Los módulos vuelven a modificar el DOM, añadir campos o renderizar contenido.
4. Esas modificaciones activan nuevamente los observadores.
5. Researcher, Biblioteca, Observatorio y módulos compartidos se ejecutan repetidamente.
6. El hilo principal del navegador queda saturado.

## Solución estructural
Se elimina el uso de observación global como mecanismo de navegación.

`app.js` emite ahora un evento controlado:
`ninia:page-ready`

El evento se dispara solo después de:
- renderizar la página;
- actualizar navegación;
- enlazar los eventos base.

Cada módulo escucha exclusivamente ese evento y solo actúa cuando corresponde a su página.

## Archivos modificados
- `app.js`
- `ninia-knowledge-adapter.js`
- `ninia-api-bridge.js`
- `ninia-researcher-upload.js`
- `ninia-global-observatory.js`
- `ninia-operations-media.js`
- `NINIA_OS/MASTER_MEMORY_SPRINT_3_4_7.md`

## Comportamiento conservado
- Navegación por hash.
- Researcher y carga documental.
- Biblioteca y búsqueda.
- Operaciones y Media.
- Observatorio global.
- Actualización periódica de Operaciones cada 5 segundos.
- Actualización del Observatorio cada 10 segundos.
- Backend Render como API principal.

## QA ejecutado
- Validación de sintaxis con `node --check` para todos los archivos modificados.
- Confirmación de ausencia de `new MutationObserver` en el frontend.
- Confirmación de existencia de un único evento `ninia:page-ready` emitido por `app.js`.
- Confirmación de listeners controlados por módulo.
- Confirmación de conservación de temporizadores operativos existentes.
- Backend no se vuelve a probar porque ya está validado en producción.

## Regla permanente
Los módulos del frontend no deben observar globalmente el DOM para detectar navegación.
Toda inicialización de página debe ejecutarse mediante eventos explícitos y controlados.

## Commit oficial
`Sprint 3.4.7: estabilizar navegación global y eliminar ciclos DOM`

## Resultado esperado
- Researcher carga sin bloquear Chrome.
- Operaciones carga sin bloquear Chrome.
- Media carga sin bloquear Chrome.
- Biblioteca y Observatorio funcionan sin ciclos de renderizado.
- El equipo no vuelve a entrar en un ciclo de parches por módulo.

## Siguiente paso
Aplicar este único instalador, publicar un único commit, esperar el redeploy de Vercel y validar Researcher, Operations, Media, Library y Observatory.
