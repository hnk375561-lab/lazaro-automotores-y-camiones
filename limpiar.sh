#!/bin/sh
# Ejecutar desde la raíz del repo. Borra solo archivos que ninguna página carga.
set -e
# CSS vacíos (~260 bytes) y CSS que ninguna página carga
cd css
rm -f comparador.css donde.css header-tint.css horarios.css horizonte-perf.css horizonte-perf2.css \
  horizonte-v54.css horizonte-v55.css horizonte-v56.css horizonte-v57.css horizonte-v58.css horizonte-v59.css \
  horizonte-v60.css horizonte-v61.css horizonte-v62.css horizonte-v63.css horizonte-v66.css horizonte-v67.css \
  quieto.css resenas-compra.css secciones.css site.css identidad.css lugar.css motion.css reserva.css
cd ..
# JS que ninguna página carga
cd js
rm -f app.js clips.js fondos.js header-tint.js horizonte-v58.js identidad.js lugar.js motion.js \
  perf-diag.js recorrido.js reserva-embed.js reserva.js
rm -rf motion
rm -f vendor/gsap-stack.js
cd ..
# Tipografías e imagen sin uso (las usadas son Bricolage Grotesque e Instrument Sans)
rm -f fonts/cormorant-garamond-latin-400.woff2 fonts/dm-serif-display-latin.woff2 fonts/inter-latin-var.woff2 images/logo-sm.png
# Notas internas de investigación y lista de borrado
rm -f expediente_maestro_final_lazaro_automotores.txt lazaro_auditoria_total_cobertura_osint.txt \
  INFORME_OSINT_4_3_4_4_EJECUCION_2026-10-14.txt ELIMINAR.txt
echo "Limpieza lista."
