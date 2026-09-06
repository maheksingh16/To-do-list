const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let allTasks = [];
let currentFilter = "all";


// ===============================
// GET - Load all tasks
// ===============================

async function loadTasks() {

    const response = await fetch("http://localhost:8080/tasks");

    allTasks = await response.json();

    showFilteredTasks();
}


// ===============================
// FILTER TASKS
// ===============================

function showFilteredTasks() {

    taskList.innerHTML = "";

    let filteredTasks = allTasks;

    if (currentFilter === "active") {
        filteredTasks = allTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = allTasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        displayTask(task);
    });

    updateTaskCount(filteredTasks);
}


// ===============================
// DISPLAY A TASK
// ===============================

function displayTask(task) {

    const taskElement = document.createElement("div");

    taskElement.className = "task";

    taskElement.innerHTML = `
        <div class="task-left">

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="${task.completed ? "completed" : ""}">
                ${task.title}
            </span>

        </div>

        <button class="delete-button">🗑️</button>
    `;


    // CHECKBOX
    const checkbox = taskElement.querySelector(".task-checkbox");

    checkbox.addEventListener("change", async function () {

        await updateTask(
            task.id,
            task.title,
            checkbox.checked
        );

        loadTasks();
    });


    // DELETE
    const deleteButton = taskElement.querySelector(".delete-button");

    deleteButton.addEventListener("click", async function () {

        await deleteTask(task.id);

        loadTasks();
    });


    taskList.appendChild(taskElement);
}


// ===============================
// POST - Add task
// ===============================

addButton.addEventListener("click", async function () {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task 💗");
        return;
    }

    const response = await fetch("http://localhost:8080/tasks", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            completed: false
        })
    });


    if (!response.ok) {
        alert("Could not add task");
        return;
    }


    taskInput.value = "";

    loadTasks();
});


// ===============================
// PUT - Update task
// ===============================

async function updateTask(id, title, completed) {

    await fetch(`http://localhost:8080/tasks/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            completed: completed
        })
    });
}


// ===============================
// DELETE - Delete task
// ===============================

async function deleteTask(id) {

    await fetch(`http://localhost:8080/tasks/${id}`, {

        method: "DELETE"
    });
}


// ===============================
// UPDATE TASK COUNT
// ===============================

function updateTaskCount(tasks) {

    taskCount.textContent = `${tasks.length} tasks`;
}


// ===============================
// FILTER BUTTONS
// ===============================

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;


        // Remove active from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        // Add active to clicked button
        button.classList.add("active");


        // Show filtered tasks
        showFilteredTasks();
    });
});


// ===============================
// LOAD TASKS WHEN PAGE OPENS
// ===============================

loadTasks();