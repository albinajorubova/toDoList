const hiddenBlock = document.getElementsByClassName('hiddenBlock')[0];
let toDoItem = document.querySelector('.mainList')
let toDoList = []; 
let btnAllCheck = document.querySelector('.allCompl-label');

if(localStorage.getItem('todo')){  
    toDoList = JSON.parse(localStorage.getItem ("todo"));
    hiddenBlock.classList.add('active');
    displayMessages();
}

function todoAdd(point){
    if(event.key == 'Enter'){
        if(point.value.trim() !== '' && point.value !== null){
            let inputValue = point.value;
            point.value = "";
            hiddenBlock.classList.add('active');
            document.getElementById("labelTxt").textContent = inputValue; 
            let newToDo ={
                toDoTxt: inputValue,
                checked: false
            }
            toDoList.push(newToDo);
            console.log(toDoList)
            displayMessages();
            localStorage.setItem ("todo", JSON.stringify(toDoList));
        }
    }
}

function displayMessages(){
    let displayMessage = '';
    toDoList.forEach(function(item, i){
    displayMessage += `
    <div class='list__item'>
    <section class='leftItem'>
      <input type='checkbox' name='checkInput' id='item__${i}' ${item.checked ? 'checked': ''} />
      <label for='item__${i}' id='labelTxt' class="${item.checked ? 'label-checked' : ''}">${item.toDoTxt}</label>
    </section>
    <button class='delX'></button>
  </div>
    `;
    toDoItem.innerHTML = displayMessage;
    });
}

toDoItem.addEventListener('change', function(event){
  let idInput = (event.target.getAttribute('id'));
  let labelFor = toDoItem.querySelector('[for =' + idInput + ']')
  let valueLabel = labelFor.innerHTML;
  toDoList.forEach(function(item){
    if(item.toDoTxt === valueLabel){    
        item.checked = !item.checked;
        displayMessages();
        localStorage.setItem ("todo", JSON.stringify(toDoList));
    }

  })
})



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

function selectAll(){
    if (NotAllCheckboxesChecked()){
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = true;  
        
    });
    toDoList.forEach(function(item){
        if(item.checked != true){
            item.checked = true;       
            displayMessages();   
    localStorage.setItem ("todo", JSON.stringify(toDoList));
        }
    })
}
else{
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;    
    });
    toDoList.forEach(function(item){
        if(item.checked = true){
            item.checked = false;   
            displayMessages();       
    localStorage.setItem ("todo", JSON.stringify(toDoList));
        }
    })
}
}




