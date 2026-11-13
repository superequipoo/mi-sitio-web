document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    const btnComprobar = document.getElementById('btn-comprobar-respuesta');
    const btnAyuda = document.getElementById('btn-ayuda');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnMision = document.getElementById('btn-comprobar-mision');
    const btnPaso = document.getElementById('btn-siguiente-paso');
    const btnTodos = document.getElementById('btn-ver-todos');
    const input = document.getElementById('respuesta');

    if (btnStart) btnStart.addEventListener('click', iniciar);
    if (btnComprobar) btnComprobar.addEventListener('click', comprobar);
    if (btnAyuda) btnAyuda.addEventListener('click', mostrarAyuda);
    if (btnSiguiente) btnSiguiente.addEventListener('click', generarOperacion);
    if (btnMision) btnMision.addEventListener('click', comprobarMision);
    if (btnPaso) btnPaso.addEventListener('click', mostrarSiguientePaso);
    if (btnTodos) btnTodos.addEventListener('click', mostrarTodosPasos);
    if (input) input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') comprobar();
    });

    const categorias = ['todas', 'cuadrados', 'cubos', 'raices', 'leyes'];
    categorias.forEach(cat => {
        const btn = document.getElementById('btn-' + cat);
        if (btn) btn.addEventListener('click', () => setCategoria(cat));
    });
});

let categoria = 'todas';
let practicadas = 0;
let correctas = 0;
let nivel = 1;
let jugando = false;
let respuestaCorrecta = 0;
let pasosActuales = [];
let pasoIndex = 0;
let yaResuelto = false;

const INFOS = {
    'todas': 'Vas a practicar potencias y raíces. La idea es que entiendas qué significa el numerito chiquito de arriba, no solo memorices el resultado.',
    'cuadrados': 'CUADRADO: El ² significa que el número se multiplica POR SÍ MISMO 2 veces. Ej: 7² = 7 × 7 = 49. No es 7 × 2, eso es lo que más confunde.',
    'cubos': 'CUBO: El ³ significa que el número se multiplica POR SÍ MISMO 3 veces. Ej: 3³ = 3 × 3 × 3 = 27. No es 3 × 3.',
    'raices': 'RAÍZ: Es lo contrario de la potencia. √ es preguntar: ¿qué número × sí mismo da esto? Ej: √64 = 8, porque 8 × 8 = 64. ∛ es lo mismo pero 3 veces.',
    'leyes': 'LEYES DE EXPONENTES: Si multiplicas misma base, SUMAS exponentes. Si divides, RESTAS. Si es potencia de potencia, MULTIPLICAS. Ej: 2² × 2³ = 2⁵.'
};

function setCategoria(nuevaCat) {
    categoria = nuevaCat;
    const tipo = document.getElementById('tipo');
    const textos = {
        'todas': 'Categoría: Todas - Cuadrados, cubos, raíces y leyes',
        'cuadrados': 'Categoría: Cuadrados - Ej: 7² = 49',
        'cubos': 'Categoría: Cubos - Ej: 3³ = 27',
        'raices': 'Categoría: Raíces - Ej: √64 = 8',
        'leyes': 'Categoría: Leyes de exponentes - Ej: 2³ × 2² = 2⁵'
    };
    if (tipo) tipo.textContent = textos[categoria];
    document.getElementById('info-texto').textContent = INFOS[categoria];

    document.querySelectorAll('.btn-aventura').forEach(b => b.style.borderColor = '#2a3a65');
    const btnActivo = document.getElementById('btn-' + categoria);
    if (btnActivo) btnActivo.style.borderColor = '#00ff88';

    document.getElementById('operacion').textContent = 'Presiona PRACTICAR';
    document.getElementById('pista').textContent = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('zona-pasos').style.display = 'none';
    document.getElementById('zona-input').style.display = 'none';
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-start').textContent = 'PRACTICAR ▶';
    jugando = false;
}

function iniciar() {
    if (jugando) return;
    jugando = true;
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('zona-input').style.display = 'block';
    generarOperacion();
}

