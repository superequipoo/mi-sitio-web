console.log("✅ JS DE FRACCIONES CARGADO");

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
    conectar('btn-fracciones', () => setCategoria('fracciones'));
    conectar('btn-decimales', () => setCategoria('decimales'));
    conectar('btn-conversion', () => setCategoria('conversion'));
    conectar('btn-problemas', () => setCategoria('problemas'));

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
let respuestaTexto = '';
let pasosActuales = [];
let pasoIndex = 0;
let yaResuelto = false;

const INFOS = {
    'todas': 'Vas a practicar fracciones y decimales. La idea es que entiendas que 1/2, 0.5 y 50% son LO MISMO, solo escrito diferente.',
    'fracciones': 'FRACCIÓN: Es una parte de un todo. Arriba va el numerador (lo que tomas), abajo el denominador (en cuántas partes se dividió). Ej: 3/4 = 3 partes de 4. Si el denominador es igual, solo sumas los de arriba.',
    'decimales': 'DECIMAL: Es lo mismo que una fracción pero con punto. El punto separa enteros de partes. Ej: 2.5 = 2 enteros + 5 décimas. Para sumar/restar, SIEMPRE alinea el punto.',
    'conversion': 'CONVERSIÓN: Para pasar fracción a decimal, divide arriba entre abajo. Ej: 1/2 = 1 ÷ 2 = 0.5. Para pasar decimal a fracción, piensa: 0.5 es la mitad = 1/2. Para % a decimal, divide entre 100.',
    'problemas': 'PROBLEMAS EXANI: Lee primero qué te preguntan. Si dice "¿qué fracción?", tu respuesta es arriba / total. Si dice "¿cuánto?", haz la operación. No te confundas con los datos de más.'
};

