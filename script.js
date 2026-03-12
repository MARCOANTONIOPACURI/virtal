// ============================================================
// DESAFÍO ACADÉMICO - LÓGICA PRINCIPAL
// script.js
// ============================================================

// ============ ESTADO GLOBAL DEL JUEGO ============
const Estado = {
  gruposData: {},
  estudiante: { nombre: "", grupo: null, horaIngreso: "" },
  quiz: {
    mundoActual: "",
    preguntaActual: 0,
    respuestas: [],       // true/false por cada pregunta
    elegidas: [],         // índice de opción elegida por el estudiante
    correctas: 0,
    incorrectas: 0,
    iniciado: false
  }
};

// ============ INICIALIZACIÓN ============
document.addEventListener("DOMContentLoaded", () => {
  cargarGrupos();
  mostrarPantalla("pantalla-bienvenida");
  crearParticulas();
});

// ============ SISTEMA DE PANTALLAS ============
function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  const pantalla = document.getElementById(id);
  if (pantalla) {
    pantalla.classList.add("activa");
    pantalla.style.animation = "none";
    requestAnimationFrame(() => { pantalla.style.animation = ""; });
  }
}

// ============ PARTÍCULAS ============
function crearParticulas() {
  const contenedor = document.getElementById("particulas");
  if (!contenedor) return;
  const emojis = ["⭐","✨","🌟","💫","🎮","🎯","📚","🔢","🌍","🏆"];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "particula";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + "%";
    p.style.top  = Math.random() * 100 + "%";
    p.style.animationDelay    = Math.random() * 5 + "s";
    p.style.animationDuration = (3 + Math.random() * 4) + "s";
    p.style.fontSize = (12 + Math.random() * 16) + "px";
    contenedor.appendChild(p);
  }
}

// ============ GRUPOS ============
function cargarGrupos() {
  const guardado = localStorage.getItem("desafio_grupos");
  if (guardado) {
    Estado.gruposData = JSON.parse(guardado);
  } else {
    Estado.gruposData = {};
  }
  // Siempre asegurar que todos los grupos existan como array
  for (let i = 1; i <= CONFIG.NUM_GRUPOS; i++) {
    const key = `grupo${i}`;
    if (!Array.isArray(Estado.gruposData[key])) {
      Estado.gruposData[key] = [];
    }
  }
  guardarGrupos();
}

function guardarGrupos() {
  localStorage.setItem("desafio_grupos", JSON.stringify(Estado.gruposData));
}

function contarEstudiantes(numGrupo) {
  const arr = Estado.gruposData[`grupo${numGrupo}`];
  return Array.isArray(arr) ? arr.length : 0;
}

// ============ PANTALLA: SELECCIÓN DE GRUPO ============
function mostrarSeleccionGrupo() {
  // Recargar siempre desde localStorage para tener el conteo actualizado
  cargarGrupos();
  mostrarPantalla("pantalla-grupos");
  renderizarGrupos();
}

function renderizarGrupos() {
  const contenedor = document.getElementById("contenedor-grupos");
  contenedor.innerHTML = "";
  const colores    = ["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7"];
  const emojisGrupo= ["🦁","🦊","🐯","🦅","🐉"];

  for (let i = 1; i <= CONFIG.NUM_GRUPOS; i++) {
    // Leer directamente del objeto actualizado
    const key      = `grupo${i}`;
    const arr      = Array.isArray(Estado.gruposData[key]) ? Estado.gruposData[key] : [];
    const cantidad = arr.length;
    const lleno    = cantidad >= CONFIG.MAX_ESTUDIANTES_POR_GRUPO;
    const porcentaje = Math.round((cantidad / CONFIG.MAX_ESTUDIANTES_POR_GRUPO) * 100);

    const tarjeta = document.createElement("div");
    tarjeta.className = `tarjeta-grupo ${lleno ? "lleno" : ""}`;
    tarjeta.style.borderColor = colores[i - 1];
    tarjeta.innerHTML = `
      <div class="grupo-emoji">${emojisGrupo[i - 1]}</div>
      <h3 class="grupo-nombre">GRUPO ${i}</h3>
      <div class="grupo-count">${cantidad} / ${CONFIG.MAX_ESTUDIANTES_POR_GRUPO}</div>
      <div class="barra-progreso-container">
        <div class="barra-progreso-fill" style="width:${porcentaje}%;background:${colores[i-1]}"></div>
      </div>
      ${lleno
        ? '<div class="grupo-lleno-badge">🔒 GRUPO LLENO</div>'
        : `<button class="btn-seleccionar-grupo" style="background:${colores[i-1]}" onclick="seleccionarGrupo(${i})">Unirme</button>`}
    `;
    contenedor.appendChild(tarjeta);
  }
}

