const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data;
try {
  data = JSON.parse(sourceJson);
} catch (e) {
  data = null;
}

const titleEl = document.querySelector('#event-title');
const dateEl = document.querySelector('#event-date');
const placeEl = document.querySelector('#event-place');
const descEl = document.querySelector('#event-description');
const programEl = document.querySelector('#program');
const showProgramBtn = document.querySelector('#show-program');
const form = document.querySelector('#service-form');
const dataError = document.querySelector('#data-error');
const choiceError = document.querySelector('#choice-error');
const resultEl = document.querySelector('#result');
const reportJsonEl = document.querySelector('#report-json');
const guideBox = document.querySelector('#guide');
const audioBox = document.querySelector('#audio');
const catalogBox = document.querySelector('#catalog');

if (data === null) {
  showProgramBtn.hidden = true;
  dataError.hidden = false;
  form.hidden = true;
} else {
  showProgramBtn.hidden = false;
  titleEl.textContent = data.event.title;
  dateEl.textContent = data.event.date;
  placeEl.textContent = data.event.place;
  descEl.textContent = data.event.description;
  form.hidden = false;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selectedIds = [];
  if (guideChecked) selectedIds.push('guide');
  if (audioChecked) selectedIds.push('audio');
  if (catalogChecked) selectedIds.push('catalog');

  const items = services
    .filter(function (s) { return selectedIds.indexOf(s.id) !== -1; })
    .map(function (s) {
      const { title, price } = s;
      return { title: title.trim(), price: price };
    });

  const total = items.reduce(function (sum, it) { return sum + it.price; }, 0);
  const count = items.length;

  return { count: count, total: total, items: items };
}

showProgramBtn.addEventListener('click', function () {
  programEl.hidden = false;
  programEl.innerHTML = data.event.meeting;
});

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const guideChecked = guideBox.checked;
  const audioChecked = audioBox.checked;
  const catalogChecked = catalogBox.checked;

  const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

  if (report.count === 0) {
    choiceError.hidden = false;
    resultEl.hidden = true;
    reportJsonEl.hidden = true;
    return;
  }

  choiceError.hidden = true;

  let html = 'Выбрано услуг: ' + report.count + '<br>' +
             'Итого: ' + report.total + ' руб.';
  for (let i = 0; i < report.items.length; i++) {
    html += '<br>' + report.items[i].title;
  }
  resultEl.innerHTML = html;
  resultEl.hidden = false;

  const jsonStr = JSON.stringify(report);
  JSON.parse(jsonStr); // проверка
  reportJsonEl.textContent = jsonStr;
  reportJsonEl.hidden = false;
});