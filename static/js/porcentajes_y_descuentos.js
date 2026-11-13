console.log("✅ JS DE PORCENTAJES CARGADO");

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
    conectar('btn-basico', () => setCategoria('basico'));
    conectar('btn-tactico', () => setCategoria('tactico'));
    conectar('btn-descuento', () => setCategoria('descuento'));
    conectar('btn-inverso', () => setCategoria('inverso'));

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
    'todas': 'Vas a practicar porcentajes y descuentos. La idea es que aprendas a calcular cuánto es el % y cuánto pagas al final, sin confundir descuento con precio final.',
    'basico': 'BÁSICO %: % significa "de cada 100". Para sacar el % de algo, haces: número × % ÷ 100. Ej: 20% de 200 = 200 × 20 ÷ 100 = 40. Trucos: 50% es la mitad, 25% es la cuarta parte, 10% es quitarle un cero.',
    'tactico': 'TÁCTICO EXANI: Aquí te van a preguntar al revés: ¿qué % es? o ¿cuánto subió? Fórmula para ¿qué %?: parte ÷ total × 100. Para aumento: primero calcula el % y luego súmalo.',
    'descuento': 'DESCUENTO: Tiene 2 partes, no te confundas. Paso 1: calcula el descuento (precio × % ÷ 100). Paso 2: réstalo al precio para saber cuánto PAGAS. El descuento NO es lo que pagas, es lo que te ahorras.',
    'inverso': 'INVERSO: Es al revés. Ya te dicen cuánto pagaste con descuento y te preguntan cuánto costaba antes. Truco: si pagaste con 20% OFF, pagaste el 80%. Entonces: precio original = lo que pagaste ÷ 80% .'
};

