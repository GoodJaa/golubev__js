/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const cookiesMap = getCookies();
let filterValue = '';

function getCookies() {
  return document.cookie
    .split('; ')
    .filter(Boolean)
    .reduce((prev, current) => {
      const [name, value] = current.split('=');
      prev[name] = value;
      return prev;
    }, {});
}

updateTable();

filterNameInput.addEventListener('input', function () {
  filterValue = this.value;
  updateTable();
});

addButton.addEventListener('click', () => {
  let nameCookie = addNameInput.value;
  let valueCookie = addValueInput.value;
  document.cookie = `${nameCookie}=${valueCookie}`;
  cookiesMap[`${nameCookie}`] = `${valueCookie}`;

  updateTable();

  setTimeout(() => {
    addNameInput.value = '';
    addValueInput.value = '';
  }, 0);
});

listTable.addEventListener('click', (e) => {
  const { role, cookieName } = e.target.dataset;

  if (role === 'remove-cookie') {
    delete cookiesMap[cookieName];
    document.cookie = `${cookieName}=deleted; max-age=0`;
    updateTable();
  }
});

function updateTable() {
  const fragment = document.createDocumentFragment();
  let total = 0;

  listTable.innerHTML = '';

  for (let name in cookiesMap) {
    if (cookiesMap.hasOwnProperty(name)) {
      const value = cookiesMap[name];
      if (
        filterValue &&
        !name.toLowerCase().includes(filterValue.toLowerCase()) &&
        !value.toLowerCase().includes(filterValue.toLowerCase())
      ) {
        continue;
      }
      total++;

      const tr = document.createElement('tr');
      const nameTD = document.createElement('td');
      const valueTD = document.createElement('td');
      const removeTD = document.createElement('td');
      const removeBtn = document.createElement('button');

      removeBtn.dataset.role = 'remove-cookie';
      removeBtn.dataset.cookieName = name;
      removeBtn.textContent = 'Удалить';
      nameTD.textContent = name;
      valueTD.textContent = value;
      valueTD.classList.add('value');
      tr.append(nameTD, valueTD, removeTD);
      removeTD.append(removeBtn);

      fragment.append(tr);
    }
  }

  if (total) {
    listTable.parentNode.classList.remove('hidden');
    listTable.append(fragment);
  } else {
    listTable.parentNode.classList.add('hidden');
  }

}