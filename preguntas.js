// ============================================================
// DESAFÍO ACADÉMICO — BANCO DE PREGUNTAS
// Matemática: 15 preguntas (niveles básico → avanzado)
// Comunicación: 15 preguntas sencillas (7 Texto1 + 8 Texto2)
// Las opciones se MEZCLAN automáticamente en cada intento
// para evitar que los estudiantes copien por posición.
// ============================================================

// ============================================================
// FUNCIÓN DE MEZCLA (Fisher-Yates)
// Se llama al iniciar cada quiz — no modifica el array original
// ============================================================
function mezclarOpciones(pregunta) {
  // Crea una copia con las opciones mezcladas y actualiza el índice correcto
  const indices = [0, 1, 2, 3];
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const opcionesNuevas   = indices.map(i => pregunta.opciones[i]);
  const respuestaNueva   = indices.indexOf(pregunta.respuesta);
  return { ...pregunta, opciones: opcionesNuevas, respuesta: respuestaNueva };
}

// Mezcla todas las preguntas de un array
function prepararPreguntas(arr) {
  return arr.map(p => mezclarOpciones(p));
}

// ============================================================
// MATEMÁTICA — 15 PREGUNTAS
// P1–P8: Básico | P9–P12: Medio (series/fórmulas) | P13–P15: Avanzado
// ============================================================
const PREGUNTAS_BASE = [

  // ── BÁSICO ──────────────────────────────────────────────
  {
    nivel: "⭐ Básico",
    pregunta: "¿Cuánto es 7 × 8?",
    opciones: ["54", "56", "63", "64"],
    respuesta: 1,
    resolucion: "Tabla del 7:\n   7 × 8 = 56\n\n✅ Respuesta: 56"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "¿Cuál es el 25% de 200?",
    opciones: ["25", "40", "50", "75"],
    respuesta: 2,
    resolucion: "25% de 200:\n   (25 ÷ 100) × 200 = 0.25 × 200 = 50\n\n✅ Respuesta: 50"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "Un rectángulo mide 9 cm de base y 5 cm de altura. ¿Cuál es su área?",
    opciones: ["28 cm²", "40 cm²", "45 cm²", "54 cm²"],
    respuesta: 2,
    resolucion: "Área del rectángulo = base × altura\n   A = 9 × 5 = 45 cm²\n\n✅ Respuesta: 45 cm²"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "Si Pedro tiene S/80 y gasta 3/8 del dinero, ¿cuánto le queda?",
    opciones: ["S/40", "S/45", "S/50", "S/60"],
    respuesta: 2,
    resolucion: "Gasto: 3/8 de 80 = (3 × 80) ÷ 8 = 30\nResto: 80 − 30 = 50\n\n✅ Respuesta: S/50"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "Un auto viaja a 60 km/h. ¿Cuántos km recorre en 2 horas y media?",
    opciones: ["120 km", "140 km", "150 km", "160 km"],
    respuesta: 2,
    resolucion: "distancia = velocidad × tiempo\n   d = 60 × 2.5 = 150 km\n\n✅ Respuesta: 150 km"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "Si 5 lápices cuestan S/15, ¿cuánto cuestan 8 lápices?",
    opciones: ["S/20", "S/24", "S/32", "S/40"],
    respuesta: 1,
    resolucion: "Precio unitario: 15 ÷ 5 = S/3\n8 lápices: 8 × 3 = S/24\n\n✅ Respuesta: S/24"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "¿Qué número es divisible entre 2, 3 y 5 al mismo tiempo?",
    opciones: ["25", "30", "35", "45"],
    respuesta: 1,
    resolucion: "Buscamos el número divisible entre 2, 3 y 5:\n   30 ÷ 2 = 15 ✓\n   30 ÷ 3 = 10 ✓\n   30 ÷ 5 = 6  ✓\n\n✅ Respuesta: 30"
  },
  {
    nivel: "⭐ Básico",
    pregunta: "En una clase hay 30 alumnos. Si 2/5 son niñas, ¿cuántas niñas hay?",
    opciones: ["10", "12", "14", "16"],
    respuesta: 1,
    resolucion: "2/5 de 30:\n   (2 × 30) ÷ 5 = 60 ÷ 5 = 12\n\n✅ Respuesta: 12 niñas"
  },

  // ── MEDIO (series y fórmulas) ────────────────────────────
  {
    nivel: "⭐⭐ Medio",
    pregunta: "📊 SERIE: ¿Cuál es el siguiente número?\n2, 5, 10, 17, 26, ___",
    opciones: ["33", "35", "37", "39"],
    respuesta: 2,
    resolucion: "Diferencias entre términos:\n   5−2=3 | 10−5=5 | 17−10=7 | 26−17=9\n   Patrón: +3, +5, +7, +9, +11...\n   26 + 11 = 37\n\n✅ Respuesta: 37"
  },
  {
    nivel: "⭐⭐ Medio",
    pregunta: "📊 SERIE: ¿Cuál es el término que falta?\n3, 6, 12, ___, 48, 96",
    opciones: ["18", "20", "24", "36"],
    respuesta: 2,
    resolucion: "Razón entre términos: 6÷3=2, 12÷6=2\n   12 × 2 = 24\n   24 × 2 = 48 ✓\n   Serie geométrica de razón 2.\n\n✅ Respuesta: 24"
  },
  {
    nivel: "⭐⭐ Medio",
    pregunta: "📊 SERIE: 1, 4, 9, 16, ___\n¿Cuál es el siguiente número?",
    opciones: ["20", "23", "25", "30"],
    respuesta: 2,
    resolucion: "Son cuadrados perfectos (n²):\n   1²=1 | 2²=4 | 3²=9 | 4²=16 | 5²=25\n\n✅ Respuesta: 25"
  },
  {
    nivel: "⭐⭐ Medio",
    pregunta: "🔢 FÓRMULA: P = 2(b + h)\n¿Cuál es el perímetro si b = 8 y h = 5?",
    opciones: ["21", "26", "40", "52"],
    respuesta: 1,
    resolucion: "P = 2(b + h)\n   P = 2(8 + 5)\n   P = 2 × 13 = 26\n\n✅ Respuesta: 26"
  },

  // ── AVANZADO ─────────────────────────────────────────────
  {
    nivel: "⭐⭐⭐ Avanzado",
    pregunta: "📊 SERIE: 1, 1, 2, 3, 5, 8, 13, ___",
    opciones: ["18", "19", "20", "21"],
    respuesta: 3,
    resolucion: "Serie de Fibonacci: cada número = suma de los dos anteriores.\n   5+8=13 ✓  →  8+13 = 21\n\n✅ Respuesta: 21"
  },
  {
    nivel: "⭐⭐⭐ Avanzado",
    pregunta: "La suma de 5 números consecutivos es 100. ¿Cuál es el número central?",
    opciones: ["18", "19", "20", "21"],
    respuesta: 2,
    resolucion: "Cinco consecutivos: n−2, n−1, n, n+1, n+2\n   Suma = 5n = 100  →  n = 20\n   Comprobación: 18+19+20+21+22 = 100 ✓\n\n✅ Respuesta: 20"
  },
  {
    nivel: "⭐⭐⭐ Avanzado",
    pregunta: "🔢 FÓRMULA: A = π × r²  (π ≈ 3.14)\n¿Cuál es el área de un círculo con r = 5 cm?",
    opciones: ["62.8 cm²", "75.5 cm²", "78.5 cm²", "80.0 cm²"],
    respuesta: 2,
    resolucion: "A = π × r²\n   A = 3.14 × 5²\n   A = 3.14 × 25 = 78.5 cm²\n\n✅ Respuesta: 78.5 cm²"
  }
];

