document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('add-task-form');
    const taskInput = document.getElementById('task-input');
    const activeTaskList = document.getElementById('active-task-list');
    const completedTaskListContainer = document.getElementById('completed-task-list-container');
    
    if (!taskForm) return;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        activeTaskList.innerHTML = '';
        completedTaskListContainer.innerHTML = '';

        tasks.forEach(task => {
            if (task.completed) {
                const card = document.createElement('div');
                card.className = 'card task-item completed';
                card.dataset.id = task.id;
                card.innerHTML = `
                    <span>${task.text}</span>
                    <div class="task-actions">
                        <button class="delete-btn"><i class='bx bx-trash'></i></button>
                    </div>
                `;
                completedTaskListContainer.appendChild(card);
            } else {
                const li = document.createElement('li');
                li.className = 'card task-item';
                li.dataset.id = task.id;
                li.innerHTML = `
                    <span>${task.text}</span>
                    <div class="task-actions">
                        <button class="complete-btn"><i class='bx bx-check-square'></i></button>
                        <button class="delete-btn"><i class='bx bx-trash'></i></button>
                    </div>
                `;
                activeTaskList.appendChild(li);
            }
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            tasks.unshift({ id: Date.now(), text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    document.querySelector('.todo-layout').addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const id = Number(taskItem.dataset.id);
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (e.target.closest('.complete-btn')) {
            taskItem.classList.add('moving-out');
            taskItem.addEventListener('animationend', () => {
                tasks[taskIndex].completed = true;
                saveTasks();
                renderTasks();
            }, { once: true });
        } else if (e.target.closest('.delete-btn')) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
        }
    });

    renderTasks();
});