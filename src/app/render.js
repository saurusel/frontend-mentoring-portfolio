import { Header } from "../components/Header";
import { TaskList } from "../components/TaskList";
import { Modal } from "../components/Modal";
import { ICONS } from "../icons";
import { selectVisibleTasks } from "./selectors";
import { StatsPanel } from "../components/StatsPanel";

export function createRenderer({ appElement, state }) {
    return function renderApp() {
        const activeEl = document.activeElement;
        const wasSearchFocused = activeEl?.classList?.contains("js-search");

        let caretPos = null;
        if (wasSearchFocused) {
            caretPos = activeEl.selectionStart; // до перерендера в инпуте курсор
        }

        const modalTitle =
            state.modal.mode === "create" ? "NEW NOTE" : "EDIT NOTE";

        const visibleTasks = selectVisibleTasks(
            state.tasks,
            state.filterMode,
            state.searchQuery,
        );

        appElement.innerHTML = /*html*/ `
            <div class="page">
                ${StatsPanel(state.tasks)}
                <div class="container">
                    <main class="app">
                        ${Header({ filterMode: state.filterMode })}

                        <div class="tasks-surface">
                            <button class="fab" type="button" data-action="add">
                                <img class="icon-img" src="${ICONS.plus}"/>
                            </button>
                            <section class="list-area">
                                ${TaskList(visibleTasks)}
                            </section>
                        </div>
                        
                        ${Modal({
                            isOpen: state.modal.isOpen,
                            title: modalTitle,
                            value: state.modal.value,
                        })}
                    </main>
                </div>
            </div>
        `;

        const searchInput = appElement.querySelector(".js-search");
        if (searchInput) {
            searchInput.value = state.searchQuery;

            if (wasSearchFocused) {
                searchInput.focus();
                const pos =
                    typeof caretPos === "number"
                        ? caretPos
                        : searchInput.value.length;
                searchInput.setSelectionRange(pos, pos);
            }
        }
    };
}
