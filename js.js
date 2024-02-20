const hiddenBlock = document.getElementsByClassName('hiddenBlock')[0];
let toDoItem = document.querySelector('.mainList');
let toDoList = []; 
let btnAllCheck = document.querySelector('.allCompl-label');
let delXItems = document.getElementsByClassName('delX');

if(localStorage.getItem('todo')){  
    toDoList = JSON.parse(localStorage.getItem ("todo"));
    hiddenBlock.classList.add('active');
    displayMessages();
}

function updateHiddenBlock() {
    if (toDoList.length === 0) {
        hiddenBlock.classList.remove('active'); 
    } else {
        hiddenBlock.classList.add('active'); 
    }
}
updateHiddenBlock();

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
}

function displayMessages(){
    let displayMessage = '';
    toDoList.forEach(function(item, i){
    displayMessage += `
    <div class='list__item'>
    <section class='leftItem'>
      <input type='checkbox' name='checkInput' id='item__${i}' ${item.checked ? 'checked': ''} />
      <label for="" id="labelTxt" data-id='${i}' class="labelTxt ${item.checked ? 'label-checked' : ''}">${item.toDoTxt}</label>
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
        });
    });
}

toDoItem.addEventListener('dblclick', function(event) {
    if (event.target.classList.contains('labelTxt')) {
        console.log('Клик');
    }
});
 
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
    }
});


var checkboxes = document.querySelectorAll('input[type="checkbox"]');
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
}

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

countLefts();