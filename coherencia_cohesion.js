document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const checks = {
        p1: ['coherencia'],
        p2: ['cohesion'],
        p3: ['referencia', 'pronombre'],
        p4: ['sustitucion', 'sinonimo', 'lexica'],
        p5: ['elipsis'],
        p6: ['adecuacion'],
        p7: ['coherencia']
    };

    let ok = 0;

    for (let k in checks) {
        const input = document.getElementById(k);
        if (!input) continue;

        const val = input.value.toLowerCase().trim();
        const valNormalizado = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const esCorrecto = checks[k].some(c => valNormalizado.includes(c));

        if (esCorrecto) {
            input.style.borderColor = "#00ff88";
            ok++;
        } else {
            input.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/7 ${ok >= 5 ? '🔥 Texto perfecto' : '❌ Repasa diferencia fondo vs forma'}`;
    resultado.style.color = ok >= 5 ? '#00ffc6' : '#ff4d4d';
}