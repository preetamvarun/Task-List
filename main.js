const taskName = document.querySelector('input');
const addTaskBtn = document.getElementById('addTask');
const showError = document.getElementById('showError');
const unorderedList = document.querySelector('ul');
const clearBtn = document.getElementsByClassName('last-section-div')[0].lastElementChild;
const lastSection = document.getElementById('last-section');
const filters = document.getElementById('tasks');
const All = document.getElementById('All')
const Completed = document.getElementById('Completed')
const Uncompleted = document.getElementById('Uncompleted')


let oldValue = "", newValue = "", oldStyle = "";

function filterOutTasks(e){
    const listItemArray = Array.from(document.getElementsByClassName('list-item'));
    if(All.selected){
        listItemArray.forEach(function(eachItem){
            eachItem.style.display = 'flex';
        });
    } else if(Completed.selected){
        listItemArray.forEach(function(eachItem){
            eachItem.firstElementChild.style.textDecoration !== 'none' ?
            eachItem.style.display = 'flex' : eachItem.style.display = 'none';
        });
    } else{
        listItemArray.forEach(function(eachItem){
            eachItem.firstElementChild.style.textDecoration === 'none' ?
            eachItem.style.display = 'flex' : eachItem.style.display = 'none';
        });
    }
    e.preventDefault();
}


