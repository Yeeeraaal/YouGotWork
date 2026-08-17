
// ------------- Configuración inicial ------------------

const STORAGE_KEY = "todoListTasks";
let tasks = [];

// Referencias a elementos HTML --------------
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");
const validationMessage = document.getElementById("validationMessage");
const percentageText = document.getElementById("percentageText");
const progressBarFill = document.getElementById("progressBarFill");
const completedStats = document.getElementById("completedStats");
const pendingStats = document.getElementById("pendingStats");



// Cargar tareas desde localStorage-------------------
const loadTasks = () => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (error) {
            console.error("Error al cargar las tareas:", error);
            tasks = [];
        }
    }
    renderTasks();
};

// Guardar tareas en localStorage-----------------------
const saveTasks = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); };

// Mostrar tareas en pantalla----------------------
const renderTasks = () => {
    // limpiar solamente el contenido generado antes
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.classList.add("empty-message");
        // mensaje de no tareas
        emptyMessage.textContent = "No tienes tareas todavía.";
        taskList.appendChild(emptyMessage);
    } else {

        tasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task-item");
            if (task.completed) { taskItem.classList.add("completed"); }
            // Checkbox------
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("task-checkbox");
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => { toggleTask(task.id); });

            // Texto
            const taskText = document.createElement("span");
            taskText.classList.add("task-text");
            taskText.textContent = task.text; //evita que se pueda inyectar código en una tarea

            // Botón eliminar
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "✘";
            // EventListener------
            deleteButton.addEventListener("click", () => { deleteTask(task.id); });

            // Agregar elementos a la tarea
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
    }

    updateProgress();
    updateStatistics(); // Actualizar estadísticas despues de rendeerizar 

};

// Actualizar estadísticas-----------------------------------
const updateStatistics = () => {

    // Calcula el número de tareas completadas y pendintes con reduce
    const statistics = tasks.reduce((result, task) => {
        if (task.completed) {
            result.completed++;
        } else {
            result.pending++;
        }
        return result;
    },
        {
            completed: 0,
            pending: 0
        }
    );


    // Total de tareas
    const totalTasks = statistics.completed + statistics.pending;

    // porcentaje de tareas completadas----------------------
    const percentage = totalTasks === 0
        ? 0
        : Math.round(
            (statistics.completed / totalTasks) * 100
        );

    // Actualizar porcentaj
    percentageText.textContent = `${percentage}%`;
    // Actualizar la barra de progreso
    progressBarFill.style.width = `${percentage}%`;

    // Actualizar las estadísticas
    pendingStats.textContent =
        `${statistics.pending} pendientes`;
};

// Agregar una tarea--------------------------
const addTask = (taskText) => {const cleanedText = taskText.trim();
    // Mensaje para tareas vacias
    if (cleanedText === "") {
        validationMessage.textContent =
            "No puedes agregar una tarea vacía.";
        return;
    }
    // Crear nueva tarea
    const newTask = {
        id: crypto.randomUUID(),
        text: cleanedText,
        completed: false
    };


    // Actualizar el estado
    tasks.push(newTask);

    // Guardar el nuevo estado
    saveTasks();
    // Renderizar otra vez
    renderTasks();

    // Limpiar formulario
    taskInput.value = "";
    validationMessage.textContent = "";
    taskInput.focus();
};

// Tachar/ Destachar tarea------------------------------
const toggleTask = (taskId) => { const task = tasks
    .find((task) => task.id === taskId);
    if (!task) {
        return;
    }
    // Cambiar el estado
    task.completed = !task.completed;
    // Guardar el nuevo estado
    saveTasks();
    // Renderizar 
    renderTasks();
};

// Eliminar tarea----------------------------
const deleteTask = (taskId) => {
    tasks = tasks
    .filter((task) => task.id !== taskId
    );
    // Guardar el nuevo estado
    saveTasks();
    // Renderizar
    renderTasks();
};

// Actualizar contador-----------------------
const updateProgress = () => {
    const completedTasks = tasks
    .filter((task) => task.completed).length;
    progressText.textContent =
        `${completedTasks} de ${tasks.length} completadas`;
};


// Evento del formulario----------------
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(taskInput.value);
});

// Iniciar aplicación ****
loadTasks();