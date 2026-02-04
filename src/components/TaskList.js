import { Task } from "./Task";

export const TaskList = (tasks) => {
    if (tasks.length === 0) {
        return "<div>Задач пока нет</div>"; // добавить по пустому экрану
    }
    let htmlString = '<ul class="todo-list">';

    tasks.forEach((task) => {
        htmlString += Task(task);
    });
    htmlString += "</ul>";

    return htmlString;
}