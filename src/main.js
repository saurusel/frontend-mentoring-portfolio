import "./styles/app.css";

import { getTasks, createTask, updateTask, deleteTask } from "./api";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { Modal } from "./components/Modal";
import { ICONS } from "./icons";

const appElement = document.querySelector("#app");

const state = {
    tasks: [],
    modal: {
        isOpen: false,
        mode: "create",
        editingId: null,
        value: "",
    },
};

const openCreateModal = () => {
    state.modal.isOpen = true;
    state.modal.mode = "create";
    state.modal.editingId = null;
    state.modal.value = "";
    renderApp();
};

const openEditModal = (id) => {
    const task = state.tasks.find((t) => String(id) === String(t.id));
    if (!task) return;

    state.modal.isOpen = true;
    state.modal.mode = "edit";
    state.modal.editingId = task.id;
    state.modal.value = task.title;
    renderApp();
};

const closeModal = () => {
    state.modal.isOpen = false;
    state.modal.mode = "create";
    state.modal.editingId = null;
    state.modal.value = "";
    renderApp();
};

const applyModal = async () => {
    const input = document.querySelector(".modal-input");
    const title = (input?.value ?? "").trim();
    if (!title) return;

    if (state.modal.mode === "create") {
        const created = await createTask({ title });
        state.tasks = [created, ...state.tasks];
        closeModal();
        return;
    }

    if (state.modal.mode === "edit") {
        const id = state.modal.editingId;
        const updated = await updateTask(id, {title});
        state.tasks = state.tasks.map((t) =>
            String(t.id) === String(id) ? updated : t,
        );
        closeModal();
    }
};

const handleDelete = async (id) => {
    await deleteTask(id);
    state.tasks = state.tasks.filter((t) => String(t.id) !== String(id));
    renderApp();
};

function renderApp() {
    const modalTitle = state.modal.mode === "create" ? "NEW NOTE" : "EDIT NOTE";

    appElement.innerHTML = /*html*/ `
        <div class="page">
            <div class="container">
                <main class="app">
                    ${Header()}

                    <div>
                        <section class="list-area">
                            ${TaskList(state.tasks)}

                            <button class="fab" type="button" data-action="add">
                                <img class="icon-img" src="${ICONS.plus}"/>
                            </button>
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
}

async function asyncRender() {
    state.tasks = await getTasks();
    renderApp();
}

asyncRender();

appElement.addEventListener("change", async (e) => {
    const checkbox = e.target.closest(".checkbox-input");
    if (!checkbox) return;

    const id = checkbox.closest(".todo-item").dataset.id;
    if (!id) return;

    const nextCompl = Boolean(checkbox.checked);
    state.tasks = state.tasks.map((t) => 
        String(id) === String(t.id) ? { ...t, completed: nextCompl } : t
    );

    updateTask(id, { completed: nextCompl})
})

appElement.addEventListener("click", async (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.dataset.action;

    if (action === "add") {
        openCreateModal();
        return;
    }

    if (action === "modal-close") {
        closeModal();
        return;
    }

    if (action === "modal-apply") {
        applyModal();
        return;
    }

    const item = actionEl.closest(".todo-item");
    const id = item?.dataset.id;
    if (!id) return;

    if (action === "edit") {
        openEditModal(id);
        return;
    }

    if (action === "delete") {
        handleDelete(id);
        return;
    }
});

document.addEventListener("keydown", async (e) => {
    if (!state.modal.isOpen) {
        if (e.key == "+") {
            openCreateModal();
            return;
        }
    }

    if (e.key === "Escape") {
        closeModal();
        return;
    }

    if (e.key == "Enter" && state.modal.isOpen) {
        const input = document.querySelector(".modal-input");
        if (document.activeElement === input) {
            await applyModal();
            return;
        }
    }
});
