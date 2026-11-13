document.addEventListener('DOMContentLoaded', () => {
    const btnJugar = document.getElementById('btn-jugar');
    const btnSec = document.getElementById('btn-secundaria');
    const btnPrepa = document.getElementById('btn-prepa');
    const btnComprobar = document.getElementById('btn-comprobar');

    if (btnJugar) btnJugar.addEventListener('click', iniciar);
    if (btnSec) btnSec.addEventListener('click', () => setNivel('secundaria'));
    if (btnPrepa) btnPrepa.addEventListener('click', () => setNivel('prepa'));
    if (btnComprobar) btnComprobar.addEventListener('click', comprobarMision);
});

let nivel = 'secundaria';
let puntos = 0;
let vidas = 3;
let racha = 0;
let tiempo = 60;
let timer = null;
let spawnTimer = null;
let jugando = false;
let respuestaCorrecta = 0;
let totalIntentos = 0;
let aciertos = 0;

function setNivel(nuevoNivel) {
    nivel = nuevoNivel;
    const tipo = document.getElementById('tipo');
    if (nivel === 'secundaria') {
        tipo.textContent = 'Nivel: Secundaria 3ero - Operaciones básicas';
    } else {
        tipo.textContent = 'Nivel: Prepa - Porcentajes, potencias y jerarquía';
    }
    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const btnActivo = document.getElementById(nivel === 'secundaria' ? 'btn-secundaria' : 'btn-prepa');
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';
}

function iniciar() {
    if (jugando) return;
    jugando = true;
    puntos = 0;
    vidas = 3;
    racha = 0;
    tiempo = 60;
    totalIntentos = 0;
    aciertos = 0;
    actualizarMarcador();

    const centro = document.getElementById('centro');
    if (centro) centro.style.display = 'none';
    document.getElementById('fin').style.display = 'none';
    document.getElementById('resultado').textContent = '';
    document.getElementById('pregunta').textContent = '¡Atrapa el resultado!';

    generarPregunta();

    // Cae un globo cada 1.2s
    spawnTimer = setInterval(() => {
        if (jugando) crearGlobo();
    }, 1200);
    crearGlobo();

    // Temporizador
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
    clearInterval(spawnTimer);
    jugando = false;
    // Borrar globos que queden
    document.querySelectorAll('.globo').forEach(g => g.remove());

    const fin = document.getElementById('fin');
    fin.style.display = 'block';
    fin.textContent = `🏁 Fin: ${aciertos}/${totalIntentos} atrapados | ${puntos} puntos | Racha: ${racha}`;
    fin.style.color = totalIntentos > 0 && aciertos >= totalIntentos * 0.6 ? '#00ffc6' : '#ff4d4d';

    const centro = document.getElementById('centro');
    if (centro) {
        centro.style.display = 'block';
        centro.innerHTML = '<button id="btn-jugar-2" class="btn-comprobar">JUGAR DE NUEVO ↻</button>';
        document.getElementById('btn-jugar-2').addEventListener('click', iniciar);
    }
    document.getElementById('pregunta').textContent = '⏰ ¡Tiempo!';
}

function generarPregunta() {
    let a, b, texto, resultado;

    if (nivel === 'secundaria') {
        const op = Math.floor(Math.random() * 4);
        if (op === 0) { a = rand(5, 50); b = rand(5, 50); texto = `${a} + ${b} = ?`; resultado = a + b; }
        else if (op === 1) { a = rand(20, 80); b = rand(5, a); texto = `${a} - ${b} = ?`; resultado = a - b; }
        else if (op === 2) { a = rand(3, 12); b = rand(3, 12); texto = `${a} × ${b} = ?`; resultado = a * b; }
        else { a = rand(2, 12); b = rand(2, 12); texto = `${a * b} ÷ ${a} = ?`; resultado = b; }
    } else {
        const op = Math.floor(Math.random() * 4);
        if (op === 0) { a = rand(10, 50) * 10; b = [10, 20, 25, 50][rand(0, 3)]; texto = `${b}% de ${a} = ?`; resultado = a * b / 100; }
        else if (op === 1) { a = rand(2, 9); texto = `${a}² = ?`; resultado = a * a; }
        else if (op === 2) { a = rand(5, 20); b = rand(2, 9); texto = `${a} + ${b} × 2 = ?`; resultado = a + b * 2; }
        else { a = rand(3, 9); b = rand(2, 9); texto = `${a} × ${b} - ${a} = ?`; resultado = a * b - a; }
    }

    respuestaCorrecta = resultado;
    document.getElementById('pregunta').textContent = texto;
}

