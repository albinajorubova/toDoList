const hiddenBlock = document.getElementsByClassName('hiddenBlock')[0];
let toDoItem = document.querySelector('.mainList')
let toDoList = []; 


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
      <label for='item__${i}' id='labelTxt'>${item.toDoTxt}</label>
    </section>
    <button class='delX'></button>
  </div>
    `;
    toDoItem.innerHTML = displayMessage;
    });
}