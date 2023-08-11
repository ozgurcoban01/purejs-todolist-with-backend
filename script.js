const todoInput = document.querySelector(".added-todo").querySelector("input");
const todoAddButton = document.querySelector(".added-confirm");
const waitingTodos = document.querySelector(".todos");
const finishedTodos = document.querySelector(".finished-todos");
const socket=io('https://todolist-backend-odq2.onrender.com/')

let newTodos;
let newTodosFinishedButton;
let newTodosDeleteButton;
let finishedTodosInput;
const API_URL="https://todolist-backend-odq2.onrender.com"
todoAddButton.addEventListener("click", newTodoAdd);

document.querySelector(".add-todo").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    newTodoAdd();
  }
});

let todos = undefined;

if (localStorage.getItem("todos") == null) {
  localStorage.setItem("todosId", 0);
}

if (localStorage.getItem("todosId") == 0) {
  todos = [];
} else {
  todos = JSON.parse(localStorage.getItem("todos"));

}

function newTodoAdd() {
  if (todoInput.value != "") {
    createTodo()
  }

}

async function changeTodo(id,title){
  const newTodo={
    title:title
  }
  console.log(JSON.stringify(newTodo))
  await fetch(
    API_URL+"/api/todos/changeTodo/"+id
  ,{
    method:"PUT",
    headers:{          
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(newTodo)
  }).then(todoInput.value = "").then(orderAfterFetch)
  socket.emit("message","asd")
}

async function deleteTodo(id){


  await fetch(
    API_URL+"/api/todos/deleteTodo/"+id
  ,{
    method:"DELETE",
    headers:{          
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then(todoInput.value = "").then(orderAfterFetch)
  socket.emit("message","asd")
}

async function setFinishedTodo(id){
  const newTodoo={
    status:false
  }
 
  await fetch(
    API_URL+"/api/todos/changeTodo/"+id
  ,{
    method:"PUT",
    headers:{          
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(newTodoo)
  }).then(todoInput.value = "").then(orderAfterFetch)
  socket.emit('message',"asdasd")
}

async function createTodo(){
  const newTodo={
    title:todoInput.value,
  }
  await fetch(
    API_URL+"/api/todos/createTodo"
  ,{
    method:"POST",
    headers:{          
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(newTodo)
  }).then(todoInput.value = "").then(orderAfterFetch)
  socket.emit("message","asd")
}

async function orderAfterFetch() {
  await fetch(
    API_URL+"/api/todos/getAllTodos"
  ).then((res) => res.json()).then(
    (todos)=>{
      waitingTodos.innerHTML = "";
      finishedTodos.innerHTML = "";
      todos.map((todo) => {
        if (todo.status) {
          waitingTodos.innerHTML += `
           <div class="todo">
              <input class="todo-content" value="${todo.title}" todoid="${todo._id}" />
              <div class="todo-adjust" todoid="${todo._id}">Ok</div>
              <div class="todo-delete" todoid="${todo._id}">Del</div>
            </div>
          `;
        } else {
          finishedTodos.innerHTML += `
          <div class="finished-todo">
          <div class="finished-todo-content" todoid="${todo._id}">${todo.title}</div>
          <div class="todo-delete" todoid="${todo._id}">Del</div>
        </div>
          `;
        }
      });

      newTodos = document.querySelectorAll(".todo-content");
      newTodosFinishedButton = document.querySelectorAll(".todo-adjust");
      newTodosDeleteButton = document.querySelectorAll(".todo-delete");
      finishedTodosInput = document.querySelectorAll(".todo-content");
    
      finishedTodosInput.forEach((button) => {
        button.addEventListener("focusout", () => {
          changeTodo(button.getAttribute("todoId"),button.value)
        });
      });
    
      newTodosFinishedButton.forEach((button) => {
        button.addEventListener("click", () => {
   
          setFinishedTodo(button.getAttribute("todoId"))
        }); 
      });
    
      newTodosDeleteButton.forEach((button) => {
        button.addEventListener("click", () => {
          deleteTodo(button.getAttribute("todoId"))
        });
      });
    }
    
  );

}

orderAfterFetch()

socket.on('message',(text)=>{
orderAfterFetch()
})