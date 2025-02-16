document.addEventListener("DOMContentLoaded", ()=> {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  updatestats();
  updateTaskList();
})

let tasks = [];

function storeTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.querySelector("#task-input");
  let content = taskInput.value.trim();
  if (content) {
    let task = {
      text: content,
      completed: false,
    };
    tasks.push(task);
  }
  taskInput.value = "";
  storeTasks()
  updatestats();
  updateTaskList();
}

function editTask(index) {
  let p = document.querySelectorAll("p");

  // Target the paragraph element to make it editable
  p[index + 1].contentEditable = "true";
  p[index + 1].focus();

  // Move the cursor to the end of the text
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(p[index + 1]);
  range.collapse(false); // Collapse the range to the end of the content
  selection.removeAllRanges();
  selection.addRange(range);

  // Event listener to stop editing when user clicks away
  p[index + 1].addEventListener("blur", () => {
    p[index + 1].contentEditable = "false";
  });

  // Prevent the "Enter" key from adding new lines, and blur when done
  p[index + 1].addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line
      tasks[index].text = p[index + 1].innerText;
      storeTasks()
      p[index + 1].blur(); // Save and exit edit mode
      storeTasks();
    }
    
  });

  
}

function deleteTask(index) {
  tasks.splice(index, 1);
  storeTasks()
  updatestats();
  updateTaskList();
}

function toggleTaskComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  storeTasks()
  updatestats();
  updateTaskList();
}

function updatestats() {
  const progressBar = document.querySelector("#progress");
  const statsNumber = document.querySelector(".stats-number");
  const completedTask = tasks.filter((task) => task.completed).length;
  const totalTask = tasks.length;
  let percentCompleted = (completedTask / totalTask) * 100;
  progressBar.style.width = `${percentCompleted}%`;
  statsNumber.firstElementChild.innerText = `${completedTask} / ${totalTask}`;
}

function updateTaskList() {
  const taskList = document.querySelector("#task-list");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskList = document.querySelector("#task-list");
    let li = document.createElement("li");

    li.innerHTML = `<div class="task-item">
  <div class="task ${task.completed ? "completed" : ""}">
    <input type="checkbox" id="checkbox" ${task.completed ? "checked" : ""}/>
    <p>${task.text}</p>
  </div>

  <div class="icon">
  <img
    src="/JS-Projects/01-todo-list/Assets/icons8-create-50.png"
    onClick="editTask(${index})"
  />
  <img
    src="/JS-Projects/01-todo-list/Assets/icons8-trash-can-50.png"
    onClick="deleteTask(${index})"
  />
  </div>
  </div>`;

    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("click", () => {
      toggleTaskComplete(index);
    });

    taskList.append(li);
  });
}

document.getElementById("add-task").addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});
