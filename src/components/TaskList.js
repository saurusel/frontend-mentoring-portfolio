import { Task } from "./Task";

export const TaskList = (tasks, theme = "light") => {
    if (!tasks || tasks.length === 0) {
        const emptySrc =
            theme === "dark"
                ? "/photos/empty-dark.svg"
                : "/photos/empty-light.svg";
        
        return /*html*/`
            <div class="empty-state">
                <img class="empty-state__img" src="${emptySrc}"/>
                <div class="empty-state__label">Empty...</div>
            </div>
        `;
    }

    return /*html*/`
        <ul class="todo-list">
            ${tasks.map((t) => Task(t)).join("")}
        </ul>
    `;
};
