const hiddenInput = document.querySelector('.hiddenInput');
hiddenInput.style.setProperty('--listItemWidth', 'calc(91%)');

const hiddenBlock = document.querySelector('.hiddenBlock');
let toDoItem = document.querySelector('.mainList');
let toDoList = []; 
let btnAllCheck = document.querySelector('.allComplLabel');
let delXItems = document.querySelectorAll('.delX');
const tabsBtn = document.querySelectorAll('.tabsBtn');

if(localStorage.getItem('todo')){  
    toDoList = JSON.parse(localStorage.getItem ("todo"));
    hiddenBlock.classList.add('active');
    displayMessages();
}

// Обновление видимости скрытого блока
function updateHiddenBlock() {
    if (toDoList.length === 0) {
        hiddenBlock.classList.remove('active'); 
    } else {
        hiddenBlock.classList.add('active'); 
    }
}
updateHiddenBlock();

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        todoAdd(event, document.querySelector('.mainInput'));
    }
});

document.addEventListener('click', function(event) {
    if (!event.target.closest('.todoInput')) {
        todoAdd(event, document.querySelector('.mainInput'));
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
        <div class='listItem'>
            <section class='leftItem'>
                <input type='checkbox' name='checkInput' id='item__${i}' ${item.checked ? 'checked': ''} />
                <label for="" id="labelTxt" data-id='${i}' class="labelTxt ${item.checked ? 'labelChecked' : ''}">${item.toDoTxt}</label>
                <input type="text" class="hiddenInput" style="--listItemWidth: calc(100% - 50px);"  />
            </section>
            <button class='delX' data-id='${i}'></button>
        </div>
        `;
    }
    toDoItem.innerHTML = displayMessage;

    // Остальной код функции остается неизменным
    let hasCheckedItem = toDoList.some(item => item.checked === true);
    if (hasCheckedItem) {
        document.querySelector('.clearCompl').classList.add('active');
    } else {
        document.querySelector('.clearCompl').classList.remove('active');
    }

    addDeleteButtonEventListeners();    
    filteredList();
}


function filteredList() {
    const activeTab = document.querySelector('.tabActive');
    let dataTab = activeTab.getAttribute('data-tab');
    let toDoItems = document.querySelectorAll('.mainList .listItem');

    toDoItems.forEach(function(item) {
        let checkbox = item.querySelector('input[type="checkbox"]');
        if (dataTab === "active" && checkbox.checked) {
            item.style.display = 'none';
        } else if (dataTab === "completed" && !checkbox.checked) {
            item.style.display = 'none';
        } else {
            item.style.display = ''; 
        }
    });
    updateHiddenBlock(); 
}

// Обработчик событий для кнопок удаления задачи
function addDeleteButtonEventListeners() {
    let delXItems = document.querySelectorAll('.delX');
    delXItems.forEach(function(delXItem) {
        delXItem.addEventListener('click', function(event) {
            let numDelX = parseInt(event.target.getAttribute('data-id'));
            toDoList = toDoList.filter((item, index) => index !== numDelX);
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

// Обработчик двойного клика для редактирования & редактирование
toDoItem.addEventListener('dblclick', function(event) {
    if (event.target.tagName === 'LABEL') { 
        let labelId = event.target.getAttribute('data-id');
        let labelTxt = event.target.innerText;
        let input = event.target.nextElementSibling;     
        input.classList.add('active');
        input.value = labelTxt;   
        input.select();
        
        function saveChanges() {
            if (input.value.trim() === '') { 
                toDoList.splice(labelId, 1);
                localStorage.setItem("todo", JSON.stringify(toDoList)); 
                updateHiddenBlock();
                displayMessages(); 
                countLefts(); 
            } else {
                event.target.previousElementSibling.innerText = input.value;
                input.classList.remove('active');
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
                input.classList.remove('active');
                input.value = labelTxt; 
            }
        });
        
        document.addEventListener('click', function(event) {
            let isInputClicked = input.contains(event.target) || event.target === input;
            let isInputActive = input.classList.contains('active');
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
let spanLeft = document.querySelector('.spanLeft');

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
        .allComplLabel::before {
            color: #484848;
          }
        `;
        document.head.appendChild(style);
    }
    else{
        let style = document.createElement('style');
        style.innerHTML = `
        .allComplLabel::before {
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
            item.classList.remove('tabActive');
        });
        currentBtn.classList.add('tabActive');
        filteredList();
    });
   
});

countLefts();
