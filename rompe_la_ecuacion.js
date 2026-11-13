document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    const btnComprobar = document.getElementById('btn-comprobar-respuesta');
    const btnSec = document.getElementById('btn-secundaria');
    const btnPrepa = document.getElementById('btn-prepa');
    const btnExani = document.getElementById('btn-exani');
    const btnMision = document.getElementById('btn-comprobar-mision');
    const input = document.getElementById('respuesta');

    if (btnStart) btnStart.addEventListener('click', iniciar);
    if (btnComprobar) btnComprobar.addEventListener('click', comprobar);
    if (btnSec) btnSec.addEventListener('click', () => setModo('secundaria'));
    if (btnPrepa) btnPrepa.addEventListener('click', () => setModo('prepa'));
    if (btnExani) btnExani.addEventListener('click', () => setModo('exani'));
    if (btnMision) btnMision.addEventListener('click', comprobarMision);
    if (input) input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') comprobar();
    });
});

let modo = 'secundaria';
let nivel = 1;
let vidas = 3;
let puntos = 0;
let tiempo = 90;
let timer = null;
let jugando = false;
let respuestaCorrecta = 0;
let correctas = 0;
let total = 0;

function setModo(nuevoModo) {
    modo = nuevoModo;
    const tipo = document.getElementById('tipo');
    const textos = {
        'secundaria': 'Modo: Secundaria 3ero - Ecuaciones de 1 paso',
        'prepa': 'Modo: Prepa - Ecuaciones de 2 pasos y con paréntesis',
        'exani': 'Modo: EXANI II - Todo mezclado, con tiempo'
    };
    if (tipo) tipo.textContent = textos[modo];

    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const mapa = { 'secundaria': 'btn-secundaria', 'prepa': 'btn-prepa', 'exani': 'btn-exani' };
    const btnActivo = document.getElementById(mapa[modo]);
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';

    // Reiniciar partida
    reiniciarMarcador();
    document.getElementById('ecuacion').textContent = 'Presiona INICIAR';
    document.getElementById('pista').textContent = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('fin').style.display = 'none';
    document.getElementById('zona-input').style.display = 'none';
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-start').textContent = 'INICIAR ▶';
}

function reiniciarMarcador() {
    nivel = 1;
    vidas = 3;
    puntos = 0;
    tiempo = 90;
    correctas = 0;
    total = 0;
    jugando = false;
    if (timer) clearInterval(timer);
    actualizarMarcador();
}

function iniciar() {
    if (jugando) return;
    reiniciarMarcador();
    jugando = true;
    document.getElementById('fin').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('zona-input').style.display = 'block';

    generarEcuacion();

    timer = setInterval(() => {
        tiempo--;
        document.getElementById('tiempo').textContent = tiempo;
        if (tiempo <= 10) document.getElementById('tiempo').style.color = '#ff4d4d';
        else document.getElementById('tiempo').style.color = '#fff';
        if (tiempo <= 0) terminarJuego();
    }, 1000);
}

