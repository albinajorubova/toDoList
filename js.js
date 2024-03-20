const hiddenBlock = document.querySelector('.tasksContainer');
const allComplBtn = document.querySelector('.allComplBtn');
const toDoItem = document.querySelector('.tasksList');
const btnAllCheck = document.querySelector('.allCompl__label');
const deleteBtnItems = document.querySelectorAll('.taskItem__deleteBtn');
const tabsBtn = document.querySelectorAll('.tasksFilter__btn');
const todoInput = document.querySelector(".todoInputBlock__input");
const clearComplBtn = document.querySelector('.clearComplBtn');
const spanLeft = document.querySelector('.tasksCount');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const toDoList = [];
let countLeft;


if (localStorage.getItem('todo')) {
    const savedToDoList = JSON.parse(localStorage.getItem("todo"));
    toDoList.push(...savedToDoList);
    hiddenBlock.classList.add('showBlock');
    displayTasks();
}

function updateHiddenBlock() {
    if (toDoList.length === 0) {
        hiddenBlock.classList.remove('showBlock');
        allComplBtn.classList.remove('showButton');
    } else {
        hiddenBlock.classList.add('showBlock');
        allComplBtn.classList.add('showButton');
    }
}

updateHiddenBlock();

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addTask(event, todoInput);
    }
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.todoInputBlock')) {
        addTask(event, todoInput);
    }
});

function addTask(event, point) {
    if (event.key == 'Enter' || event.type === 'click') {
        if (point.value.trim() !== '') {
            const newToDo = {
                toDoTxt: point.value,
                checked: false
            };
            point.value = "";
            toDoList.unshift(newToDo);
            displayTasks();
            localStorage.setItem("todo", JSON.stringify(toDoList));
        }
    }
    updateHiddenBlock();
    updateTodoCount();
    filterTodoList();
}

function displayTasks() {
    const displayMessage = toDoList.map((item, i) => `
        <li class='taskItem'>
            <div class='taskContent'>
                <input type='checkbox' name='checkInput' id='item__${i}' ${item.checked && "checked"} />
                <label id="labelTxt" data-id='${i}' class="taskContent__label ${item.checked ? 'labelChecked' : ''}">${item.toDoTxt}</label>
                <input type="text" class="editItemInput" />
            </div>
            <button class='taskItem__deleteBtn' data-id='${i}' />
        </li>
    `).join('');

    toDoItem.innerHTML = displayMessage;

    const hasCheckedItem = toDoList.some(item => item.checked === true);

    if (hasCheckedItem) {
        clearComplBtn.classList.add('showBlock');
    } else {
        clearComplBtn.classList.remove('showBlock');
    }

    addDeleteButtonEventListeners();
}

function filterTodoList() {
    const activeTab = document.querySelector('.tasksFilter__btn.filterActive');
    const data_tab = activeTab.getAttribute('data-tab');
    const taskItems = document.querySelectorAll('.taskItem');

    taskItems.forEach(function (item) {
        const checkbox = item.querySelector('input[type="checkbox"]');
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

function addDeleteButtonEventListeners() {
    const deleteBtnItems = document.querySelectorAll('.taskItem__deleteBtn');
    deleteBtnItems.forEach(function (deleteBtnItem) {
        deleteBtnItem.addEventListener('click', function (event) {
            const numDeleteBtn = parseInt(event.target.getAttribute('data-id'));
            toDoList.splice(numDeleteBtn, 1); 
            localStorage.setItem("todo", JSON.stringify(toDoList));
            updateHiddenBlock();
            displayTasks();
            updateTodoCount();
            filterTodoList();
        });
    });
}

toDoItem.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
        const idInput = event.target.getAttribute('id');
        const labelFor = document.querySelector(`[data-id="${idInput}"]`);

        if (labelFor) {
            if (event.target.checked) {
                labelFor.classList.add('labelChecked');
            } else {
                labelFor.classList.remove('labelChecked');
            }
        }
        const itemIndex = parseInt(idInput.split('__')[1]);
        toDoList[itemIndex].checked = event.target.checked;
        localStorage.setItem("todo", JSON.stringify(toDoList));
        displayTasks();
        updateTodoCount();
        filterTodoList();
    }
});

