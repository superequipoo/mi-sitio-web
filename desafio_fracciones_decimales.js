console.log("✅ JS DE DESAFÍO FRACCIONES CARGADO");

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
    conectar('btn-conversion', () => setCategoria('conversion'));
    conectar('btn-suma', () => setCategoria('suma'));
    conectar('btn-simplifica', () => setCategoria('simplifica'));

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
let respuestaCorrecta = 0; // valor decimal para comparar
let respuestaTexto = ''; // texto que se muestra como correcta
let tipoRespuesta = 'decimal'; // 'decimal' o 'fraccion'
let tiempo = 60;
let timer = null;
const TOTAL_RETOS = 10;

function setCategoria(nuevaCat) {
    if (jugando) return;
    categoria = nuevaCat;
    const textos = {
        'todas': 'Categoría: Todas - Conversión, suma y simplificación',
        'conversion': 'Categoría: Solo Conversión - Fracción a decimal y al revés',
        'suma': 'Categoría: Solo Suma / Resta - Mismo denominador',
        'simplifica': 'Categoría: Solo Simplificar - Deja la fracción más chica'
    };
    document.getElementById('tipo').textContent = textos[categoria];

    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const btnActivo = document.getElementById('btn-' + categoria);
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';

    document.getElementById('operacion').textContent = 'Presiona EMPEZAR DESAFÍO';
    document.getElementById('feedback').textContent = '';
    document.getElementById('instruccion-respuesta').textContent = '';
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
        const opciones = ['conversion', 'suma', 'simplifica'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
    }

    let texto = '';
    let instruccion = '';
    respuestaCorrecta = 0;
    respuestaTexto = '';
    tipoRespuesta = 'decimal';

    if (cat === 'conversion') {
        // Fracciones que dan decimales exactos
        const datos = [
            [1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [1, 5, 0.2],
            [2, 5, 0.4], [3, 5, 0.6], [4, 5, 0.8], [1, 10, 0.1],
            [3, 10, 0.3], [7, 10, 0.7], [1, 8, 0.125], [3, 8, 0.375]
        ];
        const d = datos[rand(0, datos.length - 1)];
        if (Math.random() < 0.5) {
            texto = `${d[0]}/${d[1]} = ? en decimal`;
            instruccion = 'Escribe el decimal, ej: 0.5';
            respuestaCorrecta = d[2];
            respuestaTexto = d[2].toString();
            tipoRespuesta = 'decimal';
        } else {
            texto = `${d[2]} = ? en fracción`;
            instruccion = 'Escribe la fracción, ej: 1/2';
            respuestaCorrecta = d[2];
            respuestaTexto = `${d[0]}/${d[1]}`;
            tipoRespuesta = 'fraccion';
        }
    } else if (cat === 'suma') {
        const denom = [2, 3, 4, 5, 8, 10][rand(0, 5)];
        const n1 = rand(1, denom - 1);
        const n2 = rand(1, denom - n1);
        const esSuma = Math.random() < 0.6;
        if (esSuma) {
            texto = `${n1}/${denom} + ${n2}/${denom} = ?`;
            instruccion = 'Escribe la fracción, ej: 3/4';
            respuestaCorrecta = (n1 + n2) / denom;
            respuestaTexto = `${n1 + n2}/${denom}`;
            tipoRespuesta = 'fraccion';
        } else {
            const mayor = Math.max(n1, n2);
            const menor = Math.min(n1, n2);
            texto = `${mayor}/${denom} - ${menor}/${denom} = ?`;
            instruccion = 'Escribe la fracción, ej: 1/4';
            respuestaCorrecta = (mayor - menor) / denom;
            respuestaTexto = `${mayor - menor}/${denom}`;
            tipoRespuesta = 'fraccion';
        }
    } else if (cat === 'simplifica') {
        const datos = [
            [2, 4, 1, 2], [4, 6, 2, 3], [6, 8, 3, 4], [3, 9, 1, 3],
            [4, 10, 2, 5], [6, 10, 3, 5], [8, 12, 2, 3], [5, 10, 1, 2],
            [4, 8, 1, 2], [9, 12, 3, 4]
        ];
        const d = datos[rand(0, datos.length - 1)];
        texto = `Simplifica: ${d[0]}/${d[1]} = ?`;
        instruccion = 'Escribe la fracción simplificada, ej: 1/2';
        respuestaCorrecta = d[2] / d[3];
        respuestaTexto = `${d[2]}/${d[3]}`;
        tipoRespuesta = 'fraccion';
    }

    document.getElementById('operacion').textContent = texto;
    document.getElementById('instruccion-respuesta').textContent = instruccion;
    document.getElementById('pista').textContent = `Reto ${reto} de ${TOTAL_RETOS} - Sin pasos, tú solo`;
    const input = document.getElementById('respuesta');
    input.value = '';
    input.focus();
}

function comprobar() {
    if (!jugando) return;
    const input = document.getElementById('respuesta');
    const valor = input.value.trim().replace(',', '.');
    const feedback = document.getElementById('feedback');

    if (valor === '') {
        feedback.textContent = '⚠️ Escribe tu respuesta primero. Ej: 0.5 o 1/2';
        feedback.style.color = '#ffaa00';
        return;
    }

    // Acepta tanto decimal como fracción: si escribe "1/2" lo convertimos a 0.5
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

    const correcto = Math.abs(numUsuario - respuestaCorrecta) < 0.01;

    if (correcto) {
        correctas++;
        puntos += 10 + Math.max(0, Math.floor(tiempo / 10));
        feedback.textContent = `✅ ¡Correcto! = ${respuestaTexto}. + puntos`;
        feedback.style.color = '#00ffc6';
    } else {
        vidas--;
        feedback.textContent = `❌ No era. Era ${respuestaTexto}. Te quedan ${vidas} vidas`;
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
        texto.textContent = `Lograste ${correctas}/${reto} correctas con ${puntos} puntos. El tiempo te ganó esta vez.`;
        medalla.textContent = '⏱';
    } else if (motivo === 'vidas') {
        titulo.textContent = '💔 Te quedaste sin vidas';
        texto.textContent = `Lograste ${correctas}/${TOTAL_RETOS} correctas con ${puntos} puntos. Vuelve a la práctica con pasos y regresa más fuerte.`;
        medalla.textContent = '💔';
    } else {
        if (correctas >= 9) {
            titulo.textContent = '🏆 ¡LEYENDA DE LAS FRACCIONES!';
            medalla.textContent = '🏆';
        } else if (correctas >= 7) {
            titulo.textContent = '🥇 ¡Maestro de Fracciones!';
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