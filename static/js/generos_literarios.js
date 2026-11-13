document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const respuestas = {
        p1: 'dramatico',
        p2: 'lirico',
        p3: 'narrativo',
        p4: 'lirico',
        p5: 'dramatico',
        p6: 'didactico'
    };

    let ok = 0;

    for (let k in respuestas) {
        const input = document.getElementById(k);
        if (!input) continue;
        const val = input.value.toLowerCase().trim();
        // Normaliza acentos para que "lírico" y "lirico" valgan igual
        const valNormalizado = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (valNormalizado.includes(respuestas[k])) {
            input.style.borderColor = "#00ff88";
            ok++;
        } else {
            input.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/6 ${ok >= 5 ? '🔥 Misión cumplida' : '❌ Sigue practicando'}`;
    resultado.style.color = ok >= 5 ? '#00ffc6' : '#ff4d4d';
}