console.log("✅ JS DE DESAFÍO POTENCIAS CARGADO");

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
    conectar('btn-reintentar', reiniciar);

    conectar('btn-todas', () => setCategoria('todas'));
    conectar('btn-cuadrados', () => setCategoria('cuadrados'));
    conectar('btn-cubos', () => setCategoria('cubos'));
    conectar('btn-raices', () => setCategoria('raices'));
    conectar('btn-leyes', () => setCategoria('leyes'));

    const input = document.getElementById('respuesta');
    if (input) input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') comprobar();
    });
});

let categoria = 'todas';
let puntos = 0;
let vidas = 3;
let reto = 0;
let correctas = 0;
let jugando = false;
let respuestaCorrecta = 0;
let tiempo = 100;
let timer = null;
const TOTAL_RETOS = 20;
const TIEMPO_TOTAL = 100;

function setCategoria(nuevaCat) {
    if (jugando) return;
    categoria = nuevaCat;
    const textos = {
        'todas': 'Categoría: Todas - Cuadrados, cubos, raíces y leyes',
        'cuadrados': 'Categoría: Solo Cuadrados - Ej: 7² = 49',
        'cubos': 'Categoría: Solo Cubos - Ej: 3³ = 27',
        'raices': 'Categoría: Solo Raíces - Ej: √64 = 8',
        'leyes': 'Categoría: Solo Leyes - Ej: 2² × 2³ = 2^?'
    };
    document.getElementById('tipo').textContent = textos[categoria];

    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const btnActivo = document.getElementById('btn-' + categoria);
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';

    document.getElementById('operacion').textContent = 'Presiona EMPEZAR DESAFÍO';
    document.getElementById('feedback').textContent = '';
}

function iniciar() {
    if (jugando) return;
    puntos = 0; vidas = 3; reto = 0; correctas = 0; tiempo = TIEMPO_TOTAL;
    jugando = true;
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('zona-fin').style.display = 'none';
    document.getElementById('zona-input').style.display = 'block';
    document.getElementById('feedback').textContent = '';
    actualizarMarcador();
    iniciarTiempo();
    siguienteReto();
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
        document.getElementById('tiempo').textContent = tiempo;
        document.getElementById('barra-progreso').style.width = (tiempo / TIEMPO_TOTAL * 100) + '%';
        if (tiempo <= 10) document.getElementById('tiempo').style.color = '#ff4d4d';
        else document.getElementById('tiempo').style.color = '#fff';
        if (tiempo <= 0) terminarDesafio('tiempo');
    }, 1000);
}

function siguienteReto() {
    if (reto >= TOTAL_RETOS) {
        terminarDesafio('completo');
        return;
    }
    if (vidas <= 0) {
        terminarDesafio('vidas');
        return;
    }
    reto++;
    generarOperacion();
    actualizarMarcador();
}

function generarOperacion() {
    let cat = categoria;
    if (cat === 'todas') {
        const opciones = ['cuadrados', 'cubos', 'raices', 'leyes'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
    }

    let texto = '';
    let resultado = 0;

    if (cat === 'cuadrados') {
        const a = rand(2, 15);
        texto = `${a}² = ?`;
        resultado = a * a;
    } else if (cat === 'cubos') {
        const a = rand(2, 9);
        texto = `${a}³ = ?`;
        resultado = a * a * a;
    } else if (cat === 'raices') {
        if (Math.random() < 0.75) {
            const a = rand(2, 15);
            texto = `√${a * a} = ?`;
            resultado = a;
        } else {
            const b = rand(2, 6);
            texto = `∛${b * b * b} = ?`;
            resultado = b;
        }
    } else if (cat === 'leyes') {
        const base = rand(2, 5);
        const tipoLey = Math.floor(Math.random() * 4);
        if (tipoLey === 0) {
            texto = `${base}² × ${base}³ = ${base}^?`;
            resultado = 5;
        } else if (tipoLey === 1) {
            texto = `${base}⁵ ÷ ${base}² = ${base}^?`;
            resultado = 3;
        } else if (tipoLey === 2) {
            texto = `(${base}²)³ = ${base}^?`;
            resultado = 6;
        } else {
            texto = `${base}⁰ = ?`;
            resultado = 1;
        }
    }

    respuestaCorrecta = resultado;
    document.getElementById('operacion').textContent = texto;
    document.getElementById('pista').textContent = `Reto ${reto} de ${TOTAL_RETOS} - Rápido, sin calculadora`;
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
        feedback.textContent = '⚠️ Escribe tu respuesta primero';
        feedback.style.color = '#ffaa00';
        return;
    }

    const num = Number(valor.replace(',', '.'));
    const correcto = Math.abs(num - respuestaCorrecta) < 0.01;

    if (correcto) {
        correctas++;
        // Bonus por rapidez: si aún queda mucho tiempo, más puntos
        puntos += 10 + Math.floor(tiempo / 20);
        feedback.textContent = `✅ ¡Correcto! = ${respuestaCorrecta}. + puntos`;
        feedback.style.color = '#00ffc6';
    } else {
        vidas--;
        feedback.textContent = `❌ No era. Era ${respuestaCorrecta}. Te quedan ${vidas} vidas`;
        feedback.style.color = '#ff4d4d';
    }

    actualizarMarcador();

    if (vidas <= 0) {
        setTimeout(() => terminarDesafio('vidas'), 700);
    } else if (reto >= TOTAL_RETOS) {
        setTimeout(() => terminarDesafio('completo'), 700);
    } else {
        setTimeout(() => siguienteReto(), 700);
    }
}

function actualizarMarcador() {
    document.getElementById('reto-actual').textContent = reto;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('vidas').textContent = vidas;
    document.getElementById('tiempo').textContent = tiempo;
}

function terminarDesafio(motivo) {
    jugando = false;
    clearInterval(timer);
    document.getElementById('zona-input').style.display = 'none';
    document.getElementById('btn-start').style.display = 'none';
    const zonaFin = document.getElementById('zona-fin');
    zonaFin.style.display = 'block';
    const titulo = document.getElementById('titulo-fin');
    const texto = document.getElementById('texto-fin');
    const medalla = document.getElementById('medalla');

    if (motivo === 'tiempo') {
        titulo.textContent = '⏱ ¡Se acabó el tiempo!';
        texto.textContent = `Lograste ${correctas}/${reto} correctas con ${puntos} puntos en 100 segundos. ¡Casi lo logras!`;
        medalla.textContent = '⏱';
    } else if (motivo === 'vidas') {
        titulo.textContent = '💔 Te quedaste sin vidas';
        texto.textContent = `Lograste ${correctas}/${TOTAL_RETOS} correctas con ${puntos} puntos. Vuelve a la práctica con pasos y regresa más rápido.`;
        medalla.textContent = '💔';
    } else {
        if (correctas >= 18) {
            titulo.textContent = '🏆 ¡LEYENDA DE LAS POTENCIAS!';
            medalla.textContent = '🏆';
        } else if (correctas >= 15) {
            titulo.textContent = '🥇 ¡Maestro de Potencias!';
            medalla.textContent = '🥇';
        } else if (correctas >= 10) {
            titulo.textContent = '🥈 ¡Bien hecho!';
            medalla.textContent = '🥈';
        } else {
            titulo.textContent = '🥉 Sigue practicando';
            medalla.textContent = '🥉';
        }
        texto.textContent = `Terminaste: ${correctas}/20 correctas, ${puntos} puntos, te sobraron ${tiempo}s y ${vidas} vidas.`;
    }
    document.getElementById('operacion').textContent = 'Desafío terminado';
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}