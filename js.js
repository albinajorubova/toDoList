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

const displayTasks = () => {
    const displayMessage = toDoList.map((item, i) => `
        <li class='taskItem'>
            <div class='taskContent'>
                <input type='checkbox' name='checkInput' id='item__${i}' ${item.checked && "checked"} />
                <label id="labelTxt" data-id='${i}' class="taskContent__label ${item.checked ? 'labelChecked' : ''}">${item.toDoTxt}</label>
                <input type="text" class="editItemInput" />
            </div>
            <button class='taskItem__deleteBtn' data-id='${i}'></button>
        </li>
    `).join('');

    toDoItem.innerHTML = displayMessage;
    const hasCheckedItem = toDoList.some(item => item.checked);
    clearComplBtn.classList.toggle('showBlock', hasCheckedItem);    
    addRemovalButton();
};

const addRemovalButton = () => {
    const deleteBtnItems = document.querySelectorAll('.taskItem__deleteBtn');
    deleteBtnItems.forEach(deleteBtnItem => {
        deleteBtnItem.addEventListener('click', event => {
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

if (localStorage.getItem('todo')) {
    const savedToDoList = JSON.parse(localStorage.getItem("todo"));
    toDoList.push(...savedToDoList);
    hiddenBlock.classList.add('showBlock');
    displayTasks();
}

const updateHiddenBlock = () => {
    const isEmpty = toDoList.length === 0;
    hiddenBlock.classList.toggle('showBlock', !isEmpty);
    allComplBtn.classList.toggle('showButton', !isEmpty);
};

updateHiddenBlock();

document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        addTask(event, todoInput);
    }
});

document.addEventListener('click', event => {
    if (!event.target.closest('.todoInputBlock')) {
        addTask(event, todoInput);
    }
});

const addTask = (event, point) => {
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
};

const filterTodoList = () => {
    const activeTab = document.querySelector('.tasksFilter__btn.filterActive');
    const data_tab = activeTab.getAttribute('data-tab');
    const taskItems = document.querySelectorAll('.taskItem');

    taskItems.forEach(item => {
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

toDoItem.addEventListener('change', event => {
    if (event.target.type === 'checkbox') {
        const idInput = event.target.getAttribute('id');
        const labelFor = document.querySelector(`[data-id="${idInput}"]`);
        if (labelFor) {
            labelFor.classList.toggle('labelChecked', event.target.checked);
        }
        const itemIndex = parseInt(idInput.split('__')[1]);
        toDoList[itemIndex].checked = event.target.checked;

        localStorage.setItem("todo", JSON.stringify(toDoList));
        displayTasks();
        updateTodoCount();
        filterTodoList();
    }
});

const updateEditItemInputWidth = () => {
    const tasks = document.querySelectorAll('.taskItem');
    tasks.forEach(tasks => {
        const editItemInput = tasks.querySelector('.editItemInput');
        const tasksWidth = tasks.getBoundingClientRect().width;
        editItemInput.style.width = `calc(${tasksWidth}px * 0.91)`;
    });
}

toDoItem.addEventListener('dblclick', event => {
    if (event.target.tagName === 'LABEL') {
        const labelId = event.target.getAttribute('data-id');
        const labelTxt = event.target.innerText;
        const input = event.target.nextElementSibling;
        input.classList.add('showBlock');
        input.value = labelTxt;
        input.select();
        updateEditItemInputWidth();

        input.addEventListener('keyup', event => {
            if (event.key === 'Enter') {
                saveChanges(labelId, input);
            } else if (event.key === 'Escape') {
                input.classList.remove('showBlock');
                input.value = labelTxt;
            }
        });

        document.addEventListener('click',  event => {
            const isInputClicked = input.contains(event.target) || event.target === input;
            const isInputActive = input.classList.contains('showBlock');
            if (!isInputClicked && isInputActive) {
                saveChanges(labelId, input);
            }
        }, { once: true });
    }
});

const saveChanges = (labelId, input) => {
    if (input.value.trim() === '') {
        toDoList.splice(labelId, 1);
    } else {
        input.previousElementSibling.innerText = input.value;
        toDoList[labelId].toDoTxt = input.value;
    }

    input.classList.remove('showBlock');
    localStorage.setItem("todo", JSON.stringify(toDoList));
    displayTasks();
    updateHiddenBlock();
    updateTodoCount();
    filterTodoList();
}

const detectUncheckedCheckboxes = () => {
    let allChecked = true;
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allChecked = false;
            return;
        }
    });
    return !allChecked;
}

const selectAllTasks = () => {
    if (detectUncheckedCheckboxes()) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        toDoList.forEach(item => {
            if (item.checked !== true) {
                item.checked = true;
                displayTasks();
                localStorage.setItem("todo", JSON.stringify(toDoList));
            }
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        toDoList.forEach(item => {
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

const clearCompletedTasks = () => {
    const filteredTasks = toDoList.filter(item => !item.checked);
    toDoList.length = 0;
    filteredTasks.forEach(task => toDoList.push(task));

    localStorage.setItem("todo", JSON.stringify(toDoList));
    displayTasks();
    updateHiddenBlock();
    filterTodoList();
}

const updateTodoCount = () => {
   let countLeft = 0;
    toDoList.forEach(item => {
        if (!item.checked) {
            countLeft++;
        }
    });
    spanLeft.innerHTML = countLeft;
    countLeft === 0 ? btnAllCheck.classList.add('black') : btnAllCheck.classList.remove('black');
}

tabsBtn.forEach((item) => {
    item.addEventListener("click", () => {
        tabsBtn.forEach((tab) => tab.classList.remove('filterActive'));
        item.classList.add('filterActive');
        filterTodoList();
    });
});

updateTodoCount();
