import { Task } from "./Task";

export const TaskList = (tasks) => {
    if (tasks.length === 0) {
        return "<div>Задач пока нет</div>";
        return;
    }
    let htmlString = "<ui>";

    tasks.forEach((task) => {
        htmlString += Task(task);
    });
    htmlString += "</ui>";

    return htmlString;
}