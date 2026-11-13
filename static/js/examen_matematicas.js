console.log("✅ JS DE EXAMEN FINAL CARGADO");

document.addEventListener('DOMContentLoaded', () => {
    function conectar(id, funcion) {
        const btn = document.getElementById(id);
        if (!btn) {
            console.log("❌ NO ENCONTRÉ BOTÓN: " + id);
            return;
        }
        btn.addEventListener('click', funcion);
        console.log("✅ Conectado: " + id);
    }

    conectar('btn-start', iniciar);
    conectar('btn-comprobar-respuesta', comprobar);
    conectar('btn-saltar', saltar);
    conectar('btn-reintentar', reiniciar);

    const input = document.getElementById('respuesta');
    if (input) input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') comprobar();
    });
});

let preguntas = [];
let indice = 0;
let aciertos = 0;
let fallos = 0;
let jugando = false;
let tiempo = 600; // 10 minutos = 600 seg
let timer = null;
const TOTAL = 20;

// Para el resumen por tema
let porTema = {
    'Álgebra': { total: 0, bien: 0 },
    'Pitágoras': { total: 0, bien: 0 },
    'Potencias y Raíces': { total: 0, bien: 0 },
    'Fracciones y Decimales': { total: 0, bien: 0 },
    'Porcentajes': { total: 0, bien: 0 }
};

function iniciar() {
    if (jugando) return;
    preguntas = generarExamen();
    indice = 0; aciertos = 0; fallos = 0; tiempo = 600;
    jugando = true;
    porTema = {
        'Álgebra': { total: 0, bien: 0 },
        'Pitágoras': { total: 0, bien: 0 },
        'Potencias y Raíces': { total: 0, bien: 0 },
        'Fracciones y Decimales': { total: 0, bien: 0 },
        'Porcentajes': { total: 0, bien: 0 }
    };
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('zona-fin').style.display = 'none';
    document.getElementById('zona-input').style.display = 'block';
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
        const textoTiempo = `${min}:${seg < 10 ? '0' + seg : seg}`;
        document.getElementById('tiempo').textContent = textoTiempo;
        if (tiempo <= 60) document.getElementById('tiempo').style.color = '#ff4d4d';
        else document.getElementById('tiempo').style.color = '#fff';
        if (tiempo <= 0) terminarExamen('tiempo');
    }, 1000);
}

function mostrarPregunta() {
    if (indice >= TOTAL) {
        terminarExamen('completo');
        return;
    }
    const p = preguntas[indice];
    document.getElementById('tema').textContent = `Tema: ${p.tema} - Pregunta ${indice + 1} de ${TOTAL}`;
    document.getElementById('operacion').textContent = p.texto;
    document.getElementById('contexto').textContent = p.contexto || '';
    document.getElementById('pista').textContent = 'En el examen NO hay pistas. Es como en la escuela.';
    document.getElementById('feedback').textContent = '';
    const input = document.getElementById('respuesta');
    input.value = '';
    input.focus();
    actualizarMarcador();
}

function comprobar() {
    if (!jugando) return;
    const input = document.getElementById('respuesta');
    const valor = input.value.trim().replace(',', '.');
    const feedback = document.getElementById('feedback');

    if (valor === '') {
        feedback.textContent = '⚠️ Escribe tu respuesta o dale a Saltar';
        feedback.style.color = '#ffaa00';
        return;
    }

    const p = preguntas[indice];
    let numUsuario = 0;
    if (valor.includes('/')) {
        const partes = valor.split('/');
        if (partes.length === 2 && !isNaN(partes[0]) && !isNaN(partes[1]) && Number(partes[1]) !== 0) {
            numUsuario = Number(partes[0]) / Number(partes[1]);
        } else {
            feedback.textContent = '⚠️ Esa fracción no se entiende. Ej: 1/2';
            feedback.style.color = '#ffaa00';
            return;
        }
    } else {
        numUsuario = Number(valor);
    }

    const correcto = Math.abs(numUsuario - p.respuesta) < 0.51;
    porTema[p.tema].total++;

    if (correcto) {
        aciertos++;
        porTema[p.tema].bien++;
        feedback.textContent = `✅ Correcto`;
        feedback.style.color = '#00ffc6';
    } else {
        fallos++;
        feedback.textContent = `❌ Incorrecto. Era ${p.respuestaTexto}`;
        feedback.style.color = '#ff4d4d';
    }

    // Espera un poquito para que vea si estuvo bien y pasa
    setTimeout(() => {
        indice++;
        mostrarPregunta();
    }, 900);
}

