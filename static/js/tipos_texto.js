document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const respuestas = {
        p1: 'instructivo',
        p2: 'descriptivo',
        p3: 'narrativo',
        p4: 'argumentativo',
        p5: 'expositivo',
        p6: 'dialogado',
        p7: 'instructivo',
        p8: 'argumentativo'
    };

    let ok = 0;

    for (let k in respuestas) {
        const input = document.getElementById(k);
        if (!input) continue;

        const val = input.value.toLowerCase().trim();
        const valNormalizado = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        let esCorrecto = valNormalizado.includes(respuestas[k]);
        // Acepta sinónimos válidos
        if (k === 'p6' && valNormalizado.includes('conversacional')) esCorrecto = true;
        if (k === 'p6' && valNormalizado.includes('dialogo')) esCorrecto = true;
        if (k === 'p5' && valNormalizado.includes('informativo')) esCorrecto = true;

        if (esCorrecto) {
            input.style.borderColor = "#00ff88";
            ok++;
        } else {
            input.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/8 ${ok >= 6 ? '🔥 Ya identificas cualquier texto' : '❌ Repasa: ¿Cuenta? ¿Describe? ¿Explica? ¿Convence?'}`;
    resultado.style.color = ok >= 6 ? '#00ffc6' : '#ff4d4d';
}