function seleccionarGrupo(n) {
  Estado.estudiante.grupo = n;
  mostrarRegistro();
}

// ============ PANTALLA: REGISTRO ============
function mostrarRegistro() {
  mostrarPantalla("pantalla-registro");
  document.getElementById("grupo-seleccionado-label").textContent = `Grupo ${Estado.estudiante.grupo}`;
  document.getElementById("input-nombre").value = "";
  document.getElementById("input-nombre").focus();
}

function registrarEstudiante() {
  const nombre = document.getElementById("input-nombre").value.trim();
  if (!nombre || nombre.length < 2) { mostrarError("Por favor ingresa tu nombre 😊"); return; }

  Estado.estudiante.nombre      = nombre;
  Estado.estudiante.horaIngreso = new Date().toLocaleString("es-PE");

  const key = `grupo${Estado.estudiante.grupo}`;
  if (!Estado.gruposData[key]) Estado.gruposData[key] = [];
  if (Estado.gruposData[key].length >= CONFIG.MAX_ESTUDIANTES_POR_GRUPO) {
    mostrarError("¡Este grupo ya está lleno! Elige otro."); return;
  }

  // Releer localStorage en el momento exacto de guardar
  // para no sobreescribir registros de otros estudiantes
  const dataFresca = localStorage.getItem("desafio_grupos");
  if (dataFresca) {
    const parsed = JSON.parse(dataFresca);
    if (Array.isArray(parsed[key])) {
      Estado.gruposData[key] = parsed[key];
    }
  }
  // Verificar de nuevo que no esté lleno tras releer
  if (Estado.gruposData[key].length >= CONFIG.MAX_ESTUDIANTES_POR_GRUPO) {
    mostrarError("¡Este grupo se llenó justo ahora! Elige otro."); return;
  }
  Estado.gruposData[key].push({ nombre, hora: Estado.estudiante.horaIngreso });
  guardarGrupos();
  mostrarMenuMundos();
}

function mostrarError(msg) {
  const el = document.getElementById("error-registro");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const inp = document.getElementById("input-nombre");
    if (inp) inp.addEventListener("keypress", e => { if (e.key === "Enter") registrarEstudiante(); });
  }, 500);
});

// ============ PANTALLA: MUNDOS ============
function mostrarMenuMundos() {
  mostrarPantalla("pantalla-mundos");
  document.getElementById("bienvenida-nombre").textContent = `¡Hola, ${Estado.estudiante.nombre}! 👋`;
}

function seleccionarMundo(mundo) {
  if (mundo === "numeros") iniciarQuiz();
  else if (mundo === "letras") iniciarQuizLetras();
  else mostrarProximamente(mundo);
}

function mostrarProximamente(mundo) {
  const nombres = { ciencias: "CIENCIAS", letras: "LETRAS" };
  const banner = document.getElementById("banner-proximamente");
  document.getElementById("texto-proximamente").textContent = `🚀 El mundo de ${nombres[mundo]} estará disponible pronto`;
  banner.style.display = "block";
  setTimeout(() => banner.style.display = "none", 3000);
}

// ============ QUIZ ============
function iniciarQuiz() {
  // Mezcla las opciones de cada pregunta antes de empezar
  PREGUNTAS = prepararPreguntas(PREGUNTAS_BASE);
  Estado.quiz = {
    mundoActual: "numeros",
    preguntaActual: 0,
    respuestas: [],
    elegidas: [],
    correctas: 0,
    incorrectas: 0,
    iniciado: true
  };
  mostrarPantalla("pantalla-quiz");
  mostrarPregunta();
}

