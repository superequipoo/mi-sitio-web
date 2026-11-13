document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const respuestas = {
        p1: 'simil',
        p2: 'metafora',
        p3: 'hiperbole',
        p4: 'personificacion',
        p5: 'aliteracion',
        p6: 'oximoron',
        p7: 'metonimia',
        p8: 'antitesis'
    };

    let ok = 0;

    for (let k in respuestas) {
        const input = document.getElementById(k);
        if (!input) continue;

        const val = input.value.toLowerCase().trim();
        const valNormalizado = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        let esCorrecto = valNormalizado.includes(respuestas[k]);
        // Acepta sinónimos válidos que tenías en tu versión original
        if (k === 'p1' && valNormalizado.includes('comparacion')) esCorrecto = true;
        if (k === 'p4' && valNormalizado.includes('prosopopeya')) esCorrecto = true;

        if (esCorrecto) {
            input.style.borderColor = "#00ff88";
            ok++;
        } else {
            input.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/8 ${ok >= 6 ? '🔥 Eres poeta táctico' : '❌ Repasa símil vs metáfora'}`;
    resultado.style.color = ok >= 6 ? '#00ffc6' : '#ff4d4d';
}