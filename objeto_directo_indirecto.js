document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const inputs = document.querySelectorAll('.ejercicio-input');
    let aciertos = 0;

    const claves = [
        ["oi", "indirecto"],
        ["la"],
        ["la vi"],
        ["dinero"],
        ["a mis papás", "mis papás", "papás"]
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
        ? `<span style="color:#00ff88">¡Perfecto! ${aciertos}/5 🎉 Ya no te confundes con lo/la/le</span>`
        : `<span style="color:#ff9500">${aciertos}/5 aciertos. Respuestas: OI / la / La vi / dinero / a mis papás</span>`;
}