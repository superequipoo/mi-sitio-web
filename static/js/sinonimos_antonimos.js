document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const checks = {
        p1: ['pasajero', 'fugaz', 'temporal', 'breve'],
        p2: ['efimero', 'efímero', 'temporal', 'pasajero', 'fugaz'],
        p3: ['arrogante', 'altiva', 'soberbia', 'prepotente'],
        p4: ['opaco', 'turbio'],
        p5: ['paronimo', 'parónimo'],
        p6: ['breve', 'conciso', 'corto'],
        p7: ['exacerbar', 'agravar', 'empeorar', 'intensificar'],
        p8: ['complementario']
    };

    let ok = 0;

    for (let k in checks) {
        const input = document.getElementById(k);
        if (!input) continue;
        const val = input.value.toLowerCase().trim();
        const esCorrecto = checks[k].some(c => val.includes(c));
        if (esCorrecto) {
            input.style.borderColor = "#00ff88";
            ok++;
        } else {
            input.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/8 ${ok >= 6 ? '🔥 Diccionario andante' : '❌ Repasa la listita'}`;
    resultado.style.color = ok >= 6 ? '#00ffc6' : '#ff4d4d';
}