document.addEventListener('DOMContentLoaded', () => {
    iniciarJuego();
});

// Palabras de Lengua y Comunicación - Prepa y Secundaria
// Todas con la regla de ortografía en la pista para que aprendas mientras juegas
const PALABRAS = [
    { palabra: 'HAYA', pista: 'Del verbo HABER. Ej: "Espero que haya comida". No es "halla" ni "aya"' },
    { palabra: 'VAYA', pista: 'Del verbo IR. Ej: "Que vaya a la tienda". No es "baya"' },
    { palabra: 'HECHO', pista: 'Del verbo HACER. Lleva H. Ej: "Ya está hecho". No es "echo" (de echar)' },
    { palabra: 'ECHO', pista: 'Del verbo ECHAR. Sin H. Ej: "Echo agua". No es "hecho"' },
    { palabra: 'BOTA', pista: 'Calzado. Con B. No es "vota" (de votar)' },
    { palabra: 'VOTA', pista: 'Del verbo VOTAR. Con V. Ej: "Él vota en elecciones"' },
    { palabra: 'CASA', pista: 'Lugar donde vives. Con S. No es "caza" (de cazar)' },
    { palabra: 'CAZA', pista: 'Del verbo CAZAR. Con Z. Ej: "Va de caza"' },
    { palabra: 'TUBO', pista: 'Objeto cilíndrico. Con B. No es "tuvo" (de tener)' },
    { palabra: 'TUVO', pista: 'Del verbo TENER. Con V. Ej: "Tuvo miedo"' },
    { palabra: 'HOLA', pista: 'Saludo. Lleva H. No es "ola" (del mar)' },
    { palabra: 'OLA', pista: 'Del mar. Sin H. No es "hola" (saludo)' },
    { palabra: 'METAFORA', pista: 'Figura retórica: "Tus ojos son dos luceros". Sin acento en el juego, pero lleva en la A' },
    { palabra: 'SINONIMO', pista: 'Palabra con mismo significado. Ej: casa = hogar' },
    { palabra: 'ANTONIMO', pista: 'Palabra con significado contrario. Ej: alto / bajo' },
    { palabra: 'ACENTO', pista: 'La rayita ´ que va en la sílaba tónica. Ej: "árbol"' },
    { palabra: 'COMA', pista: 'Signo de puntuación , que da una pausa corta' },
    { palabra: 'VERBO', pista: 'Palabra que indica acción. Ej: correr, cantar, estudiar' },
];

const CARAS = ['😀', '🙂', '😐', '😟', '😨', '😰', '💀'];
let palabraActual = '';
let pistaActual = '';
let letrasAdivinadas = [];
let vidas = 6;
let puntos = 0;
let ganadas = 0;
let perdidas = 0;
let juegoTerminado = false;

function iniciarJuego() {
    const btnNuevo = document.getElementById('btn-nuevo');
    const btnComprobar = document.getElementById('btn-comprobar');
    if (btnNuevo) btnNuevo.addEventListener('click', nuevoJuego);
    if (btnComprobar) btnComprobar.addEventListener('click', comprobarMision);

    nuevoJuego();
}

function nuevoJuego() {
    const aleatoria = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
    palabraActual = aleatoria.palabra;
    pistaActual = aleatoria.pista;
    letrasAdivinadas = [];
    vidas = 6;
    juegoTerminado = false;

    document.getElementById('pista').textContent = pistaActual;
    document.getElementById('vidas').textContent = vidas;
    document.getElementById('dibujo').textContent = CARAS[0];
    document.getElementById('final').textContent = '';
    document.getElementById('resultado').textContent = '';

    mostrarPalabra();
    crearTeclado();
}

function mostrarPalabra() {
    const div = document.getElementById('palabra');
    div.innerHTML = palabraActual.split('').map(letra => {
        if (letrasAdivinadas.includes(letra)) return `<span style="color:#00ff88;">${letra}</span>`;
        return `<span style="color:#8aa0c6;">_</span>`;
    }).join(' ');
}

function crearTeclado() {
    const teclado = document.getElementById('teclado');
    teclado.innerHTML = '';
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.style.cssText = 'width:38px; height:38px; background:#1a2340; color:#fff; border:1px solid #2a3a65; border-radius:8px; cursor:pointer; font-weight:800;';
        btn.addEventListener('click', () => adivinarLetra(letra, btn));
        teclado.appendChild(btn);
    });
}

function adivinarLetra(letra, btn) {
    if (juegoTerminado) return;
    btn.disabled = true;

    if (palabraActual.includes(letra)) {
        btn.style.background = '#00ff88';
        btn.style.color = '#000';
        letrasAdivinadas.push(letra);
        mostrarPalabra();
        // ¿Ya ganó?
        const gano = palabraActual.split('').every(l => letrasAdivinadas.includes(l));
        if (gano) {
            juegoTerminado = true;
            ganadas++;
            puntos += 10;
            document.getElementById('final').textContent = `🎉 ¡GANASTE! La palabra era ${palabraActual}`;
            document.getElementById('final').style.color = '#00ffc6';
            document.getElementById('dibujo').textContent = '🥳';
            actualizarPuntos();
        }
    } else {
        btn.style.background = '#ff2d55';
        btn.style.opacity = '0.5';
        vidas--;
        document.getElementById('vidas').textContent = vidas;
        document.getElementById('dibujo').textContent = CARAS[6 - vidas];
        if (vidas <= 0) {
            juegoTerminado = true;
            perdidas++;
            document.getElementById('final').textContent = `💀 Perdiste. La palabra era ${palabraActual}`;
            document.getElementById('final').style.color = '#ff4d4d';
            mostrarPalabraCompleta();
            actualizarPuntos();
        }
    }
}

function mostrarPalabraCompleta() {
    const div = document.getElementById('palabra');
    div.innerHTML = palabraActual.split('').map(letra => `<span style="color:#ff4d4d;">${letra}</span>`).join(' ');
}

function actualizarPuntos() {
    const p = document.getElementById('puntos');
    if (p) p.textContent = `Puntos: ${puntos} | Ganadas: ${ganadas} | Perdidas: ${perdidas}`;
}

function comprobarMision() {
    const resultado = document.getElementById('resultado');
    if (!juegoTerminado) {
        resultado.textContent = `Vas en ${letrasAdivinadas.length} letras, te quedan ${vidas} vidas. ¡Tú puedes!`;
        resultado.style.color = '#00aaff';
    } else if (ganadas > perdidas) {
        resultado.textContent = `🔥 ¡Misión cumplida! Llevas ${ganadas} ganadas. Eres pro en ortografía`;
        resultado.style.color = '#00ffc6';
    } else {
        resultado.textContent = `❌ Llevas ${perdidas} perdidas. Dale a Nuevo Juego y recuerda la pista`;
        resultado.style.color = '#ff4d4d';
    }
}