document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-comprobar');
    if (!btn) return;

    btn.addEventListener('click', comprobar);
});

function comprobar() {
    const checks = {
        p1: ['polisemia'],
        p2: ['libro'],
        p3: ['familia'],
        p5: ['polisemia']
    };

    let ok = 0;
    let total = 6;

    // Preguntas 1, 2, 3 y 5 - check normal
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

    // Pregunta 4 - necesita AMBAS palabras: denotación y connotación
    const p4 = document.getElementById('p4');
    if (p4) {
        const val4 = p4.value.toLowerCase().trim();
        const tieneDenotacion = val4.includes('denotacion') || val4.includes('denotación');
        const tieneConnotacion = val4.includes('connotacion') || val4.includes('connotación');
        if (tieneDenotacion && tieneConnotacion) {
            p4.style.borderColor = "#00ff88";
            ok++;
        } else {
            p4.style.borderColor = "#ff2d55";
        }
    }

    // Pregunta 6 - acepta cualquier palabra del campo semántico de hospital
    const p6 = document.getElementById('p6');
    if (p6) {
        const val6 = p6.value.toLowerCase().trim();
        const palabrasHospital = ['medico', 'médico', 'doctor', 'paciente', 'enfermera', 'enfermero', 'bisturi', 'bisturí', 'hospital', 'camilla', 'quirófano', 'quirofano', 'ambulancia', 'medicina', 'pastilla', 'suero', 'jeringa', 'cirugia', 'cirugía', 'estetoscopio', 'consulta', 'receta'];
        const esCorrecto = palabrasHospital.some(c => val6.includes(c));
        if (esCorrecto) {
            p6.style.borderColor = "#00ff88";
            ok++;
        } else {
            p6.style.borderColor = "#ff2d55";
        }
    }

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `Aciertos: ${ok}/${total} ${ok >= 5 ? '🔥 Ya dominas polisemia' : '❌ Repasa banco, sierra y familia léxica'}`;
    resultado.style.color = ok >= 5 ? '#00ffc6' : '#ff4d4d';
}