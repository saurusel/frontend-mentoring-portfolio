import "./styles/app.css";

import { getTasks } from "./api";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { ICONS } from "./icons";

const appElement = document.querySelector("#app");


async function renderApp() {
    const tasks = await getTasks();
    // const tasks = []; //для отображения empty пока crud не настроен 

    appElement.innerHTML = /*html*/ `
    <div class="page">
        <div class="container">
            <main class="app">
                ${Header()}
                <div>
                    <section class="list-area">
                        ${TaskList(tasks)}
                        <button class="fab" type="button">
                            <img class="icon-img" src="${ICONS.plus}"/>
                        </button>
                    </section>
                </div>
            </main>
        </div>
    </div>
    `;
}

renderApp();
