export const Task = (task) => {
    const extraClass = task.completed ? "completed" : "";

    return `
        <li class="task-item ${extraClass}" data-id="${task.id}">
            <span class="task-title">${task.title}</span>
        </li>
    `;
};
