console.log("✅ JS DE DESAFÍO PORCENTAJES CARGADO");

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
    conectar('btn-basico', () => setCategoria('basico'));
    conectar('btn-descuento', () => setCategoria('descuento'));
    conectar('btn-inverso', () => setCategoria('inverso'));

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
        'todas': 'Categoría: Todas - % básico, descuento, aumento e inverso',
        'basico': 'Categoría: Solo % Básico - Ej: 20% de 200 = ?',
        'descuento': 'Categoría: Solo Descuento - ¿Cuánto pagas al final?',
        'inverso': 'Categoría: Solo Inverso - Ya pagaste, ¿cuánto costaba?'
    };
    document.getElementById('tipo').textContent = textos[categoria];

    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const btnActivo = document.getElementById('btn-' + categoria);
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';

    document.getElementById('operacion').textContent = 'Presiona EMPEZAR DESAFÍO';
    document.getElementById('feedback').textContent = '';
    document.getElementById('oferta').textContent = 'Presiona EMPEZAR';
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
        const opciones = ['basico', 'descuento', 'descuento', 'inverso'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
    }

    let texto = '';
    let oferta = '';
    let resultado = 0;

    const productos = ['Playera', 'Tenis', 'Celular', 'Mochila', 'Sudadera', 'Audífonos', 'Reloj', 'Gorra'];

    if (cat === 'basico') {
        const porc = [10, 20, 25, 30, 40, 50, 60, 75][rand(0, 7)];
        const base = rand(2, 20) * 20;
        texto = `${porc}% de ${base} = ?`;
        oferta = `🧮 Calcula rápido: ${porc}% de ${base}`;
        resultado = base * porc / 100;
    } else if (cat === 'descuento') {
        const producto = productos[rand(0, productos.length - 1)];
        const precio = rand(10, 100) * 10;
        const desc = [10, 20, 25, 30, 40, 50][rand(0, 5)];
        const montoDesc = precio * desc / 100;

        if (Math.random() < 0.7) {
            // TRAMPA: la mayoría pregunta cuánto PAGAS, no el descuento
            texto = `${producto} de $${precio} con ${desc}% OFF. ¿Cuánto PAGAS?`;
            oferta = `🛍️ OFERTA: ${producto} $${precio} - ${desc}% OFF`;
            resultado = precio - montoDesc;
        } else {
            texto = `${producto} de $${precio} con ${desc}% OFF. ¿Cuánto es el DESCUENTO?`;
            oferta = `🛍️ OFERTA: ${producto} $${precio} - ${desc}% OFF`;
            resultado = montoDesc;
        }
    } else if (cat === 'inverso') {
        if (Math.random() < 0.5) {
            // Pagaste X con descuento, ¿cuánto costaba?
            const finales = [90, 80, 160, 200, 150, 240, 400, 350][rand(0, 7)];
            const desc = [10, 20, 25, 50][rand(0, 3)];
            const original = Math.round(finales / (1 - desc / 100));
            // Solo usamos los que dan exacto para no confundir
            const finalesValidos = [[90, 10, 100], [80, 20, 100], [160, 20, 200], [150, 25, 200], [200, 50, 400], [240, 20, 300], [350, 30, 500], [400, 20, 500]];
            const f = finalesValidos[rand(0, finalesValidos.length - 1)];
            texto = `Pagaste $${f[0]} con ${f[1]}% OFF. ¿Cuánto costaba sin descuento?`;
            oferta = `🧾 Pagaste $${f[0]} con ${f[1]}% OFF`;
            resultado = f[2];
        } else {
            // Aumento
            const precio = rand(10, 50) * 10;
            const porc = [10, 20, 25][rand(0, 2)];
            texto = `Unos tenis de $${precio} suben ${porc}%. ¿Cuánto cuestan ahora?`;
            oferta = `📈 AUMENTO: Tenis $${precio} + ${porc}%`;
            resultado = precio + (precio * porc / 100);
        }
    }

    respuestaCorrecta = resultado;
    document.getElementById('operacion').textContent = texto;
    document.getElementById('oferta').textContent = oferta;
    document.getElementById('pista').textContent = `Reto ${reto} de ${TOTAL_RETOS} - Lee bien: ¿te piden el descuento o lo que pagas?`;
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
        feedback.textContent = '⚠️ Escribe tu respuesta primero. Solo el número, sin $ ni %';
        feedback.style.color = '#ffaa00';
        return;
    }

    const num = Number(valor.replace(',', '.'));
    const correcto = Math.abs(num - respuestaCorrecta) < 0.5;

    if (correcto) {
        correctas++;
        puntos += 10 + Math.max(0, Math.floor(tiempo / 10));
        feedback.textContent = `✅ ¡Correcto! = ${respuestaCorrecta}. + puntos`;
        feedback.style.color = '#00ffc6';
    } else {
        vidas--;
        feedback.textContent = `❌ No era. Era ${respuestaCorrecta}. Te quedan ${vidas} vidas. Ojo: ¿te pedían descuento o lo que pagas?`;
        feedback.style.color = '#ff4d4d';
    }

    actualizarMarcador();

    if (vidas <= 0) {
        setTimeout(() => terminarDesafio('vidas'), 900);
    } else if (reto >= TOTAL_RETOS) {
        setTimeout(() => terminarDesafio('completo'), 900);
    } else {
        setTimeout(() => siguienteReto(), 900);
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
        texto.textContent = `Lograste ${correctas}/${reto} correctas con ${puntos} puntos. La tienda te ganó esta vez.`;
        medalla.textContent = '⏱';
    } else if (motivo === 'vidas') {
        titulo.textContent = '💔 Te quedaste sin vidas';
        texto.textContent = `Lograste ${correctas}/${TOTAL_RETOS} correctas con ${puntos} puntos. Vuelve a la práctica con pasos y regresa a la tienda más fuerte.`;
        medalla.textContent = '💔';
    } else {
        if (correctas >= 9) {
            titulo.textContent = '🏆 ¡LEYENDA DE LAS OFERTAS!';
            medalla.textContent = '🏆';
        } else if (correctas >= 7) {
            titulo.textContent = '🥇 ¡Cazador de Ofertas!';
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