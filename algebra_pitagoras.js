console.log("✅ JS DE ÁLGEBRA CARGADO");

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM listo, conectando botones...");

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
    conectar('btn-ayuda', mostrarAyuda);
    conectar('btn-siguiente', generarOperacion);
    conectar('btn-comprobar-mision', comprobarMision);
    conectar('btn-siguiente-paso', mostrarSiguientePaso);
    conectar('btn-ver-todos', mostrarTodosPasos);

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
let practicadas = 0;
let correctas = 0;
let nivel = 1;
let jugando = false;
let respuestaCorrecta = 0;
let pasosActuales = [];
let pasoIndex = 0;
let yaResuelto = false;

const INFOS = {
    'todas': 'Vas a practicar de todo: despejar X, sacar raíces y usar Pitágoras. La idea es que aprendas el procedimiento, no solo el resultado.',
    'lineal': 'ECUACIÓN LINEAL: Tiene la forma ax + b = c. La regla de oro: lo que está sumando pasa restando, lo que está multiplicando pasa dividiendo. Siempre haces lo contrario del otro lado.',
    'cuadratica': 'ECUACIÓN x²: Tiene la forma x² = número. Para quitar el ², sacas raíz cuadrada. Ej: si x² = 49, entonces x = √49 = 7, porque 7 × 7 = 49.',
    'pitagoras': 'PITÁGORAS: Solo sirve en triángulos rectángulos (los que tienen un ángulo de 90°). Fórmula: a² + b² = c², donde c es la hipotenusa, el lado más largo, frente al ángulo recto.',
    'sistema': 'SISTEMA: Son 2 ecuaciones con 2 incógnitas. Truco táctico: si sumas o restas las ecuaciones, una letra se cancela y te queda solo una X para despejar.'
};