function generarEcuacion() {
    let x = rand(2, 12);
    let a, b, texto, pista;

    if (modo === 'secundaria') {
        // Nivel 1-2: x + a = b / x - a = b / a*x = b
        const op = Math.floor(Math.random() * 3);
        if (op === 0) { a = rand(2, 15); texto = `x + ${a} = ${x + a}`; pista = `Pista: Pasa el ${a} restando: x = ${x + a} - ${a}`; }
        else if (op === 1) { a = rand(2, 10); texto = `x - ${a} = ${x - a + a - a + x - a + 0}`; texto = `x - ${a} = ${x}`; pista = `Pista: Si x es ${x + a}, entonces ${x + a} - ${a} = ${x}`; x = x + a; texto = `x - ${a} = ${x - a}`; pista = `Pista: Pasa el ${a} sumando`; }
        else { a = rand(2, 9); texto = `${a}x = ${a * x}`; pista = `Pista: Pasa el ${a} dividiendo: x = ${a * x} ÷ ${a}`; }
        // Corregir caso x - a para que no salga negativo feo
        if (op === 1) {
            // Ya lo dejamos bien arriba
        }
    } else if (modo === 'prepa') {
        // 2 pasos: ax + b = c / ax - b = c / con paréntesis
        const op = Math.floor(Math.random() * 3);
        if (op === 0) { a = rand(2, 6); b = rand(2, 10); texto = `${a}x + ${b} = ${a * x + b}`; pista = `Pista: Primero pasa el ${b} restando, luego el ${a} dividiendo`; }
        else if (op === 1) { a = rand(2, 6); b = rand(2, 10); texto = `${a}x - ${b} = ${a * x - b}`; pista = `Pista: Primero pasa el ${b} sumando, luego el ${a} dividiendo`; }
        else { a = rand(2, 5); b = rand(2, 6); texto = `${a}(x + ${b}) = ${a * (x + b)}`; pista = `Pista: Divide todo entre ${a} primero: x + ${b} = ${x + b}`; }
    } else {
        // EXANI: mezclado + más difícil
        const op = Math.floor(Math.random() * 4);
        if (op === 0) { a = rand(2, 9); b = rand(3, 15); texto = `${a}x + ${b} = ${a * x + b}`; pista = 'Pista EXANI: Despeja en 2 pasos'; }
        else if (op === 1) { a = rand(2, 6); texto = `2x + x = ${3 * x}`; pista = 'Pista: 2x + x = 3x'; x = x; respuestaCorrecta = x; }
        else if (op === 2) { a = rand(2, 5); b = rand(2, 8); texto = `${a}x - ${b}x = ${a * x - b * x}`; pista = `Pista: ${a}x - ${b}x = ${a - b}x`; }
        else { a = rand(2, 10); texto = `x ÷ ${a} = ${Math.floor(x / 1)}`; texto = `x ÷ ${a} = ${x}`; pista = `Pista: x = ${x} × ${a} = ${x * a}`; x = x * a; texto = `x ÷ ${a} = ${x / a}`; }
        if (op !== 1 && op !== 3) {
            // x ya está definido
        }
    }

    respuestaCorrecta = x;
    document.getElementById('ecuacion').textContent = texto;
    document.getElementById('pista').textContent = pista;
    const input = document.getElementById('respuesta');
    input.value = '';
    input.focus();
}

function comprobar() {
    if (!jugando) return;
    const input = document.getElementById('respuesta');
    const valor = input.value.trim();
    const feedback = document.getElementById('feedback');

    if (valor === '') {
        feedback.textContent = '⚠️ Escribe x = ? primero';
        feedback.style.color = '#ffaa00';
        return;
    }

    total++;
    const num = Number(valor);

    if (num === respuestaCorrecta) {
        correctas++;
        puntos += 10 + (nivel * 2);
        nivel++;
        feedback.textContent = `💥 ¡ROTA! x = ${respuestaCorrecta} era correcto. Subes a nivel ${nivel}`;
        feedback.style.color = '#00ffc6';
    } else {
        vidas--;
        feedback.textContent = `❌ No era. x = ${respuestaCorrecta}. Te quedan ${vidas} vidas`;
        feedback.style.color = '#ff4d4d';
    }

    actualizarMarcador();

    if (vidas <= 0) {
        terminarJuego();
    } else {
        generarEcuacion();
    }
}

function terminarJuego() {
    clearInterval(timer);
    jugando = false;
    document.getElementById('zona-input').style.display = 'none';
    const fin = document.getElementById('fin');
    fin.style.display = 'block';
    if (tiempo <= 0) {
        fin.textContent = `⏰ ¡Tiempo! Llegaste a nivel ${nivel} | ${correctas}/${total} correctas | ${puntos} puntos`;
    } else {
        fin.textContent = `💀 Sin vidas. Llegaste a nivel ${nivel} | ${correctas}/${total} correctas | ${puntos} puntos`;
    }
    fin.style.color = nivel >= 5 ? '#00ffc6' : '#ff4d4d';
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-start').textContent = 'JUGAR DE NUEVO ↻';
}

function actualizarMarcador() {
    document.getElementById('nivel').textContent = nivel;
    document.getElementById('vidas').textContent = vidas;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('tiempo').textContent = tiempo;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function comprobarMision() {
    const resultado = document.getElementById('resultado');
    if (jugando) {
        resultado.textContent = `Vas en nivel ${nivel} con ${puntos} puntos y ${vidas} vidas. ¡Sigue rompiendo!`;
        resultado.style.color = '#00aaff';
    } else if (total === 0) {
        resultado.textContent = 'Presiona INICIAR para empezar a romper ecuaciones';
        resultado.style.color = '#8aa0c6';
    } else if (nivel >= 5) {
        resultado.textContent = `🔥 ¡Misión cumplida! Llegaste a nivel ${nivel} con ${correctas}/${total} correctas`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `❌ Te faltó: nivel ${nivel}. Llega a nivel 5 para pasar. Lee la pista, ahí está el truco`;
        resultado.style.color = '#ff4d4d';
    }
}