function setCategoria(nuevaCat) {
    console.log("Clic en categoría: " + nuevaCat);
    categoria = nuevaCat;
    const tipo = document.getElementById('tipo');
    const textos = {
        'todas': 'Categoría: Todas - Fracciones, decimales y conversión',
        'fracciones': 'Categoría: Fracciones - Suma, resta y simplificar',
        'decimales': 'Categoría: Decimales - Suma, resta y multiplicación',
        'conversion': 'Categoría: Conversión - Fracción ↔ Decimal ↔ Porcentaje',
        'problemas': 'Categoría: Problemas EXANI - Fracciones en la vida real'
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

function parseRespuesta(texto) {
    texto = texto.trim().replace(',', '.');
    if (texto.includes('/')) {
        const partes = texto.split('/');
        if (partes.length !== 2) return NaN;
        const num = parseFloat(partes[0]);
        const den = parseFloat(partes[1]);
        if (isNaN(num) || isNaN(den) || den === 0) return NaN;
        return num / den;
    }
    return parseFloat(texto);
}

function mcd(a, b) { return b === 0 ? a : mcd(b, a % b); }
function simplificar(num, den) {
    const d = mcd(Math.abs(num), Math.abs(den));
    if (den / d === 1) return `${num / d}`;
    return `${num / d}/${den / d}`;
}

function generarOperacion() {
    let cat = categoria;
    if (cat === 'todas') {
        const opciones = ['fracciones', 'decimales', 'conversion', 'problemas'];
        cat = opciones[Math.floor(Math.random() * opciones.length)];
        document.getElementById('info-texto').textContent = INFOS[cat];
    }

    let texto = '';
    let pista = '';
    let resultado = 0;
    let textoResp = '';
    let pasos = [];

    if (cat === 'fracciones') {
        const tipoOp = Math.floor(Math.random() * 3);
        if (tipoOp === 0) {
            const den = rand(2, 8);
            const n1 = rand(1, den - 1);
            const n2 = rand(1, den - n1);
            texto = `${n1}/${den} + ${n2}/${den} = ?`;
            resultado = (n1 + n2) / den;
            textoResp = simplificar(n1 + n2, den);
            pista = 'Mismo denominador: se suman los de arriba, el de abajo se queda';
            pasos = [
                `1️⃣ Tenemos: ${n1}/${den} + ${n2}/${den}`,
                `2️⃣ ¿El denominador es igual? Sí, los dos son ${den}. ¡Qué fácil!`,
                `3️⃣ Regla: cuando el de abajo es igual, solo sumas los de arriba: ${n1} + ${n2} = ${n1 + n2}`,
                `4️⃣ El de abajo se queda igual: ${n1 + n2}/${den}`,
                `5️⃣ ¿Se puede simplificar? Respuesta: ${textoResp} ✅  (en decimal es ${resultado.toFixed(2)})`
            ];
        } else if (tipoOp === 1) {
            const den = rand(4, 12);
            const num = rand(2, den - 1);
            const num2 = num * 2;
            const den2 = den * 2;
            texto = `Simplifica: ${num2}/${den2} = ?`;
            resultado = num2 / den2;
            textoResp = simplificar(num2, den2);
            pista = 'Divide arriba y abajo entre el mismo número';
            pasos = [
                `1️⃣ Tenemos: ${num2}/${den2}`,
                `2️⃣ Simplificar = hacer la fracción más chiquita sin cambiar su valor`,
                `3️⃣ Busca un número que divida a los dos. Los dos son pares, divide entre 2: ${num2} ÷ 2 = ${num2 / 2}, ${den2} ÷ 2 = ${den2 / 2}`,
                `4️⃣ Te queda: ${num2 / 2}/${den2 / 2}. ¿Se puede más? Si es ${textoResp}, ya no`,
                `5️⃣ Resultado: ${textoResp} ✅  (en decimal es ${resultado.toFixed(2)})`
            ];
        } else {
            const den = rand(3, 6);
            texto = `¿Cuál es mayor? Escribe solo la mayor: 1/${den} o 1/${den + 1}  (escribe como 1/${den} o en decimal)`;
            resultado = 1 / den;
            textoResp = `1/${den} = ${(1 / den).toFixed(2)}`;
            pista = 'Entre más chico el denominador, más grande la fracción';
            pasos = [
                `1️⃣ Comparamos: 1/${den} vs 1/${den + 1}`,
                `2️⃣ Piensa en pizza: si la divides en ${den} partes, cada parte es más grande que si la divides en ${den + 1}`,
                `3️⃣ En decimal: 1/${den} = ${(1 / den).toFixed(2)}, 1/${den + 1} = ${(1 / (den + 1)).toFixed(2)}`,
                `4️⃣ ${(1 / den).toFixed(2)} es mayor que ${(1 / (den + 1)).toFixed(2)}`,
                `5️⃣ Resultado: la mayor es 1/${den} ✅`
            ];
        }
    } else if (cat === 'decimales') {
        const tipoOp = Math.floor(Math.random() * 3);
        if (tipoOp === 0) {
            const a = (rand(1, 9) + rand(1, 9) / 10).toFixed(1);
            const b = (rand(1, 9) + rand(1, 9) / 10).toFixed(1);
            texto = `${a} + ${b} = ?`;
            resultado = parseFloat(a) + parseFloat(b);
            textoResp = resultado.toFixed(1);
            pista = 'Alinea el punto decimal y suma normal';
            pasos = [
                `1️⃣ Tenemos: ${a} + ${b}`,
                `2️⃣ Paso clave: pon un número abajo del otro ALINEANDO EL PUNTO`,
                `3️⃣ Suma como si no hubiera punto: ${a} + ${b}`,
                `4️⃣ Al final bajas el punto en el mismo lugar`,
                `5️⃣ Resultado: ${textoResp} ✅`
            ];
        } else if (tipoOp === 1) {
            const a = rand(2, 9) / 10;
            const b = rand(2, 9);
            texto = `${a} × ${b} = ?`;
            resultado = +(a * b).toFixed(1);
            textoResp = resultado.toFixed(1);
            pista = 'Multiplica sin punto y al final pones 1 decimal';
            pasos = [
                `1️⃣ Tenemos: ${a} × ${b}`,
                `2️⃣ Quita el punto por un momento: ${Math.round(a * 10)} × ${b} = ${Math.round(a * 10) * b}`,
                `3️⃣ Ahora cuenta cuántos decimales tenía ${a}: tiene 1 decimal`,
                `4️⃣ Pon 1 decimal en el resultado: ${Math.round(a * 10) * b} → ${textoResp}`,
                `5️⃣ Resultado: ${textoResp} ✅`
            ];
        } else {
            const a = rand(10, 50) / 10;
            const b = rand(10, 50) / 10;
            texto = `${a} - ${b} = ?`;
            resultado = +(a - b).toFixed(1);
            textoResp = resultado.toFixed(1);
            pista = 'Resta normal, cuida el punto';
            pasos = [
                `1️⃣ Tenemos: ${a} - ${b}`,
                `2️⃣ Alinea el punto, uno abajo del otro`,
                `3️⃣ Resta normal: ${a} - ${b}`,
                `4️⃣ Baja el punto en el mismo lugar`,
                `5️⃣ Resultado: ${textoResp} ✅  (si sale negativo, está bien, significa que ${b} era mayor)`
            ];
        }
    } else if (cat === 'conversion') {
        const tipoOp = Math.floor(Math.random() * 3);
        if (tipoOp === 0) {
            const fracciones = [[1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [1, 5, 0.2], [2, 5, 0.4], [1, 10, 0.1]];
            const f = fracciones[rand(0, fracciones.length - 1)];
            texto = `${f[0]}/${f[1]} = ?  (en decimal)`;
            resultado = f[2];
            textoResp = `${f[2]}`;
            pista = 'Divide arriba entre abajo';
            pasos = [
                `1️⃣ Tenemos: ${f[0]}/${f[1]} a decimal`,
                `2️⃣ Regla: fracción a decimal = divide arriba entre abajo`,
                `3️⃣ Entonces: ${f[0]} ÷ ${f[1]} = ${f[2]}`,
                `4️⃣ Recuerda: ${f[0]}/${f[1]} y ${f[2]} son LO MISMO, solo escrito diferente`,
                `5️⃣ Resultado: ${f[2]} ✅`
            ];
        } else if (tipoOp === 1) {
            const fracciones = [[0.5, '1/2'], [0.25, '1/4'], [0.75, '3/4'], [0.2, '1/5']];
            const f = fracciones[rand(0, fracciones.length - 1)];
            texto = `${f[0]} = ?  (en fracción)`;
            resultado = f[0];
            textoResp = f[1];
            pista = '0.5 es la mitad, 0.25 es un cuarto';
            pasos = [
                `1️⃣ Tenemos: ${f[0]} a fracción`,
                `2️⃣ Piensa en dinero o pizza: ${f[0]} es...`,
                `3️⃣ ${f[0]} = ${f[1]} porque ${f[1]} también vale ${f[0]}`,
                `4️⃣ Truco para memorizar: 0.5=1/2, 0.25=1/4, 0.75=3/4, 0.2=1/5`,
                `5️⃣ Resultado: ${f[1]} ✅  (también vale escribir ${f[0]})`
            ];
        } else {
            const porc = [50, 25, 75, 20, 10][rand(0, 4)];
            texto = `${porc}% = ?  (en decimal)`;
            resultado = porc / 100;
            textoResp = `${resultado}`;
            pista = 'Porcentaje entre 100';
            pasos = [
                `1️⃣ Tenemos: ${porc}% a decimal`,
                `2️⃣ Regla: % significa "de cada 100". Para quitar el %, divide entre 100`,
                `3️⃣ Entonces: ${porc} ÷ 100 = ${resultado}`,
                `4️⃣ Truco: quita el % y recorre el punto 2 lugares a la izquierda`,
                `5️⃣ Resultado: ${resultado} ✅`
            ];
        }
    } else if (cat === 'problemas') {
        const tipoOp = Math.floor(Math.random() * 3);
        if (tipoOp === 0) {
            const totalPizza = rand(4, 8);
            const comio = rand(1, totalPizza - 1);
            texto = `De una pizza de ${totalPizza} rebanadas te comes ${comio}. ¿Qué fracción te comiste?`;
            resultado = comio / totalPizza;
            textoResp = simplificar(comio, totalPizza);
            pista = 'Fracción = lo que comiste / total';
            pasos = [
                `1️⃣ Lee: pizza de ${totalPizza} rebanadas, te comes ${comio}`,
                `2️⃣ Pregunta: ¿qué FRACCIÓN te comiste?`,
                `3️⃣ Regla: fracción = lo que tomaste / total`,
                `4️⃣ Entonces: ${comio} / ${totalPizza} = ${comio}/${totalPizza}`,
                `5️⃣ Simplificada: ${textoResp} ✅  (en decimal es ${resultado.toFixed(2)})`
            ];
        } else if (tipoOp === 1) {
            const dinero = rand(20, 100) * 10;
            const mitad = dinero / 2;
            texto = `Tienes $${dinero} y gastas la mitad. ¿Cuánto gastaste?`;
            resultado = mitad;
            textoResp = `${mitad}`;
            pista = 'La mitad = entre 2';
            pasos = [
                `1️⃣ Tienes: $${dinero}`,
                `2️⃣ Gastas: la mitad`,
                `3️⃣ La mitad = entre 2`,
                `4️⃣ Entonces: ${dinero} ÷ 2 = ${mitad}`,
                `5️⃣ Resultado: gastaste $${mitad} ✅`
            ];
        } else {
            const totalBotellas = rand(4, 10) * 2;
            texto = `De ${totalBotellas} botellas, 1/4 son de agua. ¿Cuántas son de agua?`;
            resultado = totalBotellas / 4;
            textoResp = `${resultado}`;
            pista = '1/4 de algo = ese algo entre 4';
            pasos = [
                `1️⃣ Total: ${totalBotellas} botellas`,
                `2️⃣ 1/4 son de agua`,
                `3️⃣ 1/4 de algo = ese algo entre 4`,
                `4️⃣ Entonces: ${totalBotellas} ÷ 4 = ${resultado}`,
                `5️⃣ Resultado: ${resultado} botellas de agua ✅`
            ];
        }
    }

    respuestaCorrecta = resultado;
    respuestaTexto = textoResp;
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
        feedback.textContent = '⚠️ Escribe tu respuesta primero. Ej: 1/2 o 0.5. Si te atoras, dale a "Necesito ayuda"';
        feedback.style.color = '#ffaa00';
        return;
    }
    if (yaResuelto) {
        generarOperacion();
        return;
    }

    const numUsuario = parseRespuesta(valor);
    if (isNaN(numUsuario)) {
        feedback.textContent = '⚠️ Escribe como 1/2 o 0.5';
        feedback.style.color = '#ffaa00';
        return;
    }

    practicadas++;
    const correcto = Math.abs(numUsuario - respuestaCorrecta) < 0.01;

    if (correcto) {
        correctas++;
        if (correctas % 3 === 0) nivel++;
        feedback.textContent = `✅ ¡Bien! = ${respuestaTexto}. Ya llevas ${correctas} correctas. Dale a "Siguiente ejercicio"`;
        feedback.style.color = '#00ffc6';
        yaResuelto = true;
    } else {
        feedback.textContent = `❌ Casi. Tú pusiste ${valor}, la correcta es ${respuestaTexto}. Mira los pasos 👇`;
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
        resultado.textContent = `🔥 ¡Misión cumplida! Ya hiciste ${correctas} correctas de ${practicadas}. Ya dominas fracciones y decimales`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `Vas ${correctas}/5 correctas. Sigue practicando, usa los pasos poco a poco, no hay prisa`;
        resultado.style.color = '#00aaff';
    }
}