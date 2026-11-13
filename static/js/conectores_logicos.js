document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const checks = {
        p1: ['por lo tanto', 'por eso', 'por consiguiente', 'asi que', 'consecuencia'],
        p2: ['pero', 'sin embargo', 'contraste'],
        p3: ['por ejemplo', 'verbigracia', 'ejemplificacion'],
        p4: ['si', 'condicion'],
        p5: ['en conclusion', 'conclusion', 'finalmente'],
        p6: ['ademas', 'tambien', 'asimismo', 'adicion'],
        p7: ['porque', 'ya que', 'causa'],
        p8: ['aclaracion', 'explicacion', 'enfasis']
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
    resultado.innerHTML = `Aciertos: ${ok}/8 ${ok >= 6 ? '🔥 Conector master' : '❌ Repasa causa vs consecuencia'}`;
    resultado.style.color = ok >= 6 ? '#00ffc6' : '#ff4d4d';
}