function mostrarPregunta() {
  const idx      = Estado.quiz.preguntaActual;
  const pregunta = PREGUNTAS[idx];
  const total    = PREGUNTAS.length;
  const pct      = Math.round((idx / total) * 100);

  document.getElementById("progreso-texto").textContent      = `Pregunta ${idx + 1} de ${total}`;
  document.getElementById("progreso-porcentaje").textContent = `${pct}%`;
  document.getElementById("barra-quiz-fill").style.width     = `${pct}%`;

  // Badge de nivel
  const nivelBadge = document.getElementById("nivel-badge");
  if (nivelBadge && pregunta.nivel) nivelBadge.textContent = pregunta.nivel;

  // Animación de entrada
  const contenedor = document.getElementById("contenedor-pregunta");
  contenedor.style.opacity   = "0";
  contenedor.style.transform = "translateX(30px)";

  setTimeout(() => {
    document.getElementById("texto-pregunta").innerHTML = `<span style="opacity:0.5;font-size:0.85em">${idx + 1}.</span> ${pregunta.pregunta.replace(/\n/g, "<br>")}`;

    const opcionesContainer = document.getElementById("contenedor-opciones");
    opcionesContainer.innerHTML = "";
    const letras = ["A","B","C","D"];
    pregunta.opciones.forEach((opcion, i) => {
      const btn = document.createElement("button");
      btn.className = "btn-opcion";
      btn.innerHTML = `<span class="opcion-letra">${letras[i]}</span><span class="opcion-texto">${opcion}</span>`;
      btn.onclick = () => responderPregunta(i, btn);
      opcionesContainer.appendChild(btn);
    });

    contenedor.style.transition = "all 0.4s ease";
    contenedor.style.opacity    = "1";
    contenedor.style.transform  = "translateX(0)";
  }, 200);
}

function responderPregunta(indiceElegido, btnElegido) {
  const idx       = Estado.quiz.preguntaActual;
  const pregunta  = PREGUNTAS[idx];
  const esCorrecta= indiceElegido === pregunta.respuesta;

  Estado.quiz.respuestas.push(esCorrecta);
  Estado.quiz.elegidas.push(indiceElegido);   // guardamos qué eligió
  if (esCorrecta) Estado.quiz.correctas++;
  else            Estado.quiz.incorrectas++;

  const botones = document.querySelectorAll(".btn-opcion");
  botones.forEach(btn => btn.disabled = true);

  btnElegido.classList.add(esCorrecta ? "correcto" : "incorrecto");
  if (!esCorrecta) botones[pregunta.respuesta].classList.add("correcto");

  const feedback = document.getElementById("feedback-respuesta");
  feedback.textContent = esCorrecta ? "✅ ¡Correcto!" : "❌ ¡Incorrecto!";
  feedback.className = `feedback ${esCorrecta ? "feedback-correcto" : "feedback-incorrecto"}`;
  feedback.style.display = "block";

  document.getElementById("marcador-correctas").textContent   = Estado.quiz.correctas;
  document.getElementById("marcador-incorrectas").textContent = Estado.quiz.incorrectas;

  setTimeout(() => {
    feedback.style.display = "none";
    Estado.quiz.preguntaActual++;
    if (Estado.quiz.preguntaActual < PREGUNTAS.length) mostrarPregunta();
    else mostrarResultados();
  }, 1500);
}

