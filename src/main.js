import './styles/main.css';
import { getTasks } from "./api";
import { TaskList } from "./components/TaskList";

const appElement = document.querySelector("#app");

async function renderApp() {
    const tasks = await getTasks();

    appElement.innerHTML = TaskList(tasks);
}

renderApp();