function updatePendingTasks(){
    const listItemArray = Array.from(document.getElementsByClassName('list-item'));
    let completedTasks = 0;
    listItemArray.forEach(function(eachItem){
        if(eachItem.firstElementChild.style.textDecoration === 'line-through'){
            completedTasks++;
        }
    });
    /*create a new paragraph element*/
    const newPara = document.createElement('p');
    newPara.innerHTML = `You have ${unorderedList.childElementCount - completedTasks} pending tasks`;
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
     `<li class="item" style = "text-decoration : none;">${toDo}<i class="fas fa-check" id = "check"></i> </li> 
        <i class="fas fa-pen-square edit"></i>
        <i class="fas fa-trash-alt hide"></i>
     </div>`;
     /*Now updating the UI (append it to the parent element)*/
     unorderedList.appendChild(newItemDiv);
     updatePendingTasks();
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

/*UPDATE UI from local storage data*/
function updateEntireUI(){
    let tasks;
    localStorage.getItem('taskValue') ===  null ? tasks = [] 
    : tasks = JSON.parse(localStorage.getItem('taskValue'));
    tasks.forEach(function(eachTask){
        showListItem(eachTask);
    });
    let taskStatus;
    localStorage.getItem('isChecked') === null ? taskStatus = [] :
    taskStatus = JSON.parse(localStorage.getItem('isChecked'));
    const listItemArray = Array.from(document.getElementsByClassName('list-item'));
    for(let i = 0; i < listItemArray.length; i++){
        taskStatus[i] ? 
        listItemArray[i].firstElementChild.style.textDecoration = 'line-through' : 
        listItemArray[i].firstElementChild.style.textDecoration = 'none';
    }
    All.selected = true;
    Completed.selected = false;
    Uncompleted.selected = false;
    // updating pending tasks
    updatePendingTasks();
}

function addTask(e){
    if(taskName.value === ""){
        showError.style.display = 'block';
        taskName.style.border = '1.5px solid red';
        showError.textContent = "please enter your task";
        showError.style.color = 'red';
    } else{
        let taskValue = "";
        showError.style.display = 'none';
        taskName.style.border = '1px solid black';
        /*get the task value*/
        taskValue = taskName.value.trim();
        /*clear out user entered task in UI*/
        taskName.value = "";
        /*before adding the value to the local storage, Check*/
        let tasks;
        localStorage.getItem('taskValue') ===  null ? tasks = [] 
        : tasks = JSON.parse(localStorage.getItem('taskValue'));
        /*initially the taskStatus will be false i.e., unchecked*/
        let taskStatus;
        localStorage.getItem('isChecked') === null ? taskStatus = [] :
        taskStatus = JSON.parse(localStorage.getItem('isChecked'));
        /* add task value to local storage */
        tasks.push(taskValue);
        taskStatus.push(false);
        localStorage.setItem('taskValue', JSON.stringify(tasks));
        localStorage.setItem('isChecked', JSON.stringify(taskStatus));
        showListItem(taskValue);
    }
    e.preventDefault();
}

/*Remove selected list item and update text-decoration for selected list item*/
function removeSelectedItem(e){
    // if user clicks on the delete icon then clear list-item div
    if(e.target.classList.contains('hide')){
        const todo = e.target.parentElement;
        todo.classList.add('animation');
        let itemName = '',tasks = [], index = -1;
        itemName = todo.firstElementChild.textContent.trim(); // remove last character space from the string
        tasks = JSON.parse(localStorage.getItem('taskValue'));
        taskStatus = JSON.parse(localStorage.getItem('isChecked'));
        index = tasks.indexOf(itemName);
        tasks.splice(index,1);
        taskStatus.splice(index,1);
        // set the new array to taskValue
        localStorage.setItem('taskValue',JSON.stringify(tasks));
        localStorage.setItem('isChecked',JSON.stringify(taskStatus));
        todo.addEventListener('transitionend',function(){
            todo.remove();
            updatePendingTasks();
        })
    }
    else if(e.target.id === 'check'){
        let index; 
        const listItemValue = e.target.parentElement.textContent.trim();
        const li = e.target.parentElement;
        tasks = JSON.parse(localStorage.getItem('taskValue'));
        taskStatus = JSON.parse(localStorage.getItem('isChecked'));
        index = tasks.indexOf(listItemValue);
        taskStatus[index] = !taskStatus[index];
        if(li.style.textDecoration === 'line-through'){
            li.style.textDecoration = 'none';
            li.parentElement.style.opacity = 1;
        } else{
            li.style.textDecoration = 'line-through';
            li.parentElement.style.opacity = 0.5;
        }
        localStorage.setItem('isChecked',JSON.stringify(taskStatus));
        updatePendingTasks();
    }

    else if(e.target.classList.contains('edit')){
        // creating new element 
        const newDiv = document.createElement('div');
        newDiv.className = 'input-div edit-input-div';
        newDiv.innerHTML = `<input type="text" name="taskName" id="taskName" spellcheck="true" required>
        <a href="#" id="addTask" class = "newInput"> + </a> `;
        // getting old element
        const oldDiv = e.target.parentElement;
        oldStyle = oldDiv.firstElementChild.style.textDecoration;
        oldValue = oldDiv.firstElementChild.textContent.trim();
        unorderedList.replaceChild(newDiv,oldDiv);
    }
    /*Adding task value after user clicks edit button*/
    else if(e.target.tagName === 'A'){
        const textField = e.target.parentElement.firstElementChild;
        newValue = textField.value.trim();
        if(newValue === ""){
            textField.style.border = '2px solid red';
        } else{
            let index = -1;
            const parentElement = textField.parentElement.parentElement;
            const oldElement = textField.parentElement;
            const newItemDiv = document.createElement('div');
            newItemDiv.className = 'list-item';
            newItemDiv.innerHTML = 
            `<li class="item">${textField.value} <i class="fas fa-check" id = "check"></i> </li> 
               <i class="fas fa-pen-square edit"></i>
               <i class="fas fa-trash-alt hide"></i>
            </div>`;
            parentElement.replaceChild(newItemDiv,oldElement);
            newItemDiv.firstElementChild.style.textDecoration = oldStyle;
            if(newItemDiv.firstElementChild.style.textDecoration === 'line-through'){
                newItemDiv.style.opacity = 0.5
            } else{
                newItemDiv.style.opacity = 1
            }
            let tasks;
            tasks = JSON.parse(localStorage.getItem('taskValue'));
            index = tasks.indexOf(oldValue); // getting the index of old value
            tasks.splice(index,1); // removing the old value from the local storage
            tasks.splice(index,0,newValue); // keeping new value in place of old value
            localStorage.setItem('taskValue', JSON.stringify(tasks));
        }
    }
    e.preventDefault();
}
addTaskBtn.addEventListener('click',addTask);
document.addEventListener('DOMContentLoaded',updateEntireUI);
clearBtn.addEventListener('click',clearAll);
unorderedList.addEventListener('click',removeSelectedItem);
filters.addEventListener('click',filterOutTasks);
/* WILL REVISIT THIS PROJECT FOR FURTHER IMPROVEMENTS OR IF I ENCOUNTER ANY BUGS */