function updateEditItemInputWidth() {
    const tasks = document.querySelectorAll('.taskItem');
    tasks.forEach(tasks => {
        const editItemInput = tasks.querySelector('.editItemInput');
        const tasksWidth = tasks.getBoundingClientRect().width;
        editItemInput.style.width = `calc(${tasksWidth}px * 0.91)`;
    });
}

toDoItem.addEventListener('dblclick', function (event) {
    if (event.target.tagName === 'LABEL') {
        const labelId = event.target.getAttribute('data-id');
        const labelTxt = event.target.innerText;
        const input = event.target.nextElementSibling;
        input.classList.add('showBlock');
        input.value = labelTxt;
        input.select();
        updateEditItemInputWidth();

        input.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                saveChanges(labelId, input);
            } else if (event.key === 'Escape') {
                input.classList.remove('showBlock');
                input.value = labelTxt;
            }
        });

        document.addEventListener('click', function (event) {
            const isInputClicked = input.contains(event.target) || event.target === input;
            const isInputActive = input.classList.contains('showBlock');
            if (!isInputClicked && isInputActive) {
                saveChanges(labelId, input);
            }
        }, { once: true });
    }
});

function saveChanges(labelId, input) {
    if (input.value.trim() === '') {
        toDoList.splice(labelId, 1);
        localStorage.setItem("todo", JSON.stringify(toDoList));
        updateHiddenBlock();
        displayTasks();
        updateTodoCount();
        filterTodoList();
    } else {
        input.previousElementSibling.innerText = input.value;
        input.classList.remove('showBlock');
        toDoList[labelId].toDoTxt = input.value;
        localStorage.setItem("todo", JSON.stringify(toDoList));
        displayTasks();
        updateTodoCount();
        filterTodoList();
    }
}

function detectUncheckedCheckboxes() {
    let allChecked = true;
    checkboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
            allChecked = false;
            return;
        }
    });
    return !allChecked;
}

function selectAllTasks() {
    checkboxes;
    if (detectUncheckedCheckboxes()) {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = true;
        });
        toDoList.forEach(function (item) {
            if (item.checked !== true) {
                item.checked = true;
                displayTasks();
                localStorage.setItem("todo", JSON.stringify(toDoList));
            }
        });
    } else {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
        toDoList.forEach(function (item) {
            if (item.checked === true) {
                item.checked = false;
                displayTasks();
                localStorage.setItem("todo", JSON.stringify(toDoList));
            }
        });
    }
    updateTodoCount();
    filterTodoList();
}

function clearCompleted() {
    const filteredTasks = toDoList.filter(function (item) {
        return !item.checked;
    });
    toDoList.length = 0;
    filteredTasks.forEach(task => {
        toDoList.push(task);
    });

    localStorage.setItem("todo", JSON.stringify(toDoList));
    displayTasks();
    updateHiddenBlock();
    filterTodoList();
}

function updateTodoCount() {
    countLeft = 0;
    toDoList.forEach(function (item) {
        if (item.checked === false) {
            countLeft++;
        }
    });
    spanLeft.innerHTML = countLeft;

    if (countLeft === 0) {
        btnAllCheck.classList.add('black');
    } else {
        btnAllCheck.classList.remove('black');
    }
}

tabsBtn.forEach(function (item) {
    item.addEventListener("click", function () {
        const currentBtn = item;
        tabsBtn.forEach(function (item) {
            item.classList.remove('filterActive');
        });
        currentBtn.classList.add('filterActive');
        filterTodoList();
    });
});

updateTodoCount();
