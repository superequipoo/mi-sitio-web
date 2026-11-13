document.addEventListener('DOMContentLoaded', () => {
    iniciarSopa();
});

const PALABRAS = ['METAFORA', 'NOVELA', 'SINONIMO', 'VERBO', 'ENSAYO', 'ADJETIVO', 'CONECTOR', 'POEMA'];
const TAM = 12;
let seleccion = [];
let encontradas = new Set();
let puntos = 0;

function iniciarSopa() {
    const sopaDiv = document.getElementById('sopa');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnComprobar = document.getElementById('btn-comprobar');
    if (!sopaDiv) return;

    // Reiniciar estado
    seleccion = [];
    encontradas = new Set();
    puntos = 0;
    actualizarPuntos();
    document.getElementById('msg').textContent = '';
    document.getElementById('resultado').textContent = '';

    // Crear grid vacío
    let grid = Array.from({ length: TAM }, () => Array(TAM).fill(''));
    const direcciones = [
        [0, 1],   // horizontal →
        [1, 0],   // vertical ↓
        [1, 1],   // diagonal ↘
        [0, -1],  // horizontal ←
        [-1, 0],  // vertical ↑
    ];

    // Colocar palabras
    PALABRAS.forEach(palabra => {
        let colocada = false;
        let intentos = 0;
        while (!colocada && intentos < 100) {
            intentos++;
            const [dx, dy] = direcciones[Math.floor(Math.random() * direcciones.length)];
            const fila = Math.floor(Math.random() * TAM);
            const col = Math.floor(Math.random() * TAM);
            // ¿Cabe?
            let cabe = true;
            for (let i = 0; i < palabra.length; i++) {
                const f = fila + dx * i;
                const c = col + dy * i;
                if (f < 0 || f >= TAM || c < 0 || c >= TAM) { cabe = false; break; }
                if (grid[f][c] !== '' && grid[f][c] !== palabra[i]) { cabe = false; break; }
            }
            if (!cabe) continue;
            for (let i = 0; i < palabra.length; i++) {
                grid[fila + dx * i][col + dy * i] = palabra[i];
            }
            colocada = true;
        }
    });

    // Rellenar huecos con letras random
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    for (let f = 0; f < TAM; f++) {
        for (let c = 0; c < TAM; c++) {
            if (grid[f][c] === '') grid[f][c] = letras[Math.floor(Math.random() * letras.length)];
        }
    }

    // Dibujar en pantalla
    sopaDiv.innerHTML = '';
    sopaDiv.style.display = 'grid';
    sopaDiv.style.gridTemplateColumns = `repeat(${TAM}, 32px)`;
    sopaDiv.style.gap = '3px';
    sopaDiv.style.justifyContent = 'center';

    for (let f = 0; f < TAM; f++) {
        for (let c = 0; c < TAM; c++) {
            const celda = document.createElement('div');
            celda.textContent = grid[f][c];
            celda.dataset.fila = f;
            celda.dataset.col = c;
            celda.dataset.letra = grid[f][c];
            celda.style.cssText = 'width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:#1a2340; border:1px solid #2a3a65; border-radius:6px; cursor:pointer; font-weight:800; font-size:14px; color:#fff; user-select:none;';
            celda.addEventListener('click', () => seleccionarCelda(celda));
            sopaDiv.appendChild(celda);
        }
    }

    // Botones
    if (btnReiniciar) btnReiniciar.onclick = () => iniciarSopa();
    if (btnComprobar) btnComprobar.onclick = () => comprobarMision();
}

function seleccionarCelda(celda) {
    // Si ya está encontrada, no hacer nada
    if (celda.style.background === 'rgb(0, 255, 136)') return;

    if (seleccion.includes(celda)) {
        celda.style.background = '#1a2340';
        seleccion = seleccion.filter(x => x !== celda);
    } else {
        celda.style.background = '#00aaff';
        seleccion.push(celda);
    }

    const palabraFormada = seleccion.map(x => x.dataset.letra).join('');
    const palabraReversa = palabraFormada.split('').reverse().join('');

    if (PALABRAS.includes(palabraFormada) || PALABRAS.includes(palabraReversa)) {
        const encontrada = PALABRAS.includes(palabraFormada) ? palabraFormada : palabraReversa;
        if (!encontradas.has(encontrada)) {
            encontradas.add(encontrada);
            puntos++;
            document.getElementById('msg').textContent = `✅ ¡Encontraste ${encontrada}!`;
            document.getElementById('msg').style.color = '#00ffc6';
            seleccion.forEach(x => x.style.background = '#00ff88');
            seleccion = [];
            actualizarPuntos();
            marcarPalabraEnLista(encontrada);
            if (encontradas.size === PALABRAS.length) {
                document.getElementById('resultado').textContent = '🔥 ¡SOPA COMPLETADA! Eres pro de Lengua';
                document.getElementById('resultado').style.color = '#00ffc6';
            }
        }
    } else if (seleccion.length > 10) {
        // Si seleccionó muchas y no es palabra, limpiar
        seleccion.forEach(x => x.style.background = '#1a2340');
        seleccion = [];
        document.getElementById('msg').textContent = '❌ Esa no es, intenta otra vez';
        document.getElementById('msg').style.color = '#ff4d4d';
    }
}

function marcarPalabraEnLista(palabra) {
    const lista = document.getElementById('lista');
    if (!lista) return;
    // Tachado visual simple: reemplaza en el texto
    let texto = lista.innerHTML;
    // Busca la palabra con o sin acento
    const conAcento = { 'METAFORA': 'METÁFORA', 'SINONIMO': 'SINÓNIMO' };
    const mostrar = conAcento[palabra] || palabra;
    lista.innerHTML = texto.replace(mostrar, `<s style="color:#00ff88;">${mostrar}</s>`);
}

function actualizarPuntos() {
    const p = document.getElementById('puntos');
    if (p) p.textContent = `Puntos: ${puntos} / ${PALABRAS.length}`;
}

function comprobarMision() {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Encontradas: ${encontradas.size}/${PALABRAS.length} ${encontradas.size >= 6 ? '🔥 ¡Misión cumplida!' : '❌ Sigue buscando, te faltan ' + (PALABRAS.length - encontradas.size)}`;
    resultado.style.color = encontradas.size >= 6 ? '#00ffc6' : '#ff4d4d';
}