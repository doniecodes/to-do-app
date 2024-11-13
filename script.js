/* getting all variables needed */
let body = document.body;
let todoApp = document.querySelector('.todo-app');
let lightMode = document.querySelector('.light-mode-icon');
let darkMode = document.querySelector('.dark-mode-icon');
let addTask = document.querySelector('.add-task-bar');
let addTaskBtn = document.querySelector('.add-task-btn');
let input = document.querySelector('.input-value');
let allTasks = document.querySelector('.all-tasks');
let taskRows = document.querySelectorAll('.task-row');
let taskNames = document.querySelectorAll('.task-name');
let deleteBtns = document.querySelectorAll('.delete-task');
let allBtn = document.querySelector('.filter-all');
let activeBtn = document.querySelector('.filter-active');
let completedBtn = document.querySelector('.filter-completed');
let lsAllTasks = JSON.parse(localStorage.getItem("tasks")) || [];



/* app mode toggling */
lightMode.addEventListener('click', ()=>{
    body.classList.add('light-mode');
    lightMode.style.display="none";
    darkMode.style.display="block";
    addTask.classList.add('add-light-mode');
    addTask.classList.remove('add-task-bar');
    allTasks.classList.add('tasks-light-mode');
    allTasks.classList.remove('all-tasks');
})
darkMode.addEventListener('click', ()=>{
    body.classList.remove('light-mode');
    lightMode.style.display="block";
    darkMode.style.display="none";
    addTask.classList.remove('add-light-mode');
    addTask.classList.add('add-task-bar');
    allTasks.classList.remove('tasks-light-mode');
    allTasks.classList.add('all-tasks');
})

/* delete task function */
let deleteTask = ()=>{
    allTasks.addEventListener('click', (event)=>{
        let clicked = event.target;
        if(clicked.classList.contains('delete-task')){
            const taskRow = clicked.parentElement;
            allTasks.removeChild(taskRow);
        }
        itemsLeft();
    })
}
deleteTask();

/* check checkboxes */
let completed = ()=>{
    allTasks.addEventListener('click', (event)=>{
        let clicked = event.target;
        let clickedParent = clicked.parentElement;
        let clickedGrandParent = clickedParent.parentElement;
        let taskName = clickedGrandParent.querySelector('.task-name');

        if(clicked.classList.contains('task-toggle')){
            clicked.classList.toggle('check-bg');
            taskName.classList.toggle('line-through');
            clickedGrandParent.classList.add('checked');
        }
        itemsLeft();
        clearCompleted();
        allFilters();
    })
}
completed();


/* add a new task function */
function resetValue (){
    let taskValue = document.querySelector('.input-value');
    taskValue.value = '';
}
let addNewTask = ()=>{
    addTaskBtn.addEventListener('click', (event)=>{
        let taskTerm = input.value;
        let taskParent = allTasks;
        let newTaskRow = document.createElement('li');
        newTaskRow.classList.add('task-row');
        newTaskRow.innerHTML = `
         <label for="task-check" class="checkbox-circle">
            <input type="checkbox" class="task-checkbox">
            <div class="task-toggle toggle-fill"></div>
          </label>
          <div class="task-name">${taskTerm}</div>
          <img src="images/icon-cross.svg" alt="" class="delete-task">
        </li>
        `;

        taskParent.prepend(newTaskRow);
        resetValue();
        lsAllTasks.push(newTaskRow);
        
        if(taskTerm.length == 0){
            taskParent.removeChild(newTaskRow);
        }
        lsStorage();
        itemsLeft();
        clearCompleted();
        allFilters();
        initSortableList();
        
    })
}
addNewTask();

// local storage
let lsStorage = ()=>{
    localStorage.setItem("tasks", JSON.stringify(lsAllTasks));
}


/* tasks footer functions */
/* items left function */ 
let itemsLeft = ()=>{
    let count = 0;
    let itemCount = document.querySelector('.item-count');
    let checkBoxes = allTasks.querySelectorAll('.task-toggle');
    let checkedBoxes = document.querySelectorAll('.check-bg');
    count = checkBoxes.length - checkedBoxes.length;
    itemCount.innerText = `${count} items left`
}
itemsLeft();

/* item filter Buttons functions */
let itemFilters = document.querySelectorAll('.item-filters span');
itemFilters.forEach((item)=>{
    item.addEventListener('click', ()=>{
        item.classList.add('active-filter');
        itemFilters.forEach((f)=>{
            if(f !== item){
                f.classList.remove('active-filter');
            }
        })
    })
})

/* clear completed function */
let clearCompleted = ()=>{
    let checkedTasks = document.querySelectorAll('.check-bg');
    let clearBtn = document.querySelector('.clear-completed');
    checkedTasks.forEach((checked)=>{
        let checkedRow = checked.parentElement.parentElement;
        let checkedRowParent = checked.parentElement.parentElement.parentElement;
        clearBtn.addEventListener('click', ()=>{
            checkedRowParent.removeChild(checkedRow);
        })
    })  
}

/* filters*/
let allFilters = ()=>{
    allTasks.addEventListener('click', (event)=>{
        let clickedBtn = event.target;
        let btnRow = clickedBtn.parentElement.parentElement;
        let mainParent = btnRow.parentElement;
        let allRows = mainParent.querySelectorAll('.task-row');
        let checkedRows = mainParent.querySelectorAll('.checked');
        let uncheckedRows = mainParent.querySelectorAll('.task-row:not(.checked)');
        /* active tasks */
        if(clickedBtn.classList.contains('filter-active')){
            checkedRows.forEach((row)=>{
                row.style.display = "none";
            })
            uncheckedRows.forEach((row)=>{
                row.style.display = "flex";
            })
        }
        /* completed tasks */
        if(clickedBtn.classList.contains('filter-completed')){
            uncheckedRows.forEach((row)=>{
                row.style.display = "none";
            })
            checkedRows.forEach((row)=>{
                row.style.display = "flex";
            })
        }
        /* all tasks */
        if(clickedBtn.classList.contains('filter-all')){
            allRows.forEach((row)=>{
                row.style.display = "flex";
            })
        }

    })
}


/* dragging and dropping  to reorder the tasks */
let dragItems = ()=>{
    taskRows.forEach((row)=>{
        /* drag start */
        row.addEventListener('dragstart', (event)=>{
        row.classList.add('dragging');
        })
    
        /* drag end */
        row.addEventListener('dragend', (event)=>{
        row.classList.remove('dragging');
        })
    });
}
dragItems();

    let initSortableList = (e)=>{
        let draggingItem = allTasks.querySelector('.dragging');
        const siblings = [...allTasks.querySelectorAll('.task-row:not(.dragging)')];
        let nextSibling = siblings.find((sibling) => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    })
    console.log(nextSibling);
    allTasks.insertBefore(draggingItem, nextSibling);
    
    if(e.target.classList.contains('items-footer')){
        e.preventDefault();
    }
}
allTasks.addEventListener('dragover', initSortableList);