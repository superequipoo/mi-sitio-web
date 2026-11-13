document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const checks = {
        p1: ['votar'],
        p2: ['rallar'],
        p3: ['echo'],
        p4: ['aptitud'],
        p5: ['infringir'],
        p6: ['especia'],
        p7: ['absorber'],
        p8: ['homofona', 'homófona']
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
    resultado.innerHTML = `Aciertos: ${ok}/8 ${ok >= 6 ? '🔥 Ya no te trampean' : '❌ Repasa botar/votar y infligir/infringir'}`;
    resultado.style.color = ok >= 6 ? '#00ffc6' : '#ff4d4d';
}