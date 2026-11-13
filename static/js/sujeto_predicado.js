document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const inputs = document.querySelectorAll('.ejercicio-input');
    let aciertos = 0;

    const claves = [
        ["los niños"],
        ["tacito", "tácito", "elíptico", "eliptico"],
        ["nominal"],
        ["casa"],
        ["compuesto"]
    ];

    inputs.forEach((inp, i) => {
        const usuario = inp.value.toLowerCase().trim();
        const esCorrecto = claves[i].some(c => usuario.includes(c));
        if (esCorrecto) {
            inp.style.borderColor = "#00ff88";
            aciertos++;
        } else {
            inp.style.borderColor = "#ff2d55";
        }
    });

    const resultado = document.getElementById('resultado');
    resultado.innerHTML =
        aciertos === 5
        ? `<span style="color:#00ff88">¡Perfecto! ${aciertos}/5 🎉 Ya dominas sujeto y predicado</span>`
        : `<span style="color:#ff9500">${aciertos}/5 aciertos. Respuestas: Los niños / tácito / nominal / casa / compuesto</span>`;
}