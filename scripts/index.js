async function loadJSON(file) {
    const response = await fetch(file);
    return await response.json();
}

function createStatusCircle(value) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    if (value === -1) circle.style.background = 'red';
    else if (value === 0) circle.style.background = 'yellow';
    else if (value === 1) circle.style.background = 'green';
    return circle;
}

function renderStatus(data) {
    const statusDiv = document.getElementById('status');
    for (const key in data) {
        const item = document.createElement('div');
        item.className = 'status-item';
        const circle = createStatusCircle(data[key]);
        const label = document.createElement('span');
        label.textContent = `${key}: ` +
            (data[key] === -1 ? 'Caído' : data[key] === 0 ? 'Afectado' : 'Normal');
        item.appendChild(circle);
        item.appendChild(label);
        statusDiv.appendChild(item);
    }
}

function renderLinks(data, containerId) {
    const container = document.getElementById(containerId);
    const grupos = {};
    data.forEach(link => {
        if (!grupos[link.Grupo]) grupos[link.Grupo] = [];
        grupos[link.Grupo].push(link);
    });
    for (const grupo in grupos) {
        const grupoDiv = document.createElement('div');
        grupoDiv.className = 'grupo';
        const title = document.createElement('div');
        title.className = 'grupo-title';
        title.textContent = grupo;
        grupoDiv.appendChild(title);
        grupos[grupo].forEach(link => {
            const a = document.createElement('a');
            a.className = 'link-item';
            a.href = link.Url;
            a.textContent = link.Nombre;
            a.target = '_blank';
            a.style.display = 'block';
            grupoDiv.appendChild(a);
        });
        container.appendChild(grupoDiv);
    }
}

// function renderNovedades(data) {
//     const novedadesDiv = document.getElementById('novedades');
//     const filtered = data.filter(n => n.Mostrar === 1)
//                           .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
//     const novedadesList = document.createElement('div');
//     filtered.forEach(n => {
//         const novedadDiv = document.createElement('div');
//         novedadDiv.className = 'novedad';
        
//         const title = document.createElement('div');
//         title.className = 'novedad-title';
//         title.textContent = n.Titulo;
        
//         const date = document.createElement('div');
//         date.style.float = 'right';
//         date.textContent = n.Fecha;
        
//         const text = document.createElement('div');
//         text.textContent = n.Texto;
//         novedadDiv.appendChild(title);
//         novedadDiv.appendChild(date);
//         novedadDiv.appendChild(text);
//         novedadesList.appendChild(novedadDiv);
//     });
//     novedadesDiv.appendChild(novedadesList);
// }

function renderNovedades(data) {
    const novedadesDiv = document.getElementById('novedades');
    const filtered = data.filter(n => n.Mostrar === 1)
                          .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
    const novedadesList = document.createElement('div');
    filtered.forEach(n => {
        const novedadDiv = document.createElement('div');
        novedadDiv.className = 'novedad';

        // Nuevo contenedor para Título + Fecha
        const header = document.createElement('div');
        header.className = 'novedad-header';

        const title = document.createElement('div');
        title.className = 'novedad-title';
        title.textContent = n.Titulo;

        const date = document.createElement('div');
        date.className = 'novedad-date';
        date.textContent = n.Fecha;

        header.appendChild(title);
        header.appendChild(date);

        const text = document.createElement('div');
        text.className = 'novedad-text';
        text.textContent = n.Texto;

        novedadDiv.appendChild(header);
        novedadDiv.appendChild(text);
        novedadesList.appendChild(novedadDiv);
    });
    novedadesDiv.appendChild(novedadesList);
}



async function init() {
    const estados      = await loadJSON('../db/servicios.json');
    const novedades    = await loadJSON('../db/novedades.json');
    const internos     = await loadJSON('../db/links/internos.json');
    const oficiales    = await loadJSON('../db/links/oficiales.json');
    const herramientas = await loadJSON('../db/links/herramientas.json');
    const instructivos = await loadJSON('../db/links/instructivos.json');

    renderStatus(estados);
    renderNovedades(novedades);
    renderLinks(internos,     'internos');
    renderLinks(oficiales,    'oficiales');
    renderLinks(herramientas, 'herramientas');
    renderLinks(instructivos, 'instructivos');
}

init();