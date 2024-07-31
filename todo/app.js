
// tüm elementleri seçmek
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCard= document.querySelectorAll(".card-body")[0];
const secondCard= document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");
const filterInput = document.querySelector("#todoSearch");

let todos =[];


runEvents();



function runEvents(){
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    secondCard.addEventListener("click", removeTodoToUI);
    clearButton.addEventListener("click", allTodosEverywhere);
    filterInput.addEventListener("keyup",filter)


}

function filter(e){
    const filterValue = e.target.value.toLowerCase().trim();
    const todoLis = document.querySelectorAll(".list-group-item");
    if(todoLis.length>0){
        todoLis.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                    todo.setAttribute("style","display : block");
            }else{
                todo.setAttribute("style","display : none !important");
            }
        });
    }else{
        showAlert("warning","todo listesi boş");
    }

}

function allTodosEverywhere(){
    const todoListesi = document.querySelectorAll(".list-group-item");
    if(todoListesi.length>0){
        todoListesi.forEach(function(todo){
            todo.remove();
        });

        todos=[];
        localStorage.setItem("todos", JSON.stringify(todos));
        showAlert("warning", "tüm todolar silindi");

    }else{
        showAlert("warning", "silmek için en az 1 görev olmali");
    }
}

function removeTodoToUI(e){
    if(e.target.className === "fa fa-remove"){
        const todo = e.target.parentElement.parentElement;
        todo.remove();

        removeTodoToStrorage(todo.textContent);

    }
}

function removeTodoToStrorage(removeTodo){
    checkTodosFromsStorages();
    todos.forEach(function(todo,index){
        if(removeTodo===todo){
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));

}

function pageLoaded(){
    checkTodosFromsStorages();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}

function addTodo(e){
    const inputText = addInput.value.trim();
    if(inputText== null || inputText==""){
        showAlert("danger", "boş todo olmaz ");
    }else{
        addTodoToUI(inputText);
        addTodoToStorage(inputText);
        showAlert("success", "todo eklendiiiii");
    }
    // console.log("sb mt clst");
    e.preventDefault();
}

function addTodoToUI(newTodo){
const li = document.createElement("li");
li.className="list-group-item d-flex justify-content-between";
li.textContent = newTodo;

const a = document.createElement("a");
a.href="#";
a.className = "delete-item";

const i = document.createElement("li");
i.className="fa fa-remove";


a.appendChild(i);
li.appendChild(a);
todoList.appendChild(li);

addInput.value= "";
}

function addTodoToStorage(newTodo){
checkTodosFromsStorages();
todos.push(newTodo);
localStorage.setItem("todos", JSON.stringify(todos));

}

function checkTodosFromsStorages()
{
    
    if(todos == null ){
        todos =[];
        }else{
            todos = JSON.parse(localStorage.getItem("todos"));
        }
}

function showAlert(type, message){
    const div = document.createElement("div");
    div.className = "alert alert-" + type;
    div.textContent = message;
    firstCard .appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);
}