// Array listo para usar (se mezcla al iniciar el quiz)
let PREGUNTAS = [];

// ============================================================
// COMUNICACIÓN — TEXTOS
// ============================================================
const TEXTO1 = {
  titulo: "📖 Texto 1 — El río y el bosque",
  cuerpo: `En lo profundo de la selva amazónica vivía un río caudaloso llamado Tambo. Sus aguas cristalinas recorrían kilómetros de bosque tropical, dando vida a cientos de plantas y animales. Los árboles, erguidos y frondosos, extendían sus ramas como brazos protectores sobre el río.

Un día, un grupo de leñadores llegó con la intención de talar los árboles. Los animales buscaron refugio. El río, sin la sombra de los árboles, comenzó a evaporarse lentamente. Las plantas se marchitaron y el suelo se volvió árido. Solo entonces los leñadores comprendieron que el bosque y el río eran inseparables: uno necesitaba al otro para sobrevivir.`
};

const TEXTO2 = {
  titulo: "📖 Texto 2 — La niña que sembraba palabras",
  cuerpo: `Sofía era una niña de doce años que vivía en un pequeño pueblo de los Andes. Cada mañana, antes de ir a la escuela, recorría los campos con su cuaderno bajo el brazo, anotando todo lo que veía: el color del cielo, el olor de la tierra mojada, el canto de los gallos.

Su maestra, la señora Carmen, le había enseñado que las palabras son semillas: si las cuidas y las compartes, crecen y florecen en la mente de quienes las leen. Sofía tomó esa lección muy en serio. Comenzó a escribir cuentos cortos que pegaba en las paredes de la escuela. Sus compañeros los leían con asombro y pronto también quisieron escribir. Así nació un pequeño club de escritores que llenó de historias las tardes frías de la sierra.`
};

// ============================================================
// COMUNICACIÓN — 15 PREGUNTAS SENCILLAS
// 7 del Texto 1  |  8 del Texto 2
// ============================================================
const PREGUNTAS_LETRAS_BASE = [

  // ── TEXTO 1 — 7 preguntas ───────────────────────────────
  {
    texto: 1,
    tipo: "Comprensión",
    pregunta: "¿Cómo se llama el río del que habla el Texto 1?",
    opciones: ["Amazonas", "Tambo", "Napo", "Ucayali"],
    respuesta: 1,
    resolucion: "El texto dice en la primera oración:\n   \"...vivía un río caudaloso llamado Tambo.\"\n\n✅ Respuesta: Tambo"
  },
  {
    texto: 1,
    tipo: "Comprensión",
    pregunta: "¿Qué hicieron los leñadores al llegar al bosque?",
    opciones: [
      "Plantaron árboles nuevos",
      "Construyeron una represa",
      "Intentaron talar los árboles",
      "Pescaron en el río"
    ],
    respuesta: 2,
    resolucion: "El texto dice:\n   \"...llegó con la intención de talar los árboles.\"\n\n✅ Respuesta: Intentaron talar los árboles"
  },
  {
    texto: 1,
    tipo: "Comprensión",
    pregunta: "¿Qué le pasó al río cuando los árboles fueron talados?",
    opciones: [
      "Creció y se desbordó",
      "Comenzó a evaporarse",
      "Se llenó de peces",
      "Cambió de color"
    ],
    respuesta: 1,
    resolucion: "El texto indica:\n   \"El río, sin la sombra de los árboles,\n   comenzó a evaporarse lentamente.\"\n\n✅ Respuesta: Comenzó a evaporarse"
  },
  {
    texto: 1,
    tipo: "Sinónimo",
    pregunta: "En el texto, la palabra \"caudaloso\" significa:",
    opciones: ["Muy limpio", "Con mucha agua", "Muy profundo", "Muy rápido"],
    respuesta: 1,
    resolucion: "SINÓNIMO:\n   Caudaloso = que tiene mucho caudal,\n   es decir, que lleva mucha agua.\n\n✅ Respuesta: Con mucha agua"
  },
  {
    texto: 1,
    tipo: "Sinónimo",
    pregunta: "¿Qué significa la palabra \"árido\" en el texto?",
    opciones: ["Húmedo", "Fértil", "Seco", "Oscuro"],
    respuesta: 2,
    resolucion: "SINÓNIMO:\n   Árido = seco, sin humedad ni vegetación.\n   \"El suelo se volvió árido\" = el suelo se secó.\n\n✅ Respuesta: Seco"
  },
  {
    texto: 1,
    tipo: "Analogía",
    pregunta: "BOSQUE es a ÁRBOL como RÍO es a ___",
    opciones: ["Pez", "Agua", "Lago", "Piedra"],
    respuesta: 1,
    resolucion: "Analogía parte-todo:\n   BOSQUE (todo) → ÁRBOL (parte)\n   RÍO (todo) → AGUA (parte)\n\n✅ Respuesta: Agua"
  },
  {
    texto: 1,
    tipo: "Idea principal",
    pregunta: "¿Cuál es la enseñanza principal del Texto 1?",
    opciones: [
      "Los leñadores son personas malas",
      "El bosque y el río se necesitan mutuamente",
      "Los peces necesitan agua limpia",
      "La selva es peligrosa"
    ],
    respuesta: 1,
    resolucion: "La última oración resume el mensaje:\n   \"...el bosque y el río eran inseparables:\n   uno necesitaba al otro para sobrevivir.\"\n\n✅ Respuesta: El bosque y el río se necesitan mutuamente"
  },

  // ── TEXTO 2 — 8 preguntas ───────────────────────────────
  {
    texto: 2,
    tipo: "Comprensión",
    pregunta: "¿Qué hacía Sofía cada mañana antes de ir a la escuela?",
    opciones: [
      "Leía libros en la biblioteca",
      "Recorría los campos anotando lo que veía",
      "Ayudaba a cocinar en casa",
      "Escuchaba música con su maestra"
    ],
    respuesta: 1,
    resolucion: "El texto dice:\n   \"Cada mañana... recorría los campos con su\n   cuaderno bajo el brazo, anotando todo lo que veía.\"\n\n✅ Respuesta: Recorría los campos anotando lo que veía"
  },
  {
    texto: 2,
    tipo: "Comprensión",
    pregunta: "¿Con qué compara la maestra Carmen a las palabras?",
    opciones: ["Con el agua", "Con semillas", "Con el viento", "Con la luz"],
    respuesta: 1,
    resolucion: "La maestra dice en el texto:\n   \"...las palabras son semillas: si las cuidas\n   y las compartes, crecen y florecen.\"\n\n✅ Respuesta: Con semillas"
  },
  {
    texto: 2,
    tipo: "Comprensión",
    pregunta: "¿Qué hizo Sofía con los cuentos que escribía?",
    opciones: [
      "Los guardó en su cuaderno",
      "Los envió al periódico",
      "Los pegó en las paredes de la escuela",
      "Los leyó solo a su maestra"
    ],
    respuesta: 2,
    resolucion: "El texto indica:\n   \"Comenzó a escribir cuentos cortos que\n   pegaba en las paredes de la escuela.\"\n\n✅ Respuesta: Los pegó en las paredes de la escuela"
  },
  {
    texto: 2,
    tipo: "Sinónimo",
    pregunta: "En el texto, \"florecen\" significa:",
    opciones: ["Se pierden", "Se desarrollan y crecen", "Se marchitan", "Se olvidan"],
    respuesta: 1,
    resolucion: "SINÓNIMO en contexto:\n   Florecen = se desarrollan, prosperan, crecen.\n   \"Crecen y florecen en la mente\" = se desarrollan\n   en la mente de quien las lee.\n\n✅ Respuesta: Se desarrollan y crecen"
  },
  {
    texto: 2,
    tipo: "Artículo",
    pregunta: "En \"un club de escritores\", ¿qué tipo de artículo es la palabra \"un\"?",
    opciones: [
      "Artículo definido",
      "Artículo indefinido",
      "Determinante posesivo",
      "Determinante demostrativo"
    ],
    respuesta: 1,
    resolucion: "ARTÍCULOS:\n   Definidos: el, la, los, las (cosa conocida)\n   Indefinidos: un, una, unos, unas (cosa no específica)\n\n   \"un club\" → no es un club conocido → indefinido.\n\n✅ Respuesta: Artículo indefinido"
  },
  {
    texto: 2,
    tipo: "Determinante",
    pregunta: "En \"sus compañeros la leían\", ¿qué tipo de determinante es \"sus\"?",
    opciones: ["Artículo", "Demostrativo", "Posesivo", "Numeral"],
    respuesta: 2,
    resolucion: "DETERMINANTES POSESIVOS:\n   Indican pertenencia: mi, tu, su, sus...\n   \"sus compañeros\" = los compañeros de ella.\n   \"sus\" indica que pertenecen a alguien → posesivo.\n\n✅ Respuesta: Posesivo"
  },
  {
    texto: 2,
    tipo: "Verbo",
    pregunta: "En \"Sofía recorría los campos\", ¿en qué tiempo está el verbo \"recorría\"?",
    opciones: ["Presente", "Futuro", "Pretérito imperfecto", "Pretérito perfecto"],
    respuesta: 2,
    resolucion: "TIEMPO VERBAL:\n   Recorría → verbo recorrer\n   Expresa una acción habitual en el pasado.\n   Eso es el pretérito imperfecto.\n   (Ella recorría = lo hacía con frecuencia)\n\n✅ Respuesta: Pretérito imperfecto"
  },
  {
    texto: 2,
    tipo: "Inferencia",
    pregunta: "¿Qué podemos concluir sobre el pueblo donde vivía Sofía?",
    opciones: [
      "Es una ciudad grande y moderna",
      "Es un pueblo frío y pequeño en los Andes",
      "Es un pueblo caluroso cerca del mar",
      "Es una zona industrial"
    ],
    respuesta: 1,
    resolucion: "Pistas en el texto:\n   ✔ \"pequeño pueblo de los Andes\" → sierra\n   ✔ \"tardes frías de la sierra\" → clima frío\n   ✔ \"campos\" → zona rural\n\n   Conclusión: pueblo pequeño, andino y frío.\n\n✅ Respuesta: Es un pueblo frío y pequeño en los Andes"
  }
];

// Array listo para usar (se mezcla al iniciar el quiz)
let PREGUNTAS_LETRAS = [];

// ============================================================
// CONFIGURACIÓN DEL JUEGO
// ============================================================
const CONFIG = {
  MAX_ESTUDIANTES_POR_GRUPO: 10,
  NUM_GRUPOS: 2,
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/TU_ID_AQUI/exec"
};