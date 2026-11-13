document.addEventListener('DOMContentLoaded', () => {
    const btnJugar = document.getElementById('btn-jugar');
    const btnSec = document.getElementById('btn-secundaria');
    const btnPrepa = document.getElementById('btn-prepa');
    const btnExani = document.getElementById('btn-exani');
    const btnComprobar = document.getElementById('btn-comprobar');

    if (btnJugar) btnJugar.addEventListener('click', iniciar);
    if (btnSec) btnSec.addEventListener('click', () => setNivel('secundaria'));
    if (btnPrepa) btnPrepa.addEventListener('click', () => setNivel('prepa'));
    if (btnExani) btnExani.addEventListener('click', () => setNivel('exani'));
    if (btnComprobar) btnComprobar.addEventListener('click', comprobarMision);
});

let nivel = 'exani';
let puntos = 0;
let racha = 0;
let mejorRacha = 0;
let tiempo = 60;
let timer = null;
let respuestaCorrecta = 0;
let jugando = false;
let totalPreguntas = 0;
let correctas = 0;

function setNivel(nuevoNivel) {
    nivel = nuevoNivel;
    const tipo = document.getElementById('tipo');
    const nombres = {
        'secundaria': 'Nivel: Secundaria 3ero - Sumas, restas, multiplicaciones y fracciones fáciles',
        'prepa': 'Nivel: Prepa - Ecuaciones, porcentajes y potencias',
        'exani': 'Nivel: EXANI II - Todo mezclado, como en el examen real'
    };
    if (tipo) tipo.textContent = nombres[nivel];
    // Resaltar botón activo
    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const mapaBtn = { 'secundaria': 'btn-secundaria', 'prepa': 'btn-prepa', 'exani': 'btn-exani' };
    const btnActivo = document.getElementById(mapaBtn[nivel]);
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';
}

function iniciar() {
    if (jugando) return;
    jugando = true;
    puntos = 0;
    racha = 0;
    mejorRacha = 0;
    tiempo = 60;
    totalPreguntas = 0;
    correctas = 0;
    actualizarMarcador();
    document.getElementById('final').style.display = 'none';
    document.getElementById('resultado').textContent = '';
    document.getElementById('btn-jugar').textContent = 'JUGANDO...';

    generarPregunta();

    timer = setInterval(() => {
        tiempo--;
        document.getElementById('tiempo').textContent = tiempo;
        if (tiempo <= 10) document.getElementById('tiempo').style.color = '#ff4d4d';
        else document.getElementById('tiempo').style.color = '#fff';
        if (tiempo <= 0) terminarJuego();
    }, 1000);
}

function terminarJuego() {
    clearInterval(timer);
    jugando = false;
    document.getElementById('btn-jugar').textContent = 'JUGAR DE NUEVO ▶';
    document.getElementById('pregunta').textContent = '⏰ ¡Tiempo!';
    document.getElementById('opciones').innerHTML = '<button id="btn-jugar-2" class="btn-comprobar">JUGAR DE NUEVO ▶</button>';
    document.getElementById('btn-jugar-2').addEventListener('click', iniciar);
    const final = document.getElementById('final');
    final.style.display = 'block';
    final.textContent = `🏁 Terminaste: ${correctas}/${totalPreguntas} correctas | ${puntos} puntos | Mejor racha: ${mejorRacha}`;
    final.style.color = correctas >= totalPreguntas * 0.7 ? '#00ffc6' : '#ff4d4d';
}