function setCategoria(nuevaCat) {
    console.log("Clic en categoría: " + nuevaCat);
    categoria = nuevaCat;
    const tipo = document.getElementById('tipo');
    const textos = {
        'todas': 'Categoría: Todas - Lineal, cuadrática, Pitágoras y sistema',
        'lineal': 'Categoría: Ecuación Lineal - Ej: 2x + 3 = 11',
        'cuadratica': 'Categoría: Ecuación x² - Ej: x² = 49',
        'pitagoras': 'Categoría: Pitágoras - a² + b² = c²',
        'sistema': 'Categoría: Sistema mental - 2 ecuaciones, 2 incógnitas'
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
    console.log("Clic en PRACTICAR");
    if (jugando) return;
    jugando = true;
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('zona-input').style.display = 'block';
    generarOperacion();
}

function generarOperacion() {
    let cat = categoria;
    if (cat === 'todas') {
        const opciones = ['lineal', 'cuadratica', 'pitagoras', 'sistema'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
        document.getElementById('info-texto').textContent = INFOS[cat];
    }

    let texto = '';
    let pista = '';
    let resultado = 0;
    let pasos = [];

    if (cat === 'lineal') {
        const x = rand(2, 12);
        const a = rand(2, 6);
        const b = rand(2, 10);
        const c = a * x + b;
        const esResta = Math.random() < 0.3;
        if (!esResta) {
            texto = `${a}x + ${b} = ${c}   ¿x = ?`;
            resultado = x;
            pista = `Recuerda: primero quita el +${b}, luego quita el ×${a}`;
            pasos = [
                `1️⃣ Tenemos: ${a}x + ${b} = ${c}`,
                `2️⃣ Paso 1 - Quita el +${b}: pasa restando al otro lado → ${a}x = ${c} - ${b}`,
                `3️⃣ Calcula: ${a}x = ${c - b}`,
                `4️⃣ Paso 2 - Quita el ×${a}: pasa dividiendo → x = ${c - b} ÷ ${a}`,
                `5️⃣ Resultado: x = ${x} ✅  Comprueba: ${a}×${x} + ${b} = ${c}`
            ];
        } else {
            const c2 = a * x - b;
            texto = `${a}x - ${b} = ${c2}   ¿x = ?`;
            resultado = x;
            pista = `Recuerda: primero quita el -${b}, luego quita el ×${a}`;
            pasos = [
                `1️⃣ Tenemos: ${a}x - ${b} = ${c2}`,
                `2️⃣ Paso 1 - Quita el -${b}: pasa sumando → ${a}x = ${c2} + ${b}`,
                `3️⃣ Calcula: ${a}x = ${c2 + b}`,
                `4️⃣ Paso 2 - Quita el ×${a}: pasa dividiendo → x = ${c2 + b} ÷ ${a}`,
                `5️⃣ Resultado: x = ${x} ✅  Comprueba: ${a}×${x} - ${b} = ${c2}`
            ];
        }
    } else if (cat === 'cuadratica') {
        const x = rand(2, 12);
        const a = rand(2, 10);
        if (Math.random() < 0.5) {
            texto = `x² = ${x * x}   ¿x = ?`;
            resultado = x;
            pista = `Piensa: ¿qué número × sí mismo da ${x * x}?`;
            pasos = [
                `1️⃣ Tenemos: x² = ${x * x}`,
                `2️⃣ Para quitar el ², sacamos raíz cuadrada en los dos lados: x = √${x * x}`,
                `3️⃣ Busca un número que × sí mismo dé ${x * x}`,
                `4️⃣ Ese número es ${x}, porque ${x} × ${x} = ${x * x}`,
                `5️⃣ Resultado: x = ${x} ✅`
            ];
        } else {
            texto = `x² + ${a} = ${x * x + a}   ¿x = ?`;
            resultado = x;
            pista = `Primero quita el +${a}, luego saca raíz`;
            pasos = [
                `1️⃣ Tenemos: x² + ${a} = ${x * x + a}`,
                `2️⃣ Paso 1 - Quita el +${a}: pasa restando → x² = ${x * x + a} - ${a}`,
                `3️⃣ Calcula: x² = ${x * x}`,
                `4️⃣ Paso 2 - Quita el ² con raíz: x = √${x * x} = ${x}`,
                `5️⃣ Resultado: x = ${x} ✅`
            ];
        }
    } else if (cat === 'pitagoras') {
        const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]];
        const t = triples[rand(0, triples.length - 1)];
        if (Math.random() < 0.5) {
            texto = `Triángulo rectángulo: catetos ${t[0]} y ${t[1]}. ¿Hipotenusa = ?`;
            resultado = t[2];
            pista = `Usa: c² = a² + b²`;
            pasos = [
                `1️⃣ Identifica: catetos a=${t[0]}, b=${t[1]}. Buscamos la hipotenusa c (el lado más largo)`,
                `2️⃣ Fórmula: c² = a² + b²`,
                `3️⃣ Sustituye: c² = ${t[0]}² + ${t[1]}² = ${t[0] * t[0]} + ${t[1] * t[1]}`,
                `4️⃣ Suma: c² = ${t[2] * t[2]}`,
                `5️⃣ Quita el ² con raíz: c = √${t[2] * t[2]} = ${t[2]} ✅`
            ];
        } else {
            texto = `Triángulo rectángulo: hipotenusa ${t[2]}, cateto ${t[0]}. ¿Otro cateto = ?`;
            resultado = t[1];
            pista = `Si te falta un cateto: b² = c² - a²`;
            pasos = [
                `1️⃣ Identifica: hipotenusa c=${t[2]}, cateto a=${t[0]}. Buscamos el otro cateto b`,
                `2️⃣ Fórmula despejada: b² = c² - a² (el cateto se resta, no se suma)`,
                `3️⃣ Sustituye: b² = ${t[2]}² - ${t[0]}² = ${t[2] * t[2]} - ${t[0] * t[0]}`,
                `4️⃣ Resta: b² = ${t[1] * t[1]}`,
                `5️⃣ Quita el ² con raíz: b = √${t[1] * t[1]} = ${t[1]} ✅`
            ];
        }
    } else if (cat === 'sistema') {
        const x = rand(3, 12);
        const y = rand(2, 9);
        const suma = x + y;
        const resta = x - y;
        if (Math.random() < 0.6) {
            texto = `x + y = ${suma}  y  x - y = ${resta}   ¿x = ?`;
            resultado = x;
            pista = `Suma las 2 ecuaciones, la y se cancela`;
            pasos = [
                `1️⃣ Tenemos: (1) x + y = ${suma}  y  (2) x - y = ${resta}`,
                `2️⃣ Suma las 2: (x + x) + (y - y) = ${suma} + ${resta}`,
                `3️⃣ La y se cancela: +y - y = 0. Queda: 2x = ${suma + resta}`,
                `4️⃣ Despeja: x = ${suma + resta} ÷ 2 = ${x}`,
                `5️⃣ Resultado: x = ${x} ✅  Si quieres y: y = ${suma} - ${x} = ${y}`
            ];
        } else {
            texto = `x + y = ${suma}  y  x - y = ${resta}   ¿y = ?`;
            resultado = y;
            pista = `Primero halla x, luego y = suma - x`;
            pasos = [
                `1️⃣ Tenemos: (1) x + y = ${suma}  y  (2) x - y = ${resta}`,
                `2️⃣ Suma las 2: 2x = ${suma + resta}, entonces x = ${x}`,
                `3️⃣ Ahora usa la primera: ${x} + y = ${suma}`,
                `4️⃣ Despeja y: y = ${suma} - ${x}`,
                `5️⃣ Resultado: y = ${y} ✅`
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
        feedback.textContent = `❌ Casi. Tú pusiste ${num}, la correcta es ${respuestaCorrecta}. Mira los pasos 👇`;
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
        resultado.textContent = `🔥 ¡Misión cumplida! Ya hiciste ${correctas} correctas de ${practicadas}. Ya dominas el procedimiento`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `Vas ${correctas}/5 correctas. Sigue practicando, usa los pasos poco a poco, no hay prisa`;
        resultado.style.color = '#00aaff';
    }
}