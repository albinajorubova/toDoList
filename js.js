const hiddenBlock = document.getElementsByClassName('hiddenBlock')[0];
let toDoItem = document.querySelector('.mainList');
let toDoList = []; 
let btnAllCheck = document.querySelector('.allCompl-label');
let delXItems = document.getElementsByClassName('delX');
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

// Добавление задачи
function todoAdd(point){
    if(event.key == 'Enter'){
        if(point.value.trim() !== '' && point.value !== null){
            let inputValue = point.value;
            point.value = "";
            document.getElementById("labelTxt").textContent = inputValue; 
            let newToDo ={
                toDoTxt: inputValue,
                checked: false
            }
            toDoList.push(newToDo);
            displayMessages();
            localStorage.setItem ("todo", JSON.stringify(toDoList));
        }
    }
    updateHiddenBlock();
    countLefts();
    filteredList(); 
}

// Отображение списка задач
function displayMessages(){
    let displayMessage = '';
    toDoList.forEach(function(item, i){
    displayMessage += `
    <div class='list__item'>
    <section class='leftItem'>
      <input type='checkbox' name='checkInput'  id='item__${i}' ${item.checked ? 'checked': ''} />
      <label for="" id="labelTxt" data-id='${i}' class="labelTxt ${item.checked ? 'label-checked' : ''}">${item.toDoTxt}</label>
      <input type="text" class="hiddenInput" style="--list__item-width: calc(100% - 50px);"  />
    </section>
    <button class='delX' data-id='${i}'></button>
  </div>
    `;
    toDoItem.innerHTML = displayMessage;
    });

    let hasCheckedItem = toDoList.some(item => item.checked === true);
    if (hasCheckedItem) {
        document.querySelector('.clearCompl').classList.add('active');
    } else {
        document.querySelector('.clearCompl').classList.remove('active');
    }

    addDeleteButtonEventListeners();    
   
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
                labelFor.classList.add('label-checked');
            } else {
                labelFor.classList.remove('label-checked');
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
        input.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
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
        });
    document.addEventListener('click', function(event) {
    let isInputClicked = input.contains(event.target) || event.target === input;
    let isInputActive = input.classList.contains('active');
    if (!isInputClicked && isInputActive) {
        input.classList.remove('active');
    }
});

    } 
});


var checkboxes = document.querySelectorAll('input[type="checkbox"]');
// Получение информации об отмеченных чекбоксах
function NotAllCheckboxesChecked() {
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
    if (NotAllCheckboxesChecked()) {
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
    let filteredList = toDoList.filter(function(item) {
        return !item.checked;
    });
    toDoList = filteredList;
    localStorage.setItem("todo", JSON.stringify(toDoList));
    displayMessages();
    updateHiddenBlock();
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
        .allCompl+label::before {
            color: #484848;
          }
        `;
        document.head.appendChild(style);
    }
    else{
        let style = document.createElement('style');
        style.innerHTML = `
        .allCompl+label::before {
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
            item.classList.remove('tab__active');
        });
        currentBtn.classList.add('tab__active');
        filteredList();
    });
   
});

function filteredList() {
    const activeTab = document.querySelector('.tab__active');
    let data_tab = activeTab.getAttribute('data-tab');
    console.log(data_tab);
    let toDoItems = document.querySelectorAll('.mainList .list__item');

    toDoItems.forEach(function(item) {
        let checkbox = item.querySelector('input[type="checkbox"]');
        if (data_tab === "active" && checkbox.checked) {
            item.style.display = 'none';
        } else if (data_tab === "completed" && !checkbox.checked) {
            item.style.display = 'none';
        } else {
            item.style.display = ''; 
        }
    });
    updateHiddenBlock(); 
}




countLefts();