function generarPregunta() {
    let a, b, texto, resultado;

    if (nivel === 'secundaria') {
        // Secundaria: operaciones básicas + fracciones simples
        const tipoOp = Math.floor(Math.random() * 4);
        if (tipoOp === 0) { a = rand(5, 50); b = rand(5, 50); texto = `${a} + ${b}`; resultado = a + b; }
        else if (tipoOp === 1) { a = rand(20, 80); b = rand(5, a); texto = `${a} - ${b}`; resultado = a - b; }
        else if (tipoOp === 2) { a = rand(3, 12); b = rand(3, 12); texto = `${a} × ${b}`; resultado = a * b; }
        else { a = rand(2, 9); b = rand(2, 9); texto = `¿Cuánto es 1/${a} + 1/${a}?`; resultado = 2; texto = `1/${a} + 1/${a} = ? / ${a}`; resultado = 2; } // truco: 2/a
    } else if (nivel === 'prepa') {
        // Prepa: porcentajes, potencias, ecuaciones
        const tipoOp = Math.floor(Math.random() * 4);
        if (tipoOp === 0) { a = rand(10, 50) * 10; b = [10, 20, 25, 50][rand(0, 3)]; texto = `${b}% de ${a}`; resultado = a * b / 100; }
        else if (tipoOp === 1) { a = rand(2, 9); texto = `${a}²`; resultado = a * a; }
        else if (tipoOp === 2) { a = rand(2, 9); b = rand(2, 9); texto = `x + ${a} = ${a + b}  ¿x = ?`; resultado = b; }
        else { a = rand(3, 15); b = rand(2, 6); texto = `${a} × ${b} + ${a}`; resultado = a * b + a; }
    } else {
        // EXANI: todo mezclado + jerarquía de operaciones
        const tipoOp = Math.floor(Math.random() * 5);
        if (tipoOp === 0) { a = rand(5, 20); b = rand(2, 9); texto = `${a} + ${b} × 2`; resultado = a + b * 2; }
        else if (tipoOp === 1) { a = rand(10, 40); texto = `√${a * a}`; resultado = a; }
        else if (tipoOp === 2) { a = rand(2, 12); b = rand(2, 12); texto = `${a} × ${b} - ${a}`; resultado = a * b - a; }
        else if (tipoOp === 3) { a = rand(20, 100); b = [10, 20, 25, 50][rand(0, 3)]; texto = `${b}% de ${a}`; resultado = a * b / 100; }
        else { a = rand(3, 9); texto = `${a}³`; resultado = a * a * a; }
    }

    respuestaCorrecta = resultado;
    document.getElementById('pregunta').textContent = texto;

    // Crear 4 opciones (1 correcta + 3 falsas)
    let opciones = new Set([resultado]);
    while (opciones.size < 4) {
        let falsa = resultado + rand(-10, 10);
        if (falsa !== resultado && falsa >= 0) opciones.add(falsa);
    }
    opciones = [...opciones].sort(() => Math.random() - 0.5);

    const divOpciones = document.getElementById('opciones');
    divOpciones.innerHTML = '';
    opciones.forEach(op => {
        const btn = document.createElement('button');
        btn.textContent = op;
        btn.className = 'btn-aventura';
        btn.style.minWidth = '70px';
        btn.style.fontSize = '18px';
        btn.addEventListener('click', () => responder(op, btn));
        divOpciones.appendChild(btn);
    });
}

function responder(opcion, btn) {
    if (!jugando) return;
    totalPreguntas++;
    if (opcion === respuestaCorrecta) {
        correctas++;
        puntos += 10 + racha; // Bonus por racha
        racha++;
        if (racha > mejorRacha) mejorRacha = racha;
        btn.style.background = '#00ff88';
        btn.style.color = '#000';
    } else {
        racha = 0;
        btn.style.background = '#ff2d55';
    }
    actualizarMarcador();
    setTimeout(() => generarPregunta(), 300);
}

function actualizarMarcador() {
    document.getElementById('tiempo').textContent = tiempo;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('racha').textContent = racha;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function comprobarMision() {
    const resultado = document.getElementById('resultado');
    if (jugando) {
        resultado.textContent = `Vas en ${puntos} puntos con racha de ${racha}. ¡Sigue!`;
        resultado.style.color = '#00aaff';
    } else if (totalPreguntas === 0) {
        resultado.textContent = 'Presiona JUGAR para empezar tu misión de 60 segundos';
        resultado.style.color = '#8aa0c6';
    } else if (correctas >= totalPreguntas * 0.7) {
        resultado.textContent = `🔥 ¡Misión cumplida! ${correctas}/${totalPreguntas} correctas, ${puntos} puntos`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `❌ Te faltó: ${correctas}/${totalPreguntas}. Cambia a Secundaria para practicar y vuelve a EXANI`;
        resultado.style.color = '#ff4d4d';
    }
}