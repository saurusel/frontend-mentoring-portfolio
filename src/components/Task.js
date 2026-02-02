export const Task = (task) => {
    const extraClass = task.completed ? "completed" : "";

    return `
        <li class="task-item ${extraClass}" data-id="${task.id}">
            ${task.title}
        </li>
    `;
};