function setCategoria(nuevaCat) {
    console.log("Clic en categoría: " + nuevaCat);
    categoria = nuevaCat;
    const tipo = document.getElementById('tipo');
    const textos = {
        'todas': 'Categoría: Todas - Básico, táctico, descuentos e inverso',
        'basico': 'Categoría: Básico % - Ej: 20% de 200',
        'tactico': 'Categoría: Táctico EXANI - Porcentajes difíciles y trucos',
        'descuento': 'Categoría: Descuentos - ¿Cuánto pagas al final?',
        'inverso': 'Categoría: Inverso - Si ya pagaste, ¿cuánto costaba?'
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
        const opciones = ['basico', 'tactico', 'descuento', 'inverso'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
        document.getElementById('info-texto').textContent = INFOS[cat];
    }

    let texto = '';
    let pista = '';
    let resultado = 0;
    let pasos = [];

    if (cat === 'basico') {
        const porc = [10, 20, 25, 50, 75][rand(0, 4)];
        const base = rand(2, 20) * 10;
        texto = `${porc}% de ${base} = ?`;
        resultado = base * porc / 100;
        if (porc === 50) pista = 'Truco: 50% es la mitad';
        else if (porc === 25) pista = 'Truco: 25% es la cuarta parte';
        else if (porc === 10) pista = 'Truco: 10% es quitarle un cero';
        else pista = `Fórmula: ${base} × ${porc} ÷ 100`;
        pasos = [
            `1️⃣ Tenemos: ${porc}% de ${base}`,
            `2️⃣ Fórmula: ${base} × ${porc} ÷ 100`,
            `3️⃣ Primero multiplica: ${base} × ${porc} = ${base * porc}`,
            `4️⃣ Luego divide entre 100: ${base * porc} ÷ 100 = ${resultado}`,
            `5️⃣ Resultado: ${porc}% de ${base} = ${resultado} ✅`
        ];
    } else if (cat === 'tactico') {
        const tipoOp = Math.floor(Math.random() * 3);
        if (tipoOp === 0) {
            const porc = [15, 30, 60, 80][rand(0, 3)];
            const base = rand(2, 15) * 20;
            texto = `${porc}% de ${base} = ?`;
            resultado = base * porc / 100;
            pista = `Hazlo en 2 pasos: 10% = ${base / 10}`;
            pasos = [
                `1️⃣ Tenemos: ${porc}% de ${base}`,
                `2️⃣ Truco táctico: primero saca el 10%: 10% de ${base} = ${base / 10}`,
                `3️⃣ ${porc}% es ${porc / 10} veces el 10%: ${base / 10} × ${porc / 10} = ${resultado}`,
                `4️⃣ O directo: ${base} × ${porc} ÷ 100 = ${resultado}`,
                `5️⃣ Resultado: ${resultado} ✅`
            ];
        } else if (tipoOp === 1) {
            const base = [100, 200, 50, 400][rand(0, 3)];
            const parte = base / 4;
            texto = `${parte} es ¿qué % de ${base}? (escribe solo el número)`;
            resultado = parte * 100 / base;
            pista = `Fórmula: parte ÷ total × 100`;
            pasos = [
                `1️⃣ Tenemos: ${parte} es ¿qué % de ${base}?`,
                `2️⃣ Fórmula al revés: parte ÷ total × 100`,
                `3️⃣ Sustituye: ${parte} ÷ ${base} = ${parte / base}`,
                `4️⃣ Multiplica por 100: ${parte / base} × 100 = ${resultado}`,
                `5️⃣ Resultado: ${parte} es el ${resultado}% de ${base} ✅`
            ];
        } else {
            const base = rand(10, 50) * 10;
            const porc = [10, 20, 25][rand(0, 2)];
            texto = `Unos tenis de $${base} suben ${porc}%. ¿Cuánto cuestan ahora?`;
            resultado = base + (base * porc / 100);
            pista = `Primero calcula ${porc}%, luego súmalo`;
            pasos = [
                `1️⃣ Tenis: $${base}, suben ${porc}%`,
                `2️⃣ Paso 1 - Calcula cuánto subió: ${porc}% de ${base} = ${base * porc / 100}`,
                `3️⃣ Paso 2 - Súmalo al precio original: ${base} + ${base * porc / 100}`,
                `4️⃣ No es solo el aumento, es el precio NUEVO`,
                `5️⃣ Resultado: ahora cuestan $${resultado} ✅`
            ];
        }
    } else if (cat === 'descuento') {
        const tipoOp = Math.floor(Math.random() * 2);
        const precio = rand(10, 100) * 10;
        const desc = [10, 20, 30, 40, 50][rand(0, 4)];
        const montoDesc = precio * desc / 100;
        if (tipoOp === 0) {
            texto = `Una playera de $${precio} tiene ${desc}% de descuento. ¿Cuánto pagas?`;
            resultado = precio - montoDesc;
            pista = `Paso 1: calcula el descuento, Paso 2: réstalo`;
            pasos = [
                `1️⃣ Playera: $${precio}, descuento: ${desc}%`,
                `2️⃣ Paso 1 - ¿Cuánto es el descuento? ${desc}% de ${precio} = $${montoDesc} (esto es lo que te AHORRAS)`,
                `3️⃣ Paso 2 - ¿Cuánto PAGAS? Precio - descuento: $${precio} - $${montoDesc}`,
                `4️⃣ No te confundas: $${montoDesc} es el descuento, $${resultado} es lo que pagas`,
                `5️⃣ Resultado: pagas $${resultado} ✅`
            ];
        } else {
            texto = `Un celular de $${precio} tiene ${desc}% OFF. ¿Cuánto es el descuento? (solo el descuento)`;
            resultado = montoDesc;
            pista = `Solo calcula ${desc}% de ${precio}, no lo restes`;
            pasos = [
                `1️⃣ Celular: $${precio}, descuento: ${desc}%`,
                `2️⃣ Te piden SOLO el descuento, no lo que pagas`,
                `3️⃣ Fórmula: ${precio} × ${desc} ÷ 100`,
                `4️⃣ Calcula: ${precio} × ${desc} = ${precio * desc}, entre 100 = ${montoDesc}`,
                `5️⃣ Resultado: el descuento es $${montoDesc} ✅  (pagarías $${precio - montoDesc})`
            ];
        }
    } else if (cat === 'inverso') {
        const tipoOp = Math.floor(Math.random() * 2);
        if (tipoOp === 0) {
            const precioFinal = [90, 80, 160, 200, 150][rand(0, 4)];
            const desc = [10, 20, 50][rand(0, 2)];
            const original = Math.round(precioFinal / (1 - desc / 100));
            texto = `Pagaste $${precioFinal} con ${desc}% de descuento. ¿Cuánto costaba sin descuento?`;
            resultado = original;
            pista = `Si pagaste ${100 - desc}%, entonces $${precioFinal} ÷ ${100 - desc}% = original`;
            pasos = [
                `1️⃣ Pagaste: $${precioFinal} con ${desc}% OFF`,
                `2️⃣ Si te hicieron ${desc}% de descuento, ¿qué % pagaste? 100% - ${desc}% = ${100 - desc}%`,
                `3️⃣ O sea: $${precioFinal} es el ${100 - desc}% del precio original`,
                `4️⃣ Despeja: precio original = ${precioFinal} ÷ ${100 - desc} × 100 = ${original}`,
                `5️⃣ Resultado: costaba $${original} ✅  Comprueba: ${desc}% de ${original} = ${original - precioFinal}, ${original} - ${original - precioFinal} = ${precioFinal}`
            ];
        } else {
            const parte = [30, 40, 50, 60][rand(0, 3)];
            const porc = [10, 20, 30][rand(0, 2)];
            const totalNum = parte * 100 / porc;
            texto = `${parte} es el ${porc}% de ¿qué número?`;
            resultado = totalNum;
            pista = `Fórmula: ${parte} × 100 ÷ ${porc}`;
            pasos = [
                `1️⃣ Tenemos: ${parte} es el ${porc}% de ¿qué número?`,
                `2️⃣ Al revés: si ${parte} es el ${porc}%, el 100% es más grande`,
                `3️⃣ Fórmula: ${parte} × 100 ÷ ${porc}`,
                `4️⃣ Calcula: ${parte} × 100 = ${parte * 100}, entre ${porc} = ${totalNum}`,
                `5️⃣ Resultado: el número es ${totalNum} ✅`
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
        feedback.textContent = '⚠️ Escribe tu respuesta primero. Solo el número, sin $ ni %. Si te atoras, dale a "Necesito ayuda"';
        feedback.style.color = '#ffaa00';
        return;
    }
    if (yaResuelto) {
        generarOperacion();
        return;
    }

    practicadas++;
    const num = Number(valor.replace(',', '.'));
    const correcto = Math.abs(num - respuestaCorrecta) < 0.5;

    if (correcto) {
        correctas++;
        if (correctas % 3 === 0) nivel++;
        feedback.textContent = `✅ ¡Bien! = ${respuestaCorrecta}. Ya llevas ${correctas} correctas. Dale a "Siguiente ejercicio"`;
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
        resultado.textContent = `🔥 ¡Misión cumplida! Ya hiciste ${correctas} correctas de ${practicadas}. Ya dominas porcentajes y descuentos`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `Vas ${correctas}/5 correctas. Sigue practicando, usa los pasos poco a poco, no hay prisa`;
        resultado.style.color = '#00aaff';
    }
}