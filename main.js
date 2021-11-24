const taskName = document.querySelector('input');
const addTaskBtn = document.getElementById('addTask');
const showError = document.getElementById('showError');
const unorderedList = document.querySelector('ul');
const clearBtn = document.getElementsByClassName('last-section-div')[0].lastElementChild;
let oldValue = "", newValue = "";


function updatePendingTasks(){
    /*create a new paragraph element*/
    const newPara = document.createElement('p');
    newPara.innerHTML = `You have ${unorderedList.childElementCount} pending tasks`;
    /*get the old paragraph element*/
    const oldPara = document.getElementsByClassName('last-section-div')[0].firstElementChild;
    /*get the parent*/
    const paraParent = oldPara.parentElement;
    paraParent.replaceChild(newPara,oldPara);
}

function showListItem(toDo){
     /*create a new list item */
     const newItemDiv = document.createElement('div');
     newItemDiv.className = 'list-item';
     newItemDiv.innerHTML = 
     `<li class="item">
     ${toDo}
     <i class="fas fa-check" id = "check"></i>
     </li> 
        <i class="fas fa-pen-square edit"></i>
        <i class="fas fa-trash-alt hide"></i>
     </div>`;
     /*Now updating the UI (append it to the parent element)*/
     unorderedList.appendChild(newItemDiv);
}

function clearAll(){
    let allTasks = document.getElementsByClassName('list-item');
    allTasks = Array.from(allTasks);
    allTasks.forEach(function(eachTask){
        eachTask.remove();
    });
    updatePendingTasks();
    localStorage.clear();
}

function addTask(e){
    if(taskName.value === ""){
        showError.style.display = 'block';
        taskName.style.border = '1.5px solid red';
        showError.textContent = "please enter your task";
        showError.style.color = 'red';
    } else{
        showError.style.display = 'none';
        taskName.style.border = '1px solid black';
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
        updatePendingTasks();
    }
    e.preventDefault();
}

/*UPDATE UI from local storage data*/
function updateEntireUI(){
    updatePendingTasks();
    let tasks;
    localStorage.getItem('taskValue') ===  null ? tasks = [] 
    : tasks = JSON.parse(localStorage.getItem('taskValue'));
    tasks.forEach(function(task){
        showListItem(task);
    });
    updatePendingTasks();
}

/*Remove selected list item and update text-decoration for selected list item*/
function removeSelectedItem(e){


    let value, arr, index;
    // if user clicks on the icon then clear list-item div
    if(e.target.classList.contains('hide')){
        value = e.target.parentElement.firstElementChild.textContent;
        arr = JSON.parse(localStorage.getItem('taskValue'));
        index = arr.indexOf(value);
        // now remove the value from the local storage also
        arr.splice(index,1);
        // set the new array to taskValue
        localStorage.setItem('taskValue',JSON.stringify(arr));
        // remove it from the ui as well
        e.target.parentElement.remove();
        // update pending tasks as well
        updatePendingTasks();
    }

    else if(e.target.id === 'check'){
        const li = e.target.parentElement;
        li.style.textDecoration === 'line-through' ?
        li.style.textDecoration = 'none' : li.style.textDecoration = 'line-through';
    }

    else if(e.target.classList.contains('edit')){
        // creating new element 
        const newDiv = document.createElement('div');
        newDiv.className = 'input-div';
        newDiv.innerHTML = `<input type="text" name="taskName" id="taskName" spellcheck="true" required>
        <a href="#" id="addTask" class = "newInput"> + </a> `;
        // getting old element 
        const oldDiv = e.target.parentElement;
        oldValue = oldDiv.firstElementChild.textContent;
        unorderedList.replaceChild(newDiv,oldDiv);
    }

    else if(e.target.tagName === 'A'){
        const textField = e.target.parentElement.firstElementChild;
        if(textField.value === ""){
            textField.style.border = '2px solid red';
        } else{
            const parentElement = textField.parentElement.parentElement;
            const oldElement = textField.parentElement;
            const newItemDiv = document.createElement('div');
            newItemDiv.className = 'list-item';
            newItemDiv.innerHTML = 
            `<li class="item">${textField.value}</li> 
               <i class="fas fa-pen-square edit"></i>
               <i class="fas fa-trash-alt hide"></i>
            </div>`;
            parentElement.replaceChild(newItemDiv,oldElement);
            newValue = textField.value;
            let tasks;
            tasks = JSON.parse(localStorage.getItem('taskValue'));
            let oldValueIndex = tasks.indexOf(oldValue);
            tasks.splice(oldValueIndex,1);
            tasks.splice(oldValueIndex,0,newValue);
            localStorage.setItem('taskValue', JSON.stringify(tasks));
        }
    }
    e.preventDefault();
}


addTaskBtn.addEventListener('click',addTask);
document.addEventListener('DOMContentLoaded',updateEntireUI);
clearBtn.addEventListener('click',clearAll);
unorderedList.addEventListener('click',removeSelectedItem);
