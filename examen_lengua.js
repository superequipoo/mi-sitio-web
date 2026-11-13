console.log("✅ JS DE EXAMEN LENGUA CARGADO");

document.addEventListener('DOMContentLoaded', () => {
    function conectar(id, funcion) {
        const btn = document.getElementById(id);
        if (!btn) { console.log("❌ NO ENCONTRÉ BOTÓN: " + id); return; }
        btn.addEventListener('click', funcion);
        console.log("✅ Conectado: " + id);
    }

    conectar('btn-start', iniciar);
    conectar('btn-saltar', saltar);
    conectar('btn-reintentar', reiniciar);

    // Conectar las 4 opciones A B C D
    for (let i = 0; i < 4; i++) {
        conectar('opcion-' + i, () => responder(i));
    }
});

let preguntas = [];
let indice = 0;
let aciertos = 0;
let fallos = 0;
let jugando = false;
let tiempo = 600;
let timer = null;
const TOTAL = 20;
let errores = [];

let porTema = {};

function iniciar() {
    if (jugando) return;
    preguntas = generarExamen();
    indice = 0; aciertos = 0; fallos = 0; tiempo = 600;
    errores = [];
    jugando = true;
    porTema = {
        'Acentuación': { total: 0, bien: 0 },
        'V y B': { total: 0, bien: 0 },
        'C, S, Z': { total: 0, bien: 0 },
        'G/J, H, LL/Y': { total: 0, bien: 0 },
        'Puntuación y Mayúsculas': { total: 0, bien: 0 }
    };
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('zona-fin').style.display = 'none';
    document.getElementById('zona-opciones').style.display = 'block';
    document.getElementById('feedback').textContent = '';
    actualizarMarcador();
    iniciarTiempo();
    mostrarPregunta();
}

function reiniciar() {
    jugando = false;
    clearInterval(timer);
    iniciar();
}

function iniciarTiempo() {
    clearInterval(timer);
    timer = setInterval(() => {
        tiempo--;
        const min = Math.floor(tiempo / 60);
        const seg = tiempo % 60;
        document.getElementById('tiempo').textContent = `${min}:${seg < 10 ? '0' + seg : seg}`;
        if (tiempo <= 60) document.getElementById('tiempo').style.color = '#ff4d4d';
        else document.getElementById('tiempo').style.color = '#fff';
        if (tiempo <= 0) terminarExamen('tiempo');
    }, 1000);
}

function mostrarPregunta() {
    if (indice >= TOTAL) { terminarExamen('completo'); return; }
    const p = preguntas[indice];
    document.getElementById('tema').textContent = `Tema: ${p.tema} - Pregunta ${indice + 1} de ${TOTAL}`;
    document.getElementById('operacion').textContent = p.texto;
    document.getElementById('contexto').textContent = p.contexto || '';
    document.getElementById('feedback').textContent = '';

    const letras = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById('opcion-' + i);
        btn.textContent = letras[i] + ') ' + p.opciones[i];
        btn.style.background = '#1a2a5a';
        btn.style.borderColor = '#2a3a65';
        btn.disabled = false;
    }
    actualizarMarcador();
}

function responder(indiceOpcion) {
    if (!jugando) return;
    const p = preguntas[indice];
    const feedback = document.getElementById('feedback');

    // Bloquear botones para que no le pique 2 veces
    for (let i = 0; i < 4; i++) document.getElementById('opcion-' + i).disabled = true;

    porTema[p.tema].total++;
    const correcto = indiceOpcion === p.correcta;

    // Pintar verde la correcta y rojo la que eligió si falló
    document.getElementById('opcion-' + p.correcta).style.background = '#00aa66';
    document.getElementById('opcion-' + p.correcta).style.borderColor = '#00ffc6';
    if (!correcto) {
        document.getElementById('opcion-' + indiceOpcion).style.background = '#aa2222';
        document.getElementById('opcion-' + indiceOpcion).style.borderColor = '#ff4d4d';
    }

    if (correcto) {
        aciertos++;
        porTema[p.tema].bien++;
        feedback.textContent = `✅ Correcto. ${p.explicacion}`;
        feedback.style.color = '#00ffc6';
    } else {
        fallos++;
        errores.push({ pregunta: p.texto, tuya: p.opciones[indiceOpcion], correcta: p.opciones[p.correcta], explicacion: p.explicacion });
        feedback.textContent = `❌ Incorrecto. Correcta: ${p.opciones[p.correcta]}. ${p.explicacion}`;
        feedback.style.color = '#ff4d4d';
    }

    setTimeout(() => { indice++; mostrarPregunta(); }, 1600);
}

function saltar() {
    if (!jugando) return;
    const p = preguntas[indice];
    porTema[p.tema].total++;
    fallos++;
    errores.push({ pregunta: p.texto, tuya: 'Saltada', correcta: p.opciones[p.correcta], explicacion: p.explicacion });
    document.getElementById('feedback').textContent = `⏭ Saltada. Era: ${p.opciones[p.correcta]}`;
    document.getElementById('feedback').style.color = '#ffaa00';
    setTimeout(() => { indice++; mostrarPregunta(); }, 700);
}