function generarOperacion() {
    let cat = categoria;
    if (cat === 'todas') {
        const opciones = ['cuadrados', 'cubos', 'raices', 'leyes'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
        document.getElementById('info-texto').textContent = INFOS[cat];
    }

    let texto = '';
    let pista = '';
    let resultado = 0;
    let pasos = [];

    if (cat === 'cuadrados') {
        const a = rand(2, 15);
        texto = `${a}² = ?`;
        resultado = a * a;
        pista = `Recuerda: ${a}² NO es ${a} × 2, es ${a} × ${a}`;
        pasos = [
            `1️⃣ Tenemos: ${a}²`,
            `2️⃣ ¿Qué significa el ²? Que el ${a} se multiplica por sí mismo 2 veces`,
            `3️⃣ Entonces: ${a}² = ${a} × ${a}`,
            `4️⃣ Multiplica: ${a} × ${a} = ${a * a}`,
            `5️⃣ Resultado: ${a}² = ${a * a} ✅`
        ];
    } else if (cat === 'cubos') {
        const a = rand(2, 9);
        texto = `${a}³ = ?`;
        resultado = a * a * a;
        pista = `Recuerda: ${a}³ es ${a} × ${a} × ${a}, 3 veces`;
        pasos = [
            `1️⃣ Tenemos: ${a}³`,
            `2️⃣ ¿Qué significa el ³? Que el ${a} se multiplica por sí mismo 3 veces`,
            `3️⃣ Entonces: ${a}³ = ${a} × ${a} × ${a}`,
            `4️⃣ Paso a paso: ${a} × ${a} = ${a * a}, luego ${a * a} × ${a} = ${a * a * a}`,
            `5️⃣ Resultado: ${a}³ = ${a * a * a} ✅`
        ];
    } else if (cat === 'raices') {
        if (Math.random() < 0.7) {
            const a = rand(2, 15);
            texto = `√${a * a} = ?`;
            resultado = a;
            pista = `Piensa: ¿qué número × sí mismo da ${a * a}?`;
            pasos = [
                `1️⃣ Tenemos: √${a * a}`,
                `2️⃣ La raíz cuadrada pregunta: ¿qué número × sí mismo da ${a * a}?`,
                `3️⃣ Prueba: ${a} × ${a} = ${a * a} ¡Sí da!`,
                `4️⃣ Entonces la raíz deshace el cuadrado`,
                `5️⃣ Resultado: √${a * a} = ${a} ✅`
            ];
        } else {
            const b = rand(2, 6);
            texto = `∛${b * b * b} = ?`;
            resultado = b;
            pista = `Piensa: ¿qué número × 3 veces da ${b * b * b}?`;
            pasos = [
                `1️⃣ Tenemos: ∛${b * b * b} (raíz cúbica)`,
                `2️⃣ Pregunta: ¿qué número × sí mismo 3 veces da ${b * b * b}?`,
                `3️⃣ Prueba: ${b} × ${b} = ${b * b}, luego ${b * b} × ${b} = ${b * b * b}`,
                `4️⃣ Sí es ${b}`,
                `5️⃣ Resultado: ∛${b * b * b} = ${b} ✅`
            ];
        }
    } else if (cat === 'leyes') {
        const base = rand(2, 5);
        const tipoLey = Math.floor(Math.random() * 4);
        if (tipoLey === 0) {
            texto = `${base}² × ${base}³ = ${base}^?  (escribe solo el exponente)`;
            resultado = 5;
            pista = `Misma base y se multiplica: se SUMAN los exponentes`;
            pasos = [
                `1️⃣ Tenemos: ${base}² × ${base}³`,
                `2️⃣ Ley: si multiplicas y la base es la misma (${base}), SUMAS los exponentes`,
                `3️⃣ Exponentes: 2 + 3 = 5`,
                `4️⃣ Entonces: ${base}² × ${base}³ = ${base}⁵`,
                `5️⃣ Te piden solo el exponente: 5 ✅`
            ];
        } else if (tipoLey === 1) {
            texto = `${base}⁵ ÷ ${base}² = ${base}^?`;
            resultado = 3;
            pista = `Misma base y se divide: se RESTAN los exponentes`;
            pasos = [
                `1️⃣ Tenemos: ${base}⁵ ÷ ${base}²`,
                `2️⃣ Ley: si divides y la base es la misma, RESTAS los exponentes`,
                `3️⃣ Exponentes: 5 - 2 = 3`,
                `4️⃣ Entonces: ${base}⁵ ÷ ${base}² = ${base}³`,
                `5️⃣ Te piden solo el exponente: 3 ✅`
            ];
        } else if (tipoLey === 2) {
            texto = `(${base}²)³ = ${base}^?`;
            resultado = 6;
            pista = `Potencia de potencia: se MULTIPLICAN los exponentes`;
            pasos = [
                `1️⃣ Tenemos: (${base}²)³`,
                `2️⃣ Ley: potencia de potencia, MULTIPLICAS los exponentes`,
                `3️⃣ Exponentes: 2 × 3 = 6`,
                `4️⃣ Entonces: (${base}²)³ = ${base}⁶`,
                `5️⃣ Te piden solo el exponente: 6 ✅`
            ];
        } else {
            texto = `${base}⁰ = ?`;
            resultado = 1;
            pista = `Cualquier número a la 0 es 1`;
            pasos = [
                `1️⃣ Tenemos: ${base}⁰`,
                `2️⃣ Ley: todo número (que no sea 0) elevado a la 0 es 1`,
                `3️⃣ No importa que sea ${base}, 100 o 999`,
                `4️⃣ Es una regla, se memoriza`,
                `5️⃣ Resultado: ${base}⁰ = 1 ✅`
            ];
        }
    }

    respuestaCorrecta = resultado;
    pasosActuales = pasos;
    pasoIndex = 0;
    yaResuelto = false;

    document.getElementById('operacion').textContent = texto;
    document.getElementById('pista').textContent = pista;
    document.getElementById('feedback').textContent = '';
    document.getElementById('lista-pasos').innerHTML = '';
    document.getElementById('zona-pasos').style.display = 'none';
    document.getElementById('pasos-contador').textContent = '';
    const input = document.getElementById('respuesta');
    input.value = '';
    input.focus();
}

function mostrarAyuda() {
    document.getElementById('zona-pasos').style.display = 'block';
    if (pasoIndex === 0) mostrarSiguientePaso();
}

function mostrarSiguientePaso() {
    document.getElementById('zona-pasos').style.display = 'block';
    if (pasoIndex < pasosActuales.length) {
        const lista = document.getElementById('lista-pasos');
        const div = document.createElement('div');
        div.textContent = pasosActuales[pasoIndex];
        div.style.marginBottom = '6px';
        lista.appendChild(div);
        pasoIndex++;
        document.getElementById('pasos-contador').textContent = `Paso ${pasoIndex} de ${pasosActuales.length} - Sigue intentando, tú puedes`;
        if (pasoIndex === pasosActuales.length) {
            document.getElementById('pasos-contador').textContent = `Ya viste todos los pasos. Ahora intenta resolverlo tú`;
        }
    }
}

function mostrarTodosPasos() {
    document.getElementById('zona-pasos').style.display = 'block';
    const lista = document.getElementById('lista-pasos');
    lista.innerHTML = '';
    pasosActuales.forEach(p => {
        const div = document.createElement('div');
        div.textContent = p;
        div.style.marginBottom = '6px';
        lista.appendChild(div);
    });
    pasoIndex = pasosActuales.length;
    document.getElementById('pasos-contador').textContent = `Todos los pasos visibles. Léelos y luego haz el siguiente sin ayuda`;
}

function comprobar() {
    if (!jugando) return;
    const input = document.getElementById('respuesta');
    const valor = input.value.trim();
    const feedback = document.getElementById('feedback');

    if (valor === '') {
        feedback.textContent = '⚠️ Escribe tu respuesta primero. Si te atoras, dale a "Necesito ayuda"';
        feedback.style.color = '#ffaa00';
        return;
    }
    if (yaResuelto) {
        generarOperacion();
        return;
    }

    practicadas++;
    const num = Number(valor.replace(',', '.'));
    const correcto = Math.abs(num - respuestaCorrecta) < 0.01;

    if (correcto) {
        correctas++;
        if (correctas % 3 === 0) nivel++;
        feedback.textContent = `✅ ¡Bien! = ${respuestaCorrecta}. Ya llevas ${correctas} correctas. Dale a "Siguiente ejercicio" para seguir`;
        feedback.style.color = '#00ffc6';
        yaResuelto = true;
    } else {
        feedback.textContent = `❌ Casi. Tú pusiste ${num}, la correcta es ${respuestaCorrecta}. Mira los pasos de abajo para ver dónde te atoraste 👇`;
        feedback.style.color = '#ff4d4d';
        document.getElementById('zona-pasos').style.display = 'block';
        if (pasoIndex === 0) mostrarSiguientePaso();
        yaResuelto = true;
    }
    actualizarMarcador();
}

function actualizarMarcador() {
    document.getElementById('practicadas').textContent = practicadas;
    document.getElementById('correctas').textContent = correctas;
    document.getElementById('nivel').textContent = nivel;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function comprobarMision() {
    const resultado = document.getElementById('resultado');
    if (!jugando) {
        resultado.textContent = 'Presiona PRACTICAR para empezar';
        resultado.style.color = '#8aa0c6';
    } else if (correctas >= 5) {
        resultado.textContent = `🔥 ¡Misión cumplida! Ya hiciste ${correctas} correctas de ${practicadas}. Ya dominas potencias y raíces`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `Vas ${correctas}/5 correctas. Sigue practicando, usa los pasos poco a poco, no hay prisa`;
        resultado.style.color = '#00aaff';
    }
}