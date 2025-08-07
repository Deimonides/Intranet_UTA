let novedades = [];

async function cargarNovedades() {
    const res = await fetch('/db/novedades.json');
    novedades = await res.json();
    renderNovedades();
}

function renderNovedades() {
    const container = document.getElementById('novedades');
    container.innerHTML = '';

    const visibles = novedades.filter(n => n.Mostrar === 1)
                                .sort((a,b) => new Date(b.Fecha) - new Date(a.Fecha));
    const inactivos = novedades.filter(n => n.Mostrar === 0)
                                .sort((a,b) => new Date(b.Fecha) - new Date(a.Fecha));
    const renderGroup = (group, className) => {
        group.forEach((n, idx) => {
            const div = document.createElement('div');
            div.className = `novedad ${className}`;

            const titulo = document.createElement('input');
            titulo.value = n.Titulo;
            titulo.oninput = e => n.Titulo = e.target.value;

            const fecha = document.createElement('input');
            fecha.type = 'date';
            fecha.value = n.Fecha;
            fecha.oninput = e => n.Fecha = e.target.value;

            const texto = document.createElement('textarea');
            texto.value = n.Texto;
            texto.oninput = e => n.Texto = e.target.value;

            const mostrar = document.createElement('input');
            mostrar.type = 'checkbox';
            mostrar.checked = n.Mostrar === 1;
            mostrar.onchange = e => n.Mostrar = e.target.checked ? 1 : 0;

            const eliminar = document.createElement('button');
            eliminar.textContent = 'Eliminar';
            eliminar.onclick = () => { novedades.splice(novedades.indexOf(n), 1); renderNovedades(); };

            div.appendChild(titulo);
            div.appendChild(fecha);
            div.appendChild(texto);
            div.appendChild(mostrar);
            div.appendChild(eliminar);

            container.appendChild(div);
        });
    };

    renderGroup(visibles, 'visible');
    renderGroup(inactivos, 'invisible');
}

function addNovedad() {
    const titulo = document.getElementById('new-titulo').value;
    const fecha = document.getElementById('new-fecha').value;
    const texto = document.getElementById('new-texto').value;
    const mostrar = document.getElementById('new-mostrar').checked ? 1 : 0;

    if (!titulo || !fecha || !texto) { alert('Completar todos los campos'); return; }

    novedades.push({ Titulo: titulo, Fecha: fecha, Texto: texto, Mostrar: mostrar });
    renderNovedades();
}

async function guardarCambios() {
    const res = await fetch('/save-novedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novedades)
    });
    if (res.ok) {
        alert('Guardado correctamente');
    } else {
        alert('Error al guardar');
    }
}

cargarNovedades();