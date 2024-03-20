document.addEventListener("DOMContentLoaded", loadTasks);
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

function loadTasks() {
  fetch("/tasks")
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => {
        addTaskToList(task);
      });
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskDescription = taskInput.value;

  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: taskDescription }),
  })
    .then((response) => response.json())
    .then((task) => {
      addTaskToList(task);
      taskInput.value = "";
    })
    .catch((error) => console.error("Error adding task:", error));
});

function addTaskToList(task) {
  const li = document.createElement("li");
  li.textContent = task.description;
  li.setAttribute("data-id", task.id);
  if (task.completed) {
    li.classList.add("completed");
  }
  li.addEventListener("click", () => toggleTaskCompletion(li, task.id));
  taskList.appendChild(li);
}

function toggleTaskCompletion(li, taskId) {
  const completed = li.classList.contains("completed") ? 0 : 1;

  fetch(`/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  })
    .then((response) => response.json())
    .then(() => {
      li.classList.toggle("completed");
    })
    .catch((error) => console.error("Error updating task:", error));
}
