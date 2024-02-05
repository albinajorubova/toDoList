const hiddenBlock = document.getElementsByClassName('hiddenBlock')[0];

function todoAdd(point){
    if(event.key == 'Enter'){
        if(point.value.trim() !== '' && point.value !== null){
            console.log(point.value);
            hiddenBlock.classList.add('active');
            point.value = ""
        }
    }
}