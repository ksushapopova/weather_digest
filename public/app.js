const statusEl = document.getElementById('status');
const reportSection = document.getElementById('report');
const cityTitleEl = document.getElementById('city-title');
const cityMetaEl = document.getElementById('city-meta');
const forecastBodyEl = document.getElementById('forecast-body');
const fileInput = document.getElementById('report-file');
const nameInput = document.getElementById('report-name');
const loadByNameBtn = document.getElementById('load-by-name');

function setStatus(message, kind = 'info') {
  statusEl.textContent = message;
  statusEl.classList.remove('error', 'ok');
  if (kind === 'error') statusEl.classList.add('error');
  if (kind === 'ok') statusEl.classList.add('ok');
}

function clearReport() {
  reportSection.hidden = true;
  cityTitleEl.textContent = '';
  cityMetaEl.textContent = '';
  forecastBodyEl.replaceChildren();
}

function renderReport(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Отчёт пуст или имеет неверный формат');
  }
  if (!Array.isArray(data.forecast)) {
    throw new Error('В отчёте отсутствует массив forecast');
  }

  cityTitleEl.textContent = `${data.city ?? 'Неизвестный город'}, ${data.country ?? ''}`.trim();
  cityMetaEl.textContent = `Координаты: ${data.latitude}, ${data.longitude} · Дней: ${data.forecast.length}`;

  const rows = data.forecast.map((day) => {
    const tr = document.createElement('tr');

    const tdDate = document.createElement('td');
    tdDate.textContent = day.date;

    const tdMin = document.createElement('td');
    tdMin.textContent = formatNumber(day.tMin);

    const tdMax = document.createElement('td');
    tdMax.textContent = formatNumber(day.tMax);

    const tdPrec = document.createElement('td');
    tdPrec.textContent = formatNumber(day.precipitation);

    tr.append(tdDate, tdMin, tdMax, tdPrec);
    return tr;
  });

  forecastBodyEl.replaceChildren(...rows);
  reportSection.hidden = false;
}

function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(1) : '—';
}

function parseAndRender(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Файл не является корректным JSON');
  }
  renderReport(data);
}

async function loadReportByName(filename) {
  const clean = String(filename).trim();
  if (!clean) {
    setStatus('Укажите имя файла', 'error');
    return;
  }
  if (clean.includes('..') || clean.includes('/') || clean.includes('\\')) {
    setStatus('Имя файла не должно содержать путь', 'error');
    return;
  }

  try {
    setStatus('Загружаем…');
    const response = await fetch(`../reports/${encodeURIComponent(clean)}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    parseAndRender(text);
    setStatus(`Загружен отчёт: ${clean}`, 'ok');
  } catch (err) {
    clearReport();
    setStatus(`Не удалось загрузить: ${err.message}`, 'error');
  }
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setStatus('Читаем файл…');
    const text = await file.text();
    parseAndRender(text);
    setStatus(`Загружен отчёт: ${file.name}`, 'ok');
  } catch (err) {
    clearReport();
    setStatus(`Ошибка: ${err.message}`, 'error');
  }
});

loadByNameBtn.addEventListener('click', () => {
  loadReportByName(nameInput.value);
});

nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    loadReportByName(nameInput.value);
  }
});