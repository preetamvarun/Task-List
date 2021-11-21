const taskName = document.querySelector('input');
const addTaskBtn = document.getElementById('addTask');
const showError = document.getElementById('showError');
const unorderedList = document.querySelector('ul');


function showListItem(toDo){
     /*create a new list item */
     const newItemDiv = document.createElement('div');
     newItemDiv.className = 'list-item';
     newItemDiv.innerHTML = `<li>${toDo}</li> <i class="fas fa-trash-alt hide"></i>`;

     /*Now updating the UI (append it to the parent element)*/
     unorderedList.appendChild(newItemDiv);
}

function addTask(e){
    if(taskName.value === ""){
        taskName.style.border = '1.5px solid red';
        showError.textContent = "please enter your task";
        showError.style.color = 'red';
    } else{
        showError.style.display = 'none';
        
        /*get the task value*/
        let taskValue = taskName.value;

        /*clear out user entered task in UI*/
        taskName.value = "";

        /*before adding the value to the local storage, Check*/
        let tasks;
        localStorage.getItem('taskValue') ===  null ? tasks = [] 
        : tasks = JSON.parse(localStorage.getItem('taskValue'));

        /* add task value to local storage */
        tasks.push(taskValue);
        localStorage.setItem('taskValue', JSON.stringify(tasks));

        showListItem(taskValue);
    }
    e.preventDefault();
}

/*UPDATE UI from local storage data*/
function updateEntireUI(){
    let tasks;

    localStorage.getItem('taskValue') ===  null ? tasks = [] 
    : tasks = JSON.parse(localStorage.getItem('taskValue'));

    tasks.forEach(function(task){
        showListItem(task);
    });
    
}



addTaskBtn.addEventListener('click',addTask);
document.addEventListener('DOMContentLoaded',updateEntireUI);