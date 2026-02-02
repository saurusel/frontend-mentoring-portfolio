import { getTasks } from "./api";

const appElement = document.querySelector("#app");

async function renderApp() {
    const tasks = await getTasks();

    if (tasks.length === 0) {
        appElement.innerHTML = "<div>Задач пока нет</div>";
        return;
    }

    console.log("Задания:", tasks);

    let htmlString = "<ui>";
    tasks.forEach((task) => {
        const textStyle = task.completed ? "text-decoration: line-through" : "";
        htmlString += `<li style="${textStyle}">${task.title}</li>`;
    });
    htmlString += "</ui>";

    appElement.innerHTML = htmlString;
}

renderApp();