// ============ RESULTADOS FINALES ============
function mostrarResultados() {
  mostrarPantalla("pantalla-resultados");

  const { nombre, grupo }              = Estado.estudiante;
  const { correctas, incorrectas, respuestas, elegidas } = Estado.quiz;
  const total     = PREGUNTAS.length;
  const porcentaje= Math.round((correctas / total) * 100);

  document.getElementById("resultado-nombre").textContent     = nombre;
  document.getElementById("resultado-grupo").textContent      = `Grupo ${grupo}`;
  document.getElementById("resultado-correctas").textContent  = correctas;
  document.getElementById("resultado-incorrectas").textContent= incorrectas;
  document.getElementById("resultado-porcentaje").textContent = `${porcentaje}%`;

  let medalla = "", mensaje = "";
  if (porcentaje >= 90)      { medalla = "🥇"; mensaje = "¡EXCELENTE! Eres un genio matemático 🧠"; }
  else if (porcentaje >= 70) { medalla = "🥈"; mensaje = "¡MUY BIEN! Casi lo logras perfecto 💪"; }
  else if (porcentaje >= 50) { medalla = "🥉"; mensaje = "¡BIEN! Sigue practicando 📚"; }
  else                       { medalla = "💡"; mensaje = "¡Sigue intentando! Puedes mejorar 🔥"; }

  document.getElementById("resultado-medalla").textContent = medalla;
  document.getElementById("resultado-mensaje").textContent = mensaje;

  // ── Resumen rápido (✔ / ✖ por pregunta) ──
  const lista = document.getElementById("lista-detalle");
  lista.innerHTML = "";
  respuestas.forEach((correcto, i) => {
    const item = document.createElement("div");
    item.className = `detalle-item ${correcto ? "detalle-correcto" : "detalle-incorrecto"}`;
    item.innerHTML = `<span>P${i + 1}</span><span>${correcto ? "✔" : "✖"}</span>`;
    lista.appendChild(item);
  });

  // ── RESOLUCIONES ──
  renderizarResoluciones(respuestas, elegidas);

  // Enviar resultados
  enviarResultados();
}

