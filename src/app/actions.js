import { loadTasksFromLS, saveTasksToLS } from "../storage/tasksStorage";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

export function createActions({ state, renderApp }) {
    function setTasks(nextTasks) {
        state.tasks = nextTasks;
        saveTasksToLS(state.tasks);
        renderApp();
    }

    function openCreateModal() {
        state.modal.isOpen = true;
        state.modal.mode = "create";
        state.modal.editingId = null;
        state.modal.value = "";
        renderApp();
    }

    function openEditModal(id) {
        const task = state.tasks.find((t) => String(id) === String(t.id));
        if (!task) return;

        state.modal.isOpen = true;
        state.modal.mode = "edit";
        state.modal.editingId = task.id;
        state.modal.value = task.title;
        renderApp();
    }

    function closeModal() {
        state.modal.isOpen = false;
        state.modal.mode = "create";
        state.modal.editingId = null;
        state.modal.value = "";
        renderApp();
    }

    async function applyModal() {
        const input = document.querySelector(".modal-input");
        const title = (input?.value ?? "").trim();
        if (!title) return;

        if (state.modal.mode === "create") {
            const created = await createTask({ title });
            setTasks([created, ...state.tasks]);
            closeModal();
            return;
        }

        if (state.modal.mode === "edit") {
            const id = state.modal.editingId;
            const updated = await updateTask(id, { title });
            setTasks(
                state.tasks.map((t) =>
                    String(t.id) === String(id) ? updated : t,
                ),
            );
            closeModal();
        }
    }

    async function handleDelete(id) {
        await deleteTask(id);
        setTasks(state.tasks.filter((t) => String(t.id) !== String(id)));
    }

    function toggleCompleted(id, nextCompl) {
        const nextTasks = state.tasks.map((t) =>
            String(id) === String(t.id) ? { ...t, completed: nextCompl } : t,
        );

        setTasks(nextTasks);
        updateTask(id, { completed: nextCompl }); // без await — UI быстрее
    }

    async function initApp() {
        state.tasks = loadTasksFromLS();
        renderApp();

        try {
            const remote = await getTasks();
            setTasks(remote);
        } catch {}
    }

    return {
        setTasks,
        openCreateModal,
        openEditModal,
        closeModal,
        applyModal,
        handleDelete,
        toggleCompleted,
        initApp,
    };
}