function saltar() {
    if (!jugando) return;
    const p = preguntas[indice];
    porTema[p.tema].total++;
    fallos++;
    document.getElementById('feedback').textContent = `⏭ Saltada. Era ${p.respuestaTexto}`;
    document.getElementById('feedback').style.color = '#ffaa00';
    setTimeout(() => {
        indice++;
        mostrarPregunta();
    }, 700);
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
    document.getElementById('zona-input').style.display = 'none';
    document.getElementById('btn-start').style.display = 'none';
    const zonaFin = document.getElementById('zona-fin');
    zonaFin.style.display = 'block';

    const calif = (aciertos / TOTAL * 10).toFixed(1);
    document.getElementById('calificacion').textContent = calif;

    const titulo = document.getElementById('titulo-fin');
    const texto = document.getElementById('texto-fin');
    const medalla = document.getElementById('medalla');
    const resumen = document.getElementById('resumen-temas');

    let resumenHTML = '<b>📊 Tu resultado por tema:</b><br>';
    for (const tema in porTema) {
        const t = porTema[tema];
        const emoji = t.bien >= 3 ? '✅' : t.bien === 2 ? '⚠️' : '❌';
        resumenHTML += `${emoji} ${tema}: ${t.bien}/${t.total} bien<br>`;
    }
    resumen.innerHTML = resumenHTML;

    if (motivo === 'tiempo') {
        titulo.textContent = '⏱ ¡Se acabó el tiempo!';
        texto.textContent = `Respondiste ${indice} de 20. Aciertos: ${aciertos}. Calificación: ${calif}.`;
        medalla.textContent = '⏱';
    } else {
        if (aciertos >= 18) {
            titulo.textContent = '🏆 ¡APROBADO CON HONORES!';
            texto.textContent = `¡Increíble! ${aciertos}/20 aciertos. Calificación: ${calif}. Eres leyenda en Matemáticas.`;
            medalla.textContent = '🏆';
        } else if (aciertos >= 14) {
            titulo.textContent = '🥇 ¡APROBASTE!';
            texto.textContent = `¡Pasaste! ${aciertos}/20 aciertos. Calificación: ${calif}. Ya dominas lo básico de todo.`;
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
    // 4 de cada tema = 20 en total

    // --- 1. ÁLGEBRA (4) ---
    const x1 = rand(2, 12); const a1 = rand(2, 6); const b1 = rand(2, 10);
    lista.push({ tema: 'Álgebra', texto: `${a1}x + ${b1} = ${a1 * x1 + b1}  ¿x = ?`, respuesta: x1, respuestaTexto: x1.toString() });
    const x2 = rand(3, 12);
    lista.push({ tema: 'Álgebra', texto: `x² = ${x2 * x2}  ¿x = ?`, respuesta: x2, respuestaTexto: x2.toString() });
    const x3 = rand(3, 10); const y3 = rand(2, 9);
    lista.push({ tema: 'Álgebra', texto: `x + y = ${x3 + y3} , x - y = ${x3 - y3}  ¿x = ?`, respuesta: x3, respuestaTexto: x3.toString() });
    const x4 = rand(2, 10); const a4 = rand(2, 8);
    lista.push({ tema: 'Álgebra', texto: `${a4}x - ${a4} = ${a4 * x4 - a4}  ¿x = ?`, respuesta: x4, respuestaTexto: x4.toString() });

    // --- 2. PITÁGORAS (4) ---
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
    for (let i = 0; i < 4; i++) {
        const t = triples[rand(0, triples.length - 1)];
        if (i % 2 === 0) {
            lista.push({ tema: 'Pitágoras', texto: `Catetos ${t[0]} y ${t[1]}. ¿Hipotenusa = ?`, contexto: 'a² + b² = c²', respuesta: t[2], respuestaTexto: t[2].toString() });
        } else {
            lista.push({ tema: 'Pitágoras', texto: `Hipotenusa ${t[2]}, cateto ${t[0]}. ¿Otro cateto = ?`, contexto: 'a² + b² = c²', respuesta: t[1], respuestaTexto: t[1].toString() });
        }
    }

    // --- 3. POTENCIAS Y RAÍCES (4) ---
    const c1 = rand(3, 12);
    lista.push({ tema: 'Potencias y Raíces', texto: `${c1}² = ?`, respuesta: c1 * c1, respuestaTexto: (c1 * c1).toString() });
    const c2 = rand(2, 6);
    lista.push({ tema: 'Potencias y Raíces', texto: `${c2}³ = ?`, respuesta: c2 * c2 * c2, respuestaTexto: (c2 * c2 * c2).toString() });
    const c3 = rand(3, 12);
    lista.push({ tema: 'Potencias y Raíces', texto: `√${c3 * c3} = ?`, respuesta: c3, respuestaTexto: c3.toString() });
    const base = rand(2, 5);
    lista.push({ tema: 'Potencias y Raíces', texto: `${base}² × ${base}³ = ${base}^?  ¿El exponente = ?`, respuesta: 5, respuestaTexto: '5' });

    // --- 4. FRACCIONES Y DECIMALES (4) ---
    const fracDatos = [[1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [2, 5, 0.4], [3, 5, 0.6]];
    const f1 = fracDatos[rand(0, fracDatos.length - 1)];
    lista.push({ tema: 'Fracciones y Decimales', texto: `${f1[0]}/${f1[1]} = ? en decimal`, respuesta: f1[2], respuestaTexto: f1[2].toString() });
    const denom = [4, 5, 8, 10][rand(0, 3)];
    const n1 = rand(1, denom - 1); const n2 = rand(1, denom - n1);
    lista.push({ tema: 'Fracciones y Decimales', texto: `${n1}/${denom} + ${n2}/${denom} = ? en fracción`, respuesta: (n1 + n2) / denom, respuestaTexto: `${n1 + n2}/${denom}` });
    const simp = [[2, 4, 1, 2], [6, 8, 3, 4], [4, 10, 2, 5], [3, 9, 1, 3]][rand(0, 3)];
    lista.push({ tema: 'Fracciones y Decimales', texto: `Simplifica: ${simp[0]}/${simp[1]} = ?`, respuesta: simp[2] / simp[3], respuestaTexto: `${simp[2]}/${simp[3]}` });
    const f2 = fracDatos[rand(0, fracDatos.length - 1)];
    lista.push({ tema: 'Fracciones y Decimales', texto: `${f2[2]} = ? en fracción`, respuesta: f2[2], respuestaTexto: `${f2[0]}/${f2[1]}` });

    // --- 5. PORCENTAJES (4) ---
    const porc = [10, 20, 25, 50][rand(0, 3)];
    const baseP = rand(5, 20) * 20;
    lista.push({ tema: 'Porcentajes', texto: `${porc}% de ${baseP} = ?`, respuesta: baseP * porc / 100, respuestaTexto: (baseP * porc / 100).toString() });
    const precio = rand(10, 50) * 10;
    const desc = [20, 25, 40, 50][rand(0, 3)];
    lista.push({ tema: 'Porcentajes', texto: `Playera de $${precio} con ${desc}% OFF. ¿Cuánto PAGAS?`, contexto: 'Ojo: NO te piden el descuento, te piden lo que pagas', respuesta: precio - (precio * desc / 100), respuestaTexto: (precio - (precio * desc / 100)).toString() });
    const precio2 = rand(10, 40) * 10;
    const desc2 = [10, 20, 50][rand(0, 2)];
    lista.push({ tema: 'Porcentajes', texto: `Tenis de $${precio2} con ${desc2}% OFF. ¿Cuánto es el DESCUENTO?`, contexto: 'Aquí SÍ te piden el descuento', respuesta: precio2 * desc2 / 100, respuestaTexto: (precio2 * desc2 / 100).toString() });
    const validos = [[90, 10, 100], [160, 20, 200], [150, 25, 200], [200, 50, 400]];
    const inv = validos[rand(0, validos.length - 1)];
    lista.push({ tema: 'Porcentajes', texto: `Pagaste $${inv[0]} con ${inv[1]}% OFF. ¿Cuánto costaba sin descuento?`, respuesta: inv[2], respuestaTexto: inv[2].toString() });

    // Mezclar para que no salgan en orden
    return mezclar(lista);
}

function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}