function actualizarMarcador() {
    document.getElementById('pregunta-actual').textContent = Math.min(indice + 1, TOTAL);
    document.getElementById('aciertos').textContent = aciertos;
    document.getElementById('fallos').textContent = fallos;
    document.getElementById('barra-progreso').style.width = (indice / TOTAL * 100) + '%';
}

function terminarExamen(motivo) {
    jugando = false;
    clearInterval(timer);
    document.getElementById('zona-opciones').style.display = 'none';
    document.getElementById('btn-start').style.display = 'none';
    const zonaFin = document.getElementById('zona-fin');
    zonaFin.style.display = 'block';

    const calif = (aciertos / TOTAL * 10).toFixed(1);
    document.getElementById('calificacion').textContent = calif;

    const titulo = document.getElementById('titulo-fin');
    const texto = document.getElementById('texto-fin');
    const medalla = document.getElementById('medalla');
    const resumen = document.getElementById('resumen-temas');
    const listaErrores = document.getElementById('lista-errores');

    let resumenHTML = '<b>📊 Tu resultado por tema:</b><br>';
    for (const tema in porTema) {
        const t = porTema[tema];
        const emoji = t.bien >= 3 ? '✅' : t.bien === 2 ? '⚠️' : '❌';
        resumenHTML += `${emoji} ${tema}: ${t.bien}/${t.total} bien<br>`;
    }
    resumen.innerHTML = resumenHTML;

    if (errores.length > 0) {
        let errHTML = '<b>❌ Tus errores para repasar:</b><br>';
        errores.forEach((e, i) => {
            errHTML += `${i + 1}. ${e.pregunta}<br>Tu respuesta: ${e.tuya} | Correcta: ${e.correcta}<br><i>${e.explicacion}</i><br><br>`;
        });
        listaErrores.innerHTML = errHTML;
        listaErrores.style.display = 'block';
    } else {
        listaErrores.style.display = 'none';
    }

    if (motivo === 'tiempo') {
        titulo.textContent = '⏱ ¡Se acabó el tiempo!';
        texto.textContent = `Respondiste ${indice} de 20. Aciertos: ${aciertos}. Calificación: ${calif}.`;
        medalla.textContent = '⏱';
    } else {
        if (aciertos >= 18) {
            titulo.textContent = '🏆 ¡APROBADO CON HONORES!';
            texto.textContent = `¡Increíble! ${aciertos}/20 aciertos. Calificación: ${calif}. Eres leyenda en Ortografía.`;
            medalla.textContent = '🏆';
        } else if (aciertos >= 14) {
            titulo.textContent = '🥇 ¡APROBASTE!';
            texto.textContent = `¡Pasaste! ${aciertos}/20 aciertos. Calificación: ${calif}. Ya dominas lo básico de ortografía.`;
            medalla.textContent = '🥇';
        } else if (aciertos >= 10) {
            titulo.textContent = '😬 Casi lo logras';
            texto.textContent = `Te faltó poco. ${aciertos}/20 aciertos. Calificación: ${calif}. Necesitas 14 para pasar. Mira abajo en qué tema fallaste más.`;
            medalla.textContent = '📚';
        } else {
            titulo.textContent = '💔 Reprobado, pero no te rindas';
            texto.textContent = `${aciertos}/20 aciertos. Calificación: ${calif}. Vuelve a practicar en el tema donde tienes más ❌ y regresa.`;
            medalla.textContent = '💪';
        }
    }
    document.getElementById('operacion').textContent = 'Examen terminado';
    document.getElementById('contexto').textContent = '';
    document.getElementById('barra-progreso').style.width = '100%';
}

