import { loadTasksFromLS, saveTasksToLS } from "../storage/tasksStorage";
import { loadStatsFromLS, saveStatsToLS } from "../storage/statsStorage";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

export function createActions({ state, renderApp }) {
    function setTasks(nextTasks) {
        state.tasks = nextTasks;
        saveTasksToLS(state.tasks);
        renderApp();
    }

    function clearPendingDeleteTimers(pending = state.pendingDelete) {
        if (!pending) return;

        if (pending.intervalId) {
            clearInterval(pending.intervalId);
            pending.intervalId = null;
        }

        if (pending.timeoutId) {
            clearTimeout(pending.timeoutId);
            pending.timeoutId = null;
        }
    }

    function updateUndoSeconds(seconds) {
        const el = document.querySelector(".js-undo-seconds");
        if (el) el.textContent = String(seconds);
    }

    async function confirmPendingDelete() {
        const pending = state.pendingDelete;
        if (!pending) return;

        clearPendingDeleteTimers(pending);

        state.pendingDelete = null;
        renderApp();

        try {
            await deleteTask(pending.taskId);
            state.stats.deletedAllTime += 1;
            saveStatsToLS(state.stats);
            renderApp();
        } catch {
            setTasks(pending.prevTasks);
            return;
        }
    }

    function undoPendingDelete() {
        const pending = state.pendingDelete;
        if (!pending) return;

        clearPendingDeleteTimers(pending);
        state.pendingDelete = null;

        setTasks(pending.prevTasks);
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
            state.stats.addedAllTime += 1;
            saveStatsToLS(state.stats);
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
        if (state.pendingDelete) {
            await confirmPendingDelete();
        }

        const prevTasks = state.tasks;

        state.pendingDelete = {
            taskId: id,
            prevTasks,
            secondsLeft: 5,
            intervalId: null,
            timeoutId: null,
        };

        setTasks(state.tasks.filter((t) => String(t.id) !== String(id)));

        state.pendingDelete.intervalId = setInterval(() => {
            if (!state.pendingDelete) return;

            state.pendingDelete.secondsLeft -= 1;
            const next = Math.max(0, state.pendingDelete.secondsLeft);
            updateUndoSeconds(next);

            if (next <= 0) {
                clearInterval(state.pendingDelete.intervalId);
                state.pendingDelete.intervalId = null;
            }
        }, 1000);

        state.pendingDelete.timeoutId = setTimeout(() => {
            confirmPendingDelete();
        }, 5000);
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
        state.stats = loadStatsFromLS();
        renderApp();

        try {
            const remote = await getTasks();
            const pendingId = state.pendingDelete?.taskId;
            const filtered = pendingId
                ? remote.filter((t) => String(t.id) !== String(pendingId))
                : remote;
            setTasks(filtered);
        } catch {}
    }

    return {
        setTasks,
        openCreateModal,
        openEditModal,
        closeModal,
        applyModal,
        handleDelete,
        undoPendingDelete,
        toggleCompleted,
        initApp,
    };
}
