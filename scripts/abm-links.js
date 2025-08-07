let currentData = [];
let currentFile = '';

async function loadJSONFiles() {
    const response = await fetch('/db/links/');
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const files = Array.from(doc.links)
        .map(link => link.href)
        .filter(href => href.endsWith('.json'));

    const select = document.getElementById('jsonSelect');
    files.forEach(file => {
        const option = document.createElement('option');
        option.value = file;
        option.textContent = file.split('/').pop();
        select.appendChild(option);
    });

    select.addEventListener('change', () => loadItems(select.value));
    if (files.length) {
        loadItems(files[0]);
    }
}

async function loadItems(file) {
    currentFile = file;
    const response = await fetch(file);
    currentData = await response.json();
    renderItems();
}

function renderItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    currentData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <input type="text" value="${item.Nombre}" onchange="updateItem(${index}, 'Nombre', this.value)">
            <input type="text" value="${item.Url}" onchange="updateItem(${index}, 'Url', this.value)">
            <input type="text" value="${item.Grupo}" onchange="updateItem(${index}, 'Grupo', this.value)">
            <button onclick="deleteItem(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function updateItem(index, field, value) {
    currentData[index][field] = value;
}

function deleteItem(index) {
    currentData.splice(index, 1);
    renderItems();
}

function addItem() {
    const nombre = document.getElementById('newNombre').value;
    const url = document.getElementById('newUrl').value;
    const grupo = document.getElementById('newGrupo').value;
    if (nombre && url && grupo) {
        currentData.push({ Nombre: nombre, Url: url, Grupo: grupo });
        renderItems();
        document.getElementById('newNombre').value = '';
        document.getElementById('newUrl').value = '';
        document.getElementById('newGrupo').value = '';
    }
}

function saveChanges() {
    const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = currentFile.split('/').pop();
    a.click();
}

loadJSONFiles();