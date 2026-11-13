document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const inputs = document.querySelectorAll('.ejercicio-input');
    let aciertos = 0;

    const claves = [
        ["dormir"],
        ["secundaria"]
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
        aciertos === 2
        ? `<span style="color:#00ff88">¡Perfecto! ${aciertos}/2 🎉 Ya dominas la idea principal</span>`
        : `<span style="color:#ff9500">${aciertos}/2 aciertos. Respuestas: dormir / secundaria</span>`;
}