const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong><br/>
        <small>${task.description}</small><br/>
        ⏰ ${task.time}
      </div>
      <button onclick="deleteTask(${index})">🗑️</button>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    title: taskForm.title.value,
    description: taskForm.description.value,
    time: taskForm.time.value,
  };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  renderTasks();
});

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function checkNotifications() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5);
  tasks.forEach(task => {
    if (task.time === currentTime) {
      showNotification(task.title, task.description);
    }
  });
}

function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission();
  }
}

requestNotificationPermission();
renderTasks();
setInterval(checkNotifications, 60000);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
