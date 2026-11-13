console.log("✅ JS DE DESAFÍO ÁLGEBRA CARGADO");

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
    conectar('btn-lineal', () => setCategoria('lineal'));
    conectar('btn-cuadratica', () => setCategoria('cuadratica'));
    conectar('btn-pitagoras', () => setCategoria('pitagoras'));
    conectar('btn-sistema', () => setCategoria('sistema'));

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
let tiempo = 60;
let timer = null;
const TOTAL_RETOS = 10;

function setCategoria(nuevaCat) {
    if (jugando) return;
    categoria = nuevaCat;
    const textos = {
        'todas': 'Categoría: Todas - Lineal, x², Pitágoras y sistema',
        'lineal': 'Categoría: Solo Lineal - Ej: 3x + 4 = 19',
        'cuadratica': 'Categoría: Solo x² - Ej: x² = 49',
        'pitagoras': 'Categoría: Solo Pitágoras - a² + b² = c²',
        'sistema': 'Categoría: Solo Sistema - 2 ecuaciones'
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
    puntos = 0; vidas = 3; reto = 0; correctas = 0; tiempo = 60;
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
        const opciones = ['lineal', 'cuadratica', 'pitagoras', 'sistema'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
    }

    let texto = '';
    let resultado = 0;

    if (cat === 'lineal') {
        const x = rand(2, 15);
        const a = rand(2, 9);
        const b = rand(2, 15);
        if (Math.random() < 0.5) {
            texto = `${a}x + ${b} = ${a * x + b}   ¿x = ?`;
        } else {
            texto = `${a}x - ${b} = ${a * x - b}   ¿x = ?`;
        }
        resultado = x;
    } else if (cat === 'cuadratica') {
        const x = rand(3, 15);
        if (Math.random() < 0.5) {
            texto = `x² = ${x * x}   ¿x = ?`;
        } else {
            const a = rand(2, 10);
            texto = `x² + ${a} = ${x * x + a}   ¿x = ?`;
        }
        resultado = x;
    } else if (cat === 'pitagoras') {
        const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
        const t = triples[rand(0, triples.length - 1)];
        if (Math.random() < 0.5) {
            texto = `Catetos ${t[0]} y ${t[1]}. ¿Hipotenusa = ?`;
            resultado = t[2];
        } else {
            texto = `Hipotenusa ${t[2]}, cateto ${t[0]}. ¿Otro cateto = ?`;
            resultado = t[1];
        }
    } else if (cat === 'sistema') {
        const x = rand(3, 15);
        const y = rand(2, 12);
        const suma = x + y;
        const resta = x - y;
        if (Math.random() < 0.5) {
            texto = `x + y = ${suma} , x - y = ${resta}   ¿x = ?`;
            resultado = x;
        } else {
            texto = `x + y = ${suma} , x - y = ${resta}   ¿y = ?`;
            resultado = y;
        }
    }

    respuestaCorrecta = resultado;
    document.getElementById('operacion').textContent = texto;
    document.getElementById('pista').textContent = `Reto ${reto} de ${TOTAL_RETOS} - Sin pasos, tú solo`;
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
        puntos += 10 + Math.max(0, Math.floor(tiempo / 10));
        feedback.textContent = `✅ ¡Correcto! = ${respuestaCorrecta}. + puntos`;
        feedback.style.color = '#00ffc6';
    } else {
        vidas--;
        feedback.textContent = `❌ No era. Era ${respuestaCorrecta}. Te quedan ${vidas} vidas`;
        feedback.style.color = '#ff4d4d';
    }

    actualizarMarcador();

    if (vidas <= 0) {
        setTimeout(() => terminarDesafio('vidas'), 800);
    } else if (reto >= TOTAL_RETOS) {
        setTimeout(() => terminarDesafio('completo'), 800);
    } else {
        setTimeout(() => siguienteReto(), 800);
    }
}

function actualizarMarcador() {
    document.getElementById('reto-actual').textContent = reto;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('vidas').textContent = vidas;
    document.getElementById('tiempo').textContent = tiempo;
    document.getElementById('barra-progreso').style.width = (reto / TOTAL_RETOS * 100) + '%';
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
        texto.textContent = `Lograste ${correctas}/${reto} correctas con ${puntos} puntos. El tiempo te ganó esta vez.`;
        medalla.textContent = '⏱';
    } else if (motivo === 'vidas') {
        titulo.textContent = '💔 Te quedaste sin vidas';
        texto.textContent = `Lograste ${correctas}/${TOTAL_RETOS} correctas con ${puntos} puntos. Vuelve a la práctica con pasos y regresa más fuerte.`;
        medalla.textContent = '💔';
    } else {
        if (correctas >= 9) {
            titulo.textContent = '🏆 ¡LEYENDA DEL ÁLGEBRA!';
            medalla.textContent = '🏆';
        } else if (correctas >= 7) {
            titulo.textContent = '🥇 ¡Maestro de Álgebra!';
            medalla.textContent = '🥇';
        } else if (correctas >= 5) {
            titulo.textContent = '🥈 ¡Bien hecho!';
            medalla.textContent = '🥈';
        } else {
            titulo.textContent = '🥉 Sigue practicando';
            medalla.textContent = '🥉';
        }
        texto.textContent = `Terminaste: ${correctas}/10 correctas, ${puntos} puntos, te sobraron ${tiempo}s y ${vidas} vidas.`;
    }
    document.getElementById('operacion').textContent = 'Desafío terminado';
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}