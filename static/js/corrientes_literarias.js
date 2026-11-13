document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const respuestas = {
        p1: 'renacimiento',
        p2: 'romanticismo',
        p3: 'modernismo',
        p5: 'barroco',
        p6: 'realismo'
    };

    let ok = 0;

    for (let k in respuestas) {
        const input = document.getElementById(k);
        if (!input) continue;
        const val = input.value.toLowerCase().trim();
        const valNormalizado = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (valNormalizado.includes(respuestas[k])) {
            input.style.borderColor = "#00ff88";
            ok++;
        } else {
            input.style.borderColor = "#ff2d55";
        }
    }

    // Pregunta 4 - acepta "realismo mágico" o "boom"
    const p4 = document.getElementById('p4');
    if (p4) {
        const val4 = p4.value.toLowerCase().trim();
        const val4Normalizado = val4.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (val4Normalizado.includes('magico') || val4Normalizado.includes('boom')) {
            p4.style.borderColor = "#00ff88";
            ok++;
        } else {
            p4.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/6 ${ok >= 5 ? '🔥 Historiador literario' : '❌ Memoriza la tablita de arriba'}`;
    resultado.style.color = ok >= 5 ? '#00ffc6' : '#ff4d4d';
}