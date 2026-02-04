import { Task } from "./Task";

export const TaskList = (tasks) => {
    if (!tasks || tasks.length === 0) {
        return /*html*/`
            <div class="empty-state">
                <img class="empty-state__img" src="/photos/empty.svg"/>
                <div class="empty-state__label">Empty...</div>
            </div>
        `
    }

    return /*html*/`
        <ul class="todo-list">
            ${tasks.map(Task).join("")}
        </ul>
    `;
}