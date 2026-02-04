import { Task } from "./Task";

export const TaskList = (tasks) => {
    if (tasks.length === 0) {
        return "<div>Задач пока нет</div>";
    }
    let htmlString = "<ul>";

    tasks.forEach((task) => {
        htmlString += Task(task);
    });
    htmlString += "</ul>";

    return htmlString;
}