// ──────────────────────────────────────────────
// RENDERIZAR RESOLUCIONES
// ──────────────────────────────────────────────
function renderizarResoluciones(respuestas, elegidas) {
  const contenedor = document.getElementById("contenedor-resoluciones");
  if (!contenedor) return;

  const letras = ["A","B","C","D"];
  let html = "";

  PREGUNTAS.forEach((p, i) => {
    const correcto      = respuestas[i];
    const idxElegida    = elegidas[i];
    const idxCorrecta   = p.respuesta;
    const opcionElegida = p.opciones[idxElegida] ?? "—";
    const opcionCorrec  = p.opciones[idxCorrecta];
    const resolucionFmt = (p.resolucion || "").replace(/\n/g, "<br>");
    const nivelColor    = p.nivel.includes("⭐⭐⭐") ? "#FF6B6B"
                        : p.nivel.includes("⭐⭐")   ? "#4CC9F0"
                        :                              "#43E97B";

    html += `
      <div class="res-card ${correcto ? "res-correcto" : "res-incorrecto"}">
        <div class="res-header">
          <span class="res-num">${i + 1}</span>
          <span class="res-nivel" style="color:${nivelColor}">${p.nivel}</span>
          <span class="res-estado">${correcto ? "✅ Correcto" : "❌ Incorrecto"}</span>
        </div>

        <p class="res-pregunta">${p.pregunta.replace(/\n/g,"<br>")}</p>

        <div class="res-opciones">
          ${!correcto ? `
            <div class="res-opcion res-elegida">
              <span class="res-letra">${letras[idxElegida]}</span>
              Tu respuesta: <strong>${opcionElegida}</strong>
            </div>` : ""}
          <div class="res-opcion res-respuesta-ok">
            <span class="res-letra">${letras[idxCorrecta]}</span>
            Respuesta correcta: <strong>${opcionCorrec}</strong>
          </div>
        </div>

        <details class="res-detalle">
          <summary>📖 Ver resolución paso a paso</summary>
          <div class="res-pasos">${resolucionFmt}</div>
        </details>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}

// ============ ENVIAR A GOOGLE SHEETS ============
async function enviarResultados() {
  const { nombre, grupo, horaIngreso } = Estado.estudiante;
  const { correctas, incorrectas, respuestas } = Estado.quiz;
  const ahora      = new Date();
  const detalleStr = respuestas.map((r, i) => `P${i+1}:${r ? "C" : "I"}`).join("|");

  const datos = {
    nombre, grupo: `Grupo ${grupo}`,
    fecha: ahora.toLocaleDateString("es-PE"),
    hora:  ahora.toLocaleTimeString("es-PE"),
    correctas, incorrectas,
    porcentaje: Math.round((correctas / PREGUNTAS.length) * 100),
    detalle: detalleStr
  };

  const indicador = document.getElementById("estado-envio");
  if (indicador) { indicador.textContent = "📤 Enviando resultados..."; indicador.style.display = "block"; }

  try {
    if (CONFIG.GOOGLE_SCRIPT_URL.includes("TU_ID_AQUI")) throw new Error("no configurado");
    const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    if (res.ok && indicador) { indicador.textContent = "✅ ¡Resultados guardados!"; indicador.className = "estado-envio exito"; }
    else throw new Error("error");
  } catch {
    guardarResultadoLocal(datos);
    if (indicador) { indicador.textContent = "💾 Guardado localmente"; indicador.className = "estado-envio advertencia"; }
  }
}

function guardarResultadoLocal(datos) {
  const h = JSON.parse(localStorage.getItem("desafio_resultados") || "[]");
  h.push({ ...datos, timestamp: Date.now() });
  localStorage.setItem("desafio_resultados", JSON.stringify(h));
}

function volverAlMenu() {
  Estado.quiz = { mundoActual: "", preguntaActual: 0, respuestas: [], elegidas: [], correctas: 0, incorrectas: 0, iniciado: false };
  mostrarMenuMundos();
}

// ============================================================
// MUNDO LETRAS — LÓGICA COMPLETA
// ============================================================

const EstadoLetras = {
  preguntaActual: 0,
  respuestas: [],
  elegidas: [],
  correctas: 0,
  incorrectas: 0,
  visorVisible: true
};

// Arranca el quiz de letras
function iniciarQuizLetras() {
  // Mezcla las opciones de cada pregunta antes de empezar
  PREGUNTAS_LETRAS = prepararPreguntas(PREGUNTAS_LETRAS_BASE);
  EstadoLetras.preguntaActual = 0;
  EstadoLetras.respuestas     = [];
  EstadoLetras.elegidas       = [];
  EstadoLetras.correctas      = 0;
  EstadoLetras.incorrectas    = 0;
  EstadoLetras.visorVisible   = true;
  mostrarPantalla("pantalla-quiz-letras");
  mostrarPreguntaLetras();
}

function mostrarPreguntaLetras() {
  const idx  = EstadoLetras.preguntaActual;
  const p    = PREGUNTAS_LETRAS[idx];
  const total= PREGUNTAS_LETRAS.length;
  const pct  = Math.round((idx / total) * 100);

  // Barra de progreso
  document.getElementById("letras-progreso-texto").textContent = `Pregunta ${idx + 1} de ${total}`;
  document.getElementById("letras-progreso-pct").textContent   = `${pct}%`;
  document.getElementById("letras-barra-fill").style.width     = `${pct}%`;

  // Badges
  document.getElementById("letras-tipo-badge").textContent  = p.tipo;
  const txtBadge = document.getElementById("letras-texto-badge");
  txtBadge.textContent = `📖 Texto ${p.texto}`;
  txtBadge.style.color       = p.texto === 1 ? "#4CC9F0" : "#FF6584";
  txtBadge.style.borderColor = p.texto === 1 ? "rgba(76,201,240,0.3)" : "rgba(255,101,132,0.3)";
  txtBadge.style.background  = p.texto === 1 ? "rgba(76,201,240,0.1)" : "rgba(255,101,132,0.1)";

  // Visor de texto
  const textoObj = p.texto === 1 ? TEXTO1 : TEXTO2;
  const visor    = document.getElementById("letras-visor-texto");
  document.getElementById("letras-visor-titulo").textContent = textoObj.titulo;
  document.getElementById("letras-visor-cuerpo").innerHTML   =
    textoObj.cuerpo.split("\n\n").map(par => `<p>${par.trim()}</p>`).join("");
  visor.style.display = EstadoLetras.visorVisible ? "block" : "none";

  // Animación de pregunta
  const contenedor = document.getElementById("letras-contenedor-pregunta");
  contenedor.style.opacity   = "0";
  contenedor.style.transform = "translateX(30px)";

  setTimeout(() => {
    document.getElementById("letras-texto-pregunta").innerHTML =
      `<span style="opacity:0.5;font-size:0.85em">${idx + 1}.</span> ${p.pregunta}`;

    const opcionesEl = document.getElementById("letras-contenedor-opciones");
    opcionesEl.innerHTML = "";
    const letras = ["A","B","C","D"];
    p.opciones.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "btn-opcion";
      btn.innerHTML = `<span class="opcion-letra">${letras[i]}</span><span class="opcion-texto">${op}</span>`;
      btn.onclick = () => responderPreguntaLetras(i, btn);
      opcionesEl.appendChild(btn);
    });

    contenedor.style.transition = "all 0.4s ease";
    contenedor.style.opacity    = "1";
    contenedor.style.transform  = "translateX(0)";
  }, 200);
}

function responderPreguntaLetras(indiceElegido, btnElegido) {
  const idx       = EstadoLetras.preguntaActual;
  const p         = PREGUNTAS_LETRAS[idx];
  const esCorrecta= indiceElegido === p.respuesta;

  EstadoLetras.respuestas.push(esCorrecta);
  EstadoLetras.elegidas.push(indiceElegido);
  if (esCorrecta) EstadoLetras.correctas++;
  else            EstadoLetras.incorrectas++;

  const botones = document.querySelectorAll("#letras-contenedor-opciones .btn-opcion");
  botones.forEach(b => b.disabled = true);
  btnElegido.classList.add(esCorrecta ? "correcto" : "incorrecto");
  if (!esCorrecta) botones[p.respuesta].classList.add("correcto");

  const fb = document.getElementById("letras-feedback");
  fb.textContent = esCorrecta ? "✅ ¡Correcto!" : "❌ ¡Incorrecto!";
  fb.className   = `feedback ${esCorrecta ? "feedback-correcto" : "feedback-incorrecto"}`;
  fb.style.display = "block";

  document.getElementById("letras-correctas").textContent   = EstadoLetras.correctas;
  document.getElementById("letras-incorrectas").textContent = EstadoLetras.incorrectas;

  setTimeout(() => {
    fb.style.display = "none";
    EstadoLetras.preguntaActual++;
    if (EstadoLetras.preguntaActual < PREGUNTAS_LETRAS.length) mostrarPreguntaLetras();
    else mostrarResultadosLetras();
  }, 1500);
}

// Mostrar/ocultar el visor del texto
function toggleVisor() {
  EstadoLetras.visorVisible = !EstadoLetras.visorVisible;
  const visor = document.getElementById("letras-visor-texto");
  const btn   = visor.querySelector(".visor-toggle");
  visor.style.display = EstadoLetras.visorVisible ? "block" : "none";
  if (btn) btn.textContent = EstadoLetras.visorVisible ? "▲ Ocultar texto" : "▼ Ver texto";
}

// ---- Resultados letras ----
function mostrarResultadosLetras() {
  mostrarPantalla("pantalla-resultados-letras");

  const { nombre, grupo }                         = Estado.estudiante;
  const { correctas, incorrectas, respuestas, elegidas } = EstadoLetras;
  const total     = PREGUNTAS_LETRAS.length;
  const porcentaje= Math.round((correctas / total) * 100);

  document.getElementById("letras-resultado-nombre").textContent    = nombre;
  document.getElementById("letras-resultado-grupo").textContent     = `Grupo ${grupo}`;
  document.getElementById("letras-stat-correctas").textContent      = correctas;
  document.getElementById("letras-stat-incorrectas").textContent    = incorrectas;
  document.getElementById("letras-stat-puntaje").textContent        = `${porcentaje}%`;

  let medalla = "", mensaje = "";
  if (porcentaje >= 90)      { medalla = "🥇"; mensaje = "¡EXCELENTE! Dominas la comunicación 📚"; }
  else if (porcentaje >= 70) { medalla = "🥈"; mensaje = "¡MUY BIEN! Gran comprensión lectora 👏"; }
  else if (porcentaje >= 50) { medalla = "🥉"; mensaje = "¡BIEN! Sigue leyendo y practicando 📖"; }
  else                       { medalla = "💡"; mensaje = "¡Sigue adelante! La lectura te hará crecer 🌱"; }

  document.getElementById("letras-medalla").textContent          = medalla;
  document.getElementById("letras-resultado-mensaje").textContent= mensaje;

  // Resumen rápido ✔/✖
  const lista = document.getElementById("letras-lista-detalle");
  lista.innerHTML = "";
  respuestas.forEach((correcto, i) => {
    const item = document.createElement("div");
    item.className = `detalle-item ${correcto ? "detalle-correcto" : "detalle-incorrecto"}`;
    item.innerHTML = `<span>P${i + 1}</span><span>${correcto ? "✔" : "✖"}</span>`;
    lista.appendChild(item);
  });

  // Resoluciones
  renderizarResolucionesLetras(respuestas, elegidas);

  // Guardar resultado
  enviarResultadosLetras(porcentaje, correctas, incorrectas, respuestas);
}

function renderizarResolucionesLetras(respuestas, elegidas) {
  const contenedor = document.getElementById("letras-contenedor-resoluciones");
  if (!contenedor) return;

  const letras       = ["A","B","C","D"];
  const colorTipo    = { "Comprensión de texto": "#4CC9F0", "Comprensión de texto — Idea principal": "#4CC9F0",
    "Comprensión de texto — Inferencia": "#4CC9F0", "Sinónimos": "#43E97B", "Analogías": "#FFD93D",
    "Verbos": "#FF6B6B", "Artículos y determinantes": "#FF6584", "Determinantes": "#FF6584" };

  let html = "";
  PREGUNTAS_LETRAS.forEach((p, i) => {
    const correcto       = respuestas[i];
    const idxElegida     = elegidas[i];
    const idxCorrecta    = p.respuesta;
    const opcionElegida  = p.opciones[idxElegida] ?? "—";
    const opcionCorrecta = p.opciones[idxCorrecta];
    const colTipo        = colorTipo[p.tipo] || "#B8B8D1";
    const resolucionFmt  = (p.resolucion || "").replace(/\n/g, "<br>");
    const textoColor     = p.texto === 1 ? "#4CC9F0" : "#FF6584";

    html += `
      <div class="res-card ${correcto ? "res-correcto" : "res-incorrecto"}">
        <div class="res-header">
          <span class="res-num">${i + 1}</span>
          <span style="font-size:0.72rem;font-weight:800;color:${textoColor};background:${textoColor}18;padding:2px 10px;border-radius:10px">📖 Texto ${p.texto}</span>
          <span style="font-size:0.72rem;font-weight:800;color:${colTipo}">${p.tipo}</span>
          <span class="res-estado">${correcto ? "✅ Correcto" : "❌ Incorrecto"}</span>
        </div>
        <p class="res-pregunta">${p.pregunta}</p>
        <div class="res-opciones">
          ${!correcto ? `<div class="res-opcion res-elegida"><span class="res-letra">${letras[idxElegida]}</span>Tu respuesta: <strong>${opcionElegida}</strong></div>` : ""}
          <div class="res-opcion res-respuesta-ok"><span class="res-letra">${letras[idxCorrecta]}</span>Respuesta correcta: <strong>${opcionCorrecta}</strong></div>
        </div>
        <details class="res-detalle">
          <summary>📖 Ver explicación</summary>
          <div class="res-pasos">${resolucionFmt}</div>
        </details>
      </div>`;
  });

  contenedor.innerHTML = html;
}

async function enviarResultadosLetras(porcentaje, correctas, incorrectas, respuestas) {
  const { nombre, grupo } = Estado.estudiante;
  const ahora = new Date();
  const datos = {
    nombre, grupo: `Grupo ${grupo}`,
    fecha: ahora.toLocaleDateString("es-PE"),
    hora:  ahora.toLocaleTimeString("es-PE"),
    correctas, incorrectas, porcentaje,
    detalle: respuestas.map((r, i) => `P${i+1}:${r?"C":"I"}`).join("|"),
    mundo: "LETRAS"
  };

  const ind = document.getElementById("letras-estado-envio");
  try {
    if (CONFIG.GOOGLE_SCRIPT_URL.includes("TU_ID_AQUI")) throw new Error("no config");
    await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos)
    });
    if (ind) { ind.textContent = "✅ ¡Guardado!"; ind.className = "estado-envio exito"; ind.style.display = "block"; }
  } catch {
    const h = JSON.parse(localStorage.getItem("desafio_resultados") || "[]");
    h.push({ ...datos, timestamp: Date.now() });
    localStorage.setItem("desafio_resultados", JSON.stringify(h));
    if (ind) { ind.textContent = "💾 Guardado localmente"; ind.className = "estado-envio advertencia"; ind.style.display = "block"; }
  }
}