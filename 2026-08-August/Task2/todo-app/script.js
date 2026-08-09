const STORAGE_KEY = "todoAppTasks_v1";

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const assignedByInput = document.getElementById("assignedByInput");
const assignedToInput = document.getElementById("assignedToInput");
const deadlineDateInput = document.getElementById("deadlineDateInput");
const deadlineTimeInput = document.getElementById("deadlineTimeInput");
const startDateInput = document.getElementById("startDateInput");
const startTimeInput = document.getElementById("startTimeInput");
const endDateInput = document.getElementById("endDateInput");
const endTimeInput = document.getElementById("endTimeInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

function getTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    console.warn("Unable to parse saved tasks. Starting with an empty list.");
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateStats() {
  const items = Array.from(taskList.querySelectorAll(".task-item"));
  const completedCount = items.filter((taskItem) => taskItem.classList.contains("completed")).length;

  totalTasks.textContent = items.length;
  completedTasks.textContent = completedCount;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  if (task.completed) {
    li.classList.add("completed");
  }

  const taskCardBody = document.createElement("div");
  taskCardBody.className = "task-card-body";

  const taskTitleRow = document.createElement("div");
  taskTitleRow.className = "task-title-row";

  const textWrap = document.createElement("div");
  textWrap.className = "task-text-wrap";

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = task.text;

  const editInput = document.createElement("input");
  editInput.className = "task-edit-input";
  editInput.type = "text";
  editInput.value = task.text;

  textWrap.appendChild(textSpan);
  textWrap.appendChild(editInput);

  const priorityBadge = document.createElement("span");
  priorityBadge.className = `priority-pill ${String(task.priority || "Medium").toLowerCase()}`;
  priorityBadge.textContent = `${task.priority || "Medium"} Priority`;

  taskTitleRow.appendChild(textWrap);
  taskTitleRow.appendChild(priorityBadge);

  const taskDetails = document.createElement("div");
  taskDetails.className = "task-details-grid";

  const assignedBy = document.createElement("div");
  assignedBy.className = "task-detail";
  assignedBy.innerHTML = `<strong>Assigned by:</strong> ${escapeHtml(task.assignedBy || "Unassigned")}`;

  const assignedTo = document.createElement("div");
  assignedTo.className = "task-detail";
  assignedTo.innerHTML = `<strong>Assigned to:</strong> ${escapeHtml(task.assignedTo || "Unassigned")}`;

  const deadline = document.createElement("div");
  deadline.className = "task-detail";
  const deadlineValue = formatDateTime(task.deadlineDate, task.deadlineTime);
  deadline.innerHTML = `<strong>Deadline:</strong> ${deadlineValue}`;

  const start = document.createElement("div");
  start.className = "task-detail";
  const startValue = formatDateTime(task.startDate, task.startTime);
  start.innerHTML = `<strong>Starting:</strong> ${startValue}`;

  const end = document.createElement("div");
  end.className = "task-detail";
  const endValue = formatDateTime(task.endDate, task.endTime);
  end.innerHTML = `<strong>Ending:</strong> ${endValue}`;

  taskDetails.appendChild(assignedBy);
  taskDetails.appendChild(assignedTo);
  taskDetails.appendChild(deadline);
  taskDetails.appendChild(start);
  taskDetails.appendChild(end);

  taskCardBody.appendChild(taskTitleRow);
  taskCardBody.appendChild(taskDetails);

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.type = "button";
  completeBtn.textContent = task.completed ? "Undo" : "Complete";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";

  taskActions.appendChild(completeBtn);
  taskActions.appendChild(deleteBtn);

  li.appendChild(taskCardBody);
  li.appendChild(taskActions);

  completeBtn.addEventListener("click", () => {
    const tasks = getTasks();
    const savedTask = tasks.find((item) => item.id === task.id);

    if (savedTask) {
      savedTask.completed = !savedTask.completed;
      saveTasks(tasks);
      renderTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    const tasks = getTasks().filter((savedTask) => savedTask.id !== task.id);
    saveTasks(tasks);
    renderTasks();
  });

  textSpan.addEventListener("dblclick", () => {
    li.classList.add("editing");
    editInput.style.display = "block";
    editInput.focus();
    editInput.select();
  });

  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveTaskText(task.id, editInput.value, li, editInput);
    }

    if (event.key === "Escape") {
      editInput.value = task.text;
      li.classList.remove("editing");
      editInput.style.display = "none";
    }
  });

  editInput.addEventListener("blur", () => {
    saveTaskText(task.id, editInput.value, li, editInput);
  });

  return li;
}

function saveTaskText(taskId, rawValue, li, editInput) {
  const trimmedValue = rawValue.trim();

  if (trimmedValue.length === 0) {
    editInput.value = getTasks().find((task) => task.id === taskId)?.text ?? "";
    li.classList.remove("editing");
    editInput.style.display = "none";
    return;
  }

  const tasks = getTasks();
  const savedTask = tasks.find((task) => task.id === taskId);

  if (savedTask) {
    savedTask.text = trimmedValue;
    saveTasks(tasks);
    renderTasks();
  }
}

function renderTasks() {
  const tasks = getTasks();

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });

  if (tasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks yet. Add one to begin.";
    taskList.appendChild(emptyState);
  }

  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  const tasks = getTasks();
  tasks.push({
    id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
    text,
    priority: priorityInput.value,
    assignedBy: assignedByInput.value.trim(),
    assignedTo: assignedToInput.value.trim(),
    deadlineDate: deadlineDateInput.value,
    deadlineTime: deadlineTimeInput.value,
    startDate: startDateInput.value,
    startTime: startTimeInput.value,
    endDate: endDateInput.value,
    endTime: endTimeInput.value,
    completed: false
  });

  saveTasks(tasks);

  taskInput.value = "";
  priorityInput.value = "Medium";
  assignedByInput.value = "";
  assignedToInput.value = "";
  deadlineDateInput.value = "";
  deadlineTimeInput.value = "";
  startDateInput.value = "";
  startTimeInput.value = "";
  endDateInput.value = "";
  endTimeInput.value = "";

  renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

clearCompletedBtn.addEventListener("click", () => {
  const remainingTasks = getTasks().filter((task) => !task.completed);
  saveTasks(remainingTasks);
  renderTasks();
});

function formatDateTime(dateValue, timeValue) {
  if (!dateValue && !timeValue) {
    return "Not set";
  }

  const datePart = dateValue ? new Date(`${dateValue}T00:00:00`) : null;
  const dateText = datePart ? datePart.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : "";

  if (dateText && timeValue) {
    return `${dateText}, ${timeValue}`;
  }

  if (dateText) {
    return dateText;
  }

  return timeValue || "Not set";
}

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function init() {
  renderTasks();
}

init();