function crearGlobo() {
    if (!jugando) return;
    const area = document.getElementById('area');
    if (!area) return;

    // 1 de cada 3 globos es el correcto, los demás son distractores
    const esCorrecto = Math.random() < 0.35;
    let valor;
    if (esCorrecto) {
        valor = respuestaCorrecta;
    } else {
        do {
            valor = respuestaCorrecta + rand(-12, 12);
        } while (valor === respuestaCorrecta || valor < 0);
    }

    const globo = document.createElement('div');
    globo.className = 'globo';
    globo.textContent = valor;
    globo.dataset.valor = valor;
    globo.dataset.correcto = esCorrecto ? '1' : '0';

    const left = rand(5, 85);
    globo.style.cssText = `position:absolute; left:${left}%; top:-60px; width:58px; height:58px; background:${esCorrecto ? '#00aaff' : '#1a2340'}; border:2px solid ${esCorrecto ? '#00ff88' : '#2a3a65'}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px; color:#fff; cursor:pointer; z-index:10;`;

    globo.addEventListener('click', () => atraparGlobo(globo));
    area.appendChild(globo);

    // Animación de caída
    let top = -60;
    const velocidad = nivel === 'prepa' ? rand(2, 4) : rand(1, 3);
    const caida = setInterval(() => {
        if (!jugando) { clearInterval(caida); return; }
        top += velocidad;
        globo.style.top = top + 'px';
        // Si el globo correcto se va sin atraparlo, pierdes racha pero no vida
        if (top > 400) {
            clearInterval(caida);
            if (globo.dataset.correcto === '1') {
                racha = 0;
                actualizarMarcador();
            }
            globo.remove();
        }
    }, 20);
}

function atraparGlobo(globo) {
    if (!jugando) return;
    totalIntentos++;
    const esCorrecto = globo.dataset.correcto === '1';

    if (esCorrecto) {
        aciertos++;
        puntos += 10 + racha;
        racha++;
        globo.style.background = '#00ff88';
        globo.style.color = '#000';
        setTimeout(() => {
            globo.remove();
            generarPregunta(); // Nueva pregunta al acertar
        }, 200);
    } else {
        vidas--;
        racha = 0;
        globo.style.background = '#ff2d55';
        setTimeout(() => globo.remove(), 200);
        if (vidas <= 0) {
            document.getElementById('pregunta').textContent = '💀 Te quedaste sin vidas';
            terminarJuego();
            return;
        }
    }
    actualizarMarcador();
}

function actualizarMarcador() {
    document.getElementById('tiempo').textContent = tiempo;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('vidas').textContent = vidas;
    document.getElementById('racha').textContent = racha;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function comprobarMision() {
    const resultado = document.getElementById('resultado');
    if (jugando) {
        resultado.textContent = `Vas en ${puntos} puntos, ${aciertos} atrapados, ${vidas} vidas. ¡Sigue!`;
        resultado.style.color = '#00aaff';
    } else if (totalIntentos === 0) {
        resultado.textContent = 'Presiona JUGAR para empezar';
        resultado.style.color = '#8aa0c6';
    } else if (totalIntentos > 0 && aciertos >= totalIntentos * 0.6) {
        resultado.textContent = `🔥 ¡Misión cumplida! Atrapaste ${aciertos}/${totalIntentos} con ${puntos} puntos`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `❌ Te faltó: ${aciertos}/${totalIntentos}. No hagas clic en cualquier globo, calcula primero`;
        resultado.style.color = '#ff4d4d';
    }
}