function generarExamen() {
    const lista = [];

    // --- 1. ACENTUACIÓN (4) ---
    lista.push({ tema: 'Acentuación', texto: '¿Cuál palabra está bien escrita?', opciones: ['Arbol', 'Árbol', 'Arbòl', 'Arbôl'], correcta: 1, explicacion: 'Es esdrújula, siempre lleva tilde: ÁR-bol.' });
    lista.push({ tema: 'Acentuación', texto: '¿Cuál palabra es aguda y SÍ lleva tilde?', opciones: ['Cafe', 'Camion', 'Canción', 'Lapiz'], correcta: 2, explicacion: 'Canción termina en N y es aguda, sí lleva tilde.' });
    lista.push({ tema: 'Acentuación', texto: '¿Cuál lleva tilde por ser esdrújula?', opciones: ['Medico', 'Médico', 'Medíco', 'Medicó'], correcta: 1, explicacion: 'MÉ-di-co, esdrújula, siempre con tilde.' });
    lista.push({ tema: 'Acentuación', texto: 'Elige la correcta con tilde diacrítica:', opciones: ['El te verde', 'Él te quiere', 'Tu casa es bonita', 'Tú casa es bonita'], correcta: 1, explicacion: 'TÚ con tilde es pronombre (él/ella). TU sin tilde es de posesión.' });

    // --- 2. V Y B (4) ---
    lista.push({ tema: 'V y B', texto: 'Completa: Yo ____ a ir a la escuela.', opciones: ['boy', 'voy', 'boi', 'vov'], correcta: 1, explicacion: 'VOY es del verbo IR.' });
    lista.push({ tema: 'V y B', texto: '¿Cuál está bien escrita?', opciones: ['Haver', 'Aver', 'Haber', 'Haberlo'], correcta: 2, explicacion: 'HABER se escribe con H y B. Pero OJO: Haver no existe.' });
    lista.push({ tema: 'V y B', texto: 'Completa: La ____ es muy bonita.', opciones: ['bida', 'vida', 'viva', 'biva'], correcta: 1, explicacion: 'VIDA se escribe con V.' });
    lista.push({ tema: 'V y B', texto: '¿Cuál está bien escrita?', opciones: ['Recivir', 'Resivir', 'Recibir', 'Recebir'], correcta: 2, explicacion: 'RECIBIR se escribe con B, antes de B va C no S.' });

    // --- 3. C, S, Z (4) ---
    lista.push({ tema: 'C, S, Z', texto: 'Completa: La ____ es mi animal favorito.', opciones: ['casa', 'caza', 'cassa', 'cazza'], correcta: 1, explicacion: 'CAZA es de cazar animales. CASA es de vivir.' });
    lista.push({ tema: 'C, S, Z', texto: '¿Cuál está bien escrita?', opciones: ['Corazón', 'Corason', 'Corasón', 'Corazon'], correcta: 0, explicacion: 'CORAZÓN con Z y tilde por ser aguda terminada en N.' });
    lista.push({ tema: 'C, S, Z', texto: 'Completa: Voy a ____ la comida.', opciones: ['coser', 'cocer', 'cosser', 'cozer'], correcta: 1, explicacion: 'COCER es de cocinar. COSER es de costura.' });
    lista.push({ tema: 'C, S, Z', texto: '¿Cuál está bien escrita?', opciones: ['Lapiz', 'Lápis', 'Lápiz', 'Lapís'], correcta: 2, explicacion: 'LÁPIZ con Z y tilde por ser grave que no termina en vocal.' });

    // --- 4. G/J, H, LL/Y (4) ---
    lista.push({ tema: 'G/J, H, LL/Y', texto: '¿Cuál está bien escrita?', opciones: ['Jirafa', 'Girafa', 'Jiraffa', 'Giraffa'], correcta: 0, explicacion: 'JIRAFA se escribe con J.' });
    lista.push({ tema: 'G/J, H, LL/Y', texto: 'Completa: ____ voy a la escuela.', opciones: ['Hoi', 'Hoy', 'Oy', 'Hóy'], correcta: 1, explicacion: 'HOY se escribe con H y Y.' });
    lista.push({ tema: 'G/J, H, LL/Y', texto: '¿Cuál está bien escrita?', opciones: ['Yave', 'Llave', 'Yabe', 'Llabe'], correcta: 1, explicacion: 'LLAVE se escribe con LL y V.' });
    lista.push({ tema: 'G/J, H, LL/Y', texto: 'Completa: El ____ es un animal.', opciones: ['jato', 'gato', 'hato', 'gatoo'], correcta: 1, explicacion: 'GATO con G. HATO es un grupo de ganado.' });

    // --- 5. PUNTUACIÓN Y MAYÚSCULAS (4) ---
    lista.push({ tema: 'Puntuación y Mayúsculas', texto: '¿Cuál oración está bien puntuada?', opciones: ['Hola como estas', 'Hola, ¿cómo estás?', 'Hola como estás?', 'Hola ¿cómo estás'], correcta: 1, explicacion: 'Las preguntas llevan ¿ ? y coma después de Hola.' });
    lista.push({ tema: 'Puntuación y Mayúsculas', texto: '¿Cuál lleva mayúscula correcta?', opciones: ['mexico es bonito', 'México es bonito', 'méxico es bonito', 'MEXICO es bonito'], correcta: 1, explicacion: 'Los nombres de países van con mayúscula: México.' });
    lista.push({ tema: 'Puntuación y Mayúsculas', texto: '¿Dónde va la coma?', opciones: ['Compré pan leche y huevos', 'Compré pan, leche y huevos', 'Compré, pan leche y huevos', 'Compré pan leche, y huevos'], correcta: 1, explicacion: 'La coma separa los elementos de la lista.' });
    lista.push({ tema: 'Puntuación y Mayúsculas', texto: '¿Cuál oración termina bien?', opciones: ['Me gusta el futbol', 'Me gusta el futbol.', 'me gusta el futbol.', 'Me gusta el futbol,'], correcta: 1, explicacion: 'Toda oración termina con punto y empieza con mayúscula.' });

    // Mezclar
    return mezclar(lista);
}

function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}