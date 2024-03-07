const hiddenBlock = document.querySelector('.tasksContainer');
const allComplBtn = document.querySelector('.allComplBtn');
let toDoItem = document.querySelector('.tasksList');
let toDoList = []; 
let btnAllCheck = document.querySelector('.allCompl__label');
let deleteBtnItems = document.querySelectorAll('.taskItem__deleteBtn');
const tabsBtn = document.querySelectorAll('.tasksFilter__btn');

if(localStorage.getItem('todo')){  
    toDoList = JSON.parse(localStorage.getItem ("todo"));
    hiddenBlock.classList.add('showBlock');
    displayMessages();
}

// Обновление видимости скрытого блока
function updateHiddenBlock() {
    if (toDoList.length === 0) {
        hiddenBlock.classList.remove('showBlock'); 
        allComplBtn.classList.remove('showButton')
    } else {
        hiddenBlock.classList.add('showBlock'); 
        allComplBtn.classList.add('showButton')
    }
}
updateHiddenBlock();

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        todoAdd(event, document.querySelector('.todoInput__input'));
    }
});

document.addEventListener('click', function(event) {
    if (!event.target.closest('.todoInput')) {
        todoAdd(event, document.querySelector('.todoInput__input'));
    }
});

// Добавление задачи
function todoAdd(event, point){
    if(event.key == 'Enter' || event.type === 'click'){
        if(point.value.trim() !== '' && point.value !== null){
            let inputValue = point.value;
            point.value = "";
            let newToDo ={
                toDoTxt: inputValue,
                checked: false
            }
            toDoList.unshift(newToDo);
            displayMessages();
            filteredList(); 
            localStorage.setItem ("todo", JSON.stringify(toDoList));
        }
    }
    updateHiddenBlock();
    countLefts();
}

// Отображение списка задач в обратном порядке
function displayMessages(){
    let displayMessage = '';
    for (let i = 0; i < toDoList.length; i++) {
        const item = toDoList[i];
        displayMessage += `
        <li class='taskItem'>
            <div class='taskContent'>
                <input type='checkbox' name='checkInput' id='item__${i}' ${item.checked ? 'checked': ''} />
                <label id="labelTxt" data-id='${i}' class="taskContent__label ${item.checked ? 'labelChecked' : ''}">${item.toDoTxt}</label>
                <input type="text" class="editItemInput"  />
            </div>
            <button class='taskItem__deleteBtn' data-id='${i}'></button>
        </li>
        `;
    }
    toDoItem.innerHTML = displayMessage;

    let hasCheckedItem = toDoList.some(item => item.checked === true);
    if (hasCheckedItem) {
        document.querySelector('.clearComplBtn').classList.add('showBlock');
    } else {
        document.querySelector('.clearComplBtn').classList.remove('showBlock');
    }
    addDeleteButtonEventListeners();    
    filteredList();
}

//функция фильтрации по кнопкам
function filteredList() {
    const tabsBtn = document.querySelectorAll('.tasksFilter__btn');
    const tasks = document.querySelectorAll('.taskItem');
  
    tabsBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        tabsBtn.forEach(tab => tab.classList.remove('filterActive'));
        btn.classList.add('filterActive');
  
        const tab = btn.getAttribute('data-tab');
        tasks.forEach(task => {
          if (tab === 'all') {
            task.style.display = 'flex';
          } else if (tab === 'active' && !task.querySelector('input[type="checkbox"]').checked) {
            task.style.display = 'flex';
          } else if (tab === 'completed' && task.querySelector('input[type="checkbox"]').checked) {
            task.style.display = 'flex';
          } else {
            task.style.display = 'none';
          }
        });
      });
    });
  }

// Обработчик событий для кнопок удаления задачи
function addDeleteButtonEventListeners() {
    let deleteBtnItems = document.querySelectorAll('.taskItem__deleteBtn');
    deleteBtnItems.forEach(function(deleteBtnItem) {
        deleteBtnItem.addEventListener('click', function(event) {
            let numdeleteBtn = parseInt(event.target.getAttribute('data-id'));
            toDoList = toDoList.filter((item, index) => index !== numdeleteBtn);
            localStorage.setItem("todo", JSON.stringify(toDoList));
            updateHiddenBlock();
            displayMessages();
            countLefts();
            filteredList();
        });
    });
}
 
// Обработчик изменения состояния чекбоксов
toDoItem.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        let idInput = event.target.getAttribute('id');
        let labelFor = document.querySelector(`[data-id="${idInput}"]`);

        if (labelFor) {
            if (event.target.checked) {
                labelFor.classList.add('labelChecked');
            } else {
                labelFor.classList.remove('labelChecked');
            }
        }

        let itemIndex = parseInt(idInput.split('__')[1]);
        toDoList[itemIndex].checked = event.target.checked;
        localStorage.setItem("todo", JSON.stringify(toDoList));
        displayMessages();
        countLefts();
        filteredList();
    }
});

// Функция для установки ширины 
function updateeditItemInputWidth() {
    const tasks = document.querySelectorAll('.taskItem');
    tasks.forEach(tasks => {
        const editItemInput = tasks.querySelector('.editItemInput');
        const tasksWidth = tasks.getBoundingClientRect().width;
        editItemInput.style.width = `calc(${tasksWidth}px * 0.91)`;
    });
}

// Обработчик двойного клика для редактирования & редактирование
toDoItem.addEventListener('dblclick', function(event) {
    if (event.target.tagName === 'LABEL') { 
        let labelId = event.target.getAttribute('data-id');
        let labelTxt = event.target.innerText;
        let input = event.target.nextElementSibling;     
        input.classList.add('showBlock');
        input.value = labelTxt;   
        input.select();
        updateeditItemInputWidth();
        function saveChanges() {
            if (input.value.trim() === '') { 
                toDoList.splice(labelId, 1);
                localStorage.setItem("todo", JSON.stringify(toDoList)); 
                updateHiddenBlock();
                displayMessages(); 
                countLefts(); 
            } else {
                event.target.previousElementSibling.innerText = input.value;
                input.classList.remove('showBlock');
                toDoList[labelId].toDoTxt = input.value;  
                localStorage.setItem("todo", JSON.stringify(toDoList));  
                displayMessages(); 
                countLefts();  
            }
        }
        
        input.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                saveChanges();
            } else if (event.key === 'Escape') {
                input.classList.remove('showBlock');
                input.value = labelTxt; 
            }
        });
        
        document.addEventListener('click', function(event) {
            let isInputClicked = input.contains(event.target) || event.target === input;
            let isInputActive = input.classList.contains('showBlock');
            if (!isInputClicked && isInputActive) {
                saveChanges();
            }
        });
    } 
});

var checkboxes = document.querySelectorAll('input[type="checkbox"]');
// Получение информации об отмеченных чекбоксах
function notAllCheckboxesChecked() {
    let allChecked = true;
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        allChecked = false;
        return;
      }
    });
    return !allChecked;
}

// Кнопка отметить все задачи/снять все задачи
function selectAll() {
    if (notAllCheckboxesChecked()) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;  
        });
        toDoList.forEach(function(item) {
            if (item.checked !== true) {
                item.checked = true;       
                displayMessages();   
                localStorage.setItem("todo", JSON.stringify(toDoList));
            }
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;    
        });
        toDoList.forEach(function(item) {
            if (item.checked === true) { 
                item.checked = false;   
                displayMessages();       
                localStorage.setItem("todo", JSON.stringify(toDoList));
            }
        });
    }
    countLefts();
    filteredList();
}

// Удалить выполненные задачи
function clearCompleted() {
    let filteredTasks  = toDoList.filter(function(item) {
        return !item.checked;
    });
    toDoList = filteredTasks;
    localStorage.setItem("todo", JSON.stringify(toDoList));
    displayMessages();
    updateHiddenBlock();
    filteredList();
}


let countLeft;
let spanLeft = document.querySelector('.tasksCount');

// Подсчет оставшихся задач
function countLefts(){
    countLeft = 0; 
    toDoList.forEach(function(item){
        if(item.checked === false){
            countLeft++;
        }
        
    });
    spanLeft.innerHTML = countLeft;
    if (countLeft === 0){
        let style = document.createElement('style');
        style.innerHTML = `
        .allCompl__label::before {
            color: #484848;
          }
        `;
        document.head.appendChild(style);
    }
    else{
        let style = document.createElement('style');
        style.innerHTML = `
        .allCompl__label::before {
            color: #949494;
          }
        `;
        document.head.appendChild(style);
    }
}

// Обработчик клика по вкладкам-фильтрам
tabsBtn.forEach(function(item) {
    item.addEventListener("click", function() {
        let currentBtn = item;
        let tabId = currentBtn.getAttribute('data-tab');
        tabsBtn.forEach(function(item) {
            item.classList.remove('filterActive');
        });
        currentBtn.classList.add('filterActive');
        filteredList();
    });
});

countLefts();