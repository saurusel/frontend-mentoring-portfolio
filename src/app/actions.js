import { loadTasksFromLS, saveTasksToLS } from "../storage/tasksStorage";
import { loadStatsFromLS, saveStatsToLS } from "../storage/statsStorage";
import { loadThemeFromLS, saveThemeToLS } from "../storage/themeStorage";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

export function createActions({ state, renderApp }) {
    function setTasks(nextTasks) {
        state.tasks = nextTasks;
        saveTasksToLS(state.tasks);
        renderApp();
    }

    function ensureTaskOrder() {
        if (!Array.isArray(state.taskOrder) || state.taskOrder.length === 0) {
            state.taskOrder = state.tasks.map((t) => String(t.id));
            return;
        }
    }

    function removeFromTaskOrder(taskId) {
        state.taskOrder = state.taskOrder.filter(
            (id) => String(id) !== String(taskId),
        );
    }

    function restoreTaskIntoStateTasks(pending) {
        const taskId = String(pending.taskId);
        const restored = [...state.tasks];
        const indexById = new Map(
            restored.map((t, index) => [String(t.id), index]),
        );

        const beforeId = pending.beforeId ? String(pending.beforeId) : null;
        const afterId = pending.afterId ? String(pending.afterId) : null;

        let pos = null;

        if (beforeId && indexById.has(beforeId)) {
            pos = indexById.get(beforeId) + 1;
        } else if (afterId && indexById.has(afterId)) {
            pos = indexById.get(afterId);
        } else {
            ensureTaskOrder();

            const orderIndex = state.taskOrder.findIndex(
                (id) => String(id) === taskId,
            );

            if (orderIndex !== -1) {
                // слева
                for (let i = orderIndex - 1; i >= 0; i--) {
                    const id = String(state.taskOrder[i]);
                    if (indexById.has(id)) {
                        pos = indexById.get(id) + 1;
                        break;
                    }
                }
                if (pos === null) {
                    // справа
                    for (
                        let i = orderIndex + 1;
                        i < state.taskOrder.length;
                        i++
                    ) {
                        const id = String(state.taskOrder[i]);
                        if (indexById.has(id)) {
                            pos = indexById.get(id);
                            break;
                        }
                    }
                }
            }
        }

        if (pos === null) pos = restored.length;

        restored.splice(pos, 0, pending.task);
        return restored;
    }

    function setPendingDeletes(next) {
        state.pendingDeletes = next;
        renderApp();
    }

    function findPending(taskId) {
        return state.pendingDeletes.find(
            (p) => String(p.taskId) === String(taskId),
        );
    }

    function removePending(taskId) {
        setPendingDeletes(
            state.pendingDeletes.filter(
                (p) => String(p.taskId) !== String(taskId),
            ),
        );
    }

    function clearPendingDeleteTimers(pending) {
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

    function updateUndoSeconds(taskId, seconds) {
        const el = document.querySelector(
            `.js-undo-seconds[data-id="${String(taskId)}"]`,
        );
        if (el) el.textContent = String(seconds);
    }

    async function handleDelete(id) {
        const taskId = String(id);
        ensureTaskOrder();

        const index = state.tasks.findIndex((t) => String(t.id) === taskId);
        if (index === -1) return;

        const task = state.tasks[index];

        const orderIndex = state.taskOrder.findIndex(
            (x) => String(x) === taskId,
        );

        const beforeId =
            orderIndex > 0 ? String(state.taskOrder[orderIndex - 1]) : null;

        const afterId =
            orderIndex !== -1 && orderIndex < state.taskOrder.length - 1
                ? String(state.taskOrder[orderIndex + 1])
                : null;

        setTasks(state.tasks.filter((t) => String(t.id) !== taskId));

        const pending = {
            taskId,
            task,
            beforeId,
            afterId,
            secondsLeft: 5,
            intervalId: null,
            timeoutId: null,
        };

        setPendingDeletes([...state.pendingDeletes, pending]);

        pending.intervalId = setInterval(() => {
            const p = findPending(taskId);
            if (!p) return;

            p.secondsLeft -= 1;
            const next = Math.max(0, p.secondsLeft);
            updateUndoSeconds(taskId, next);

            if (next <= 0) {
                clearInterval(p.intervalId);
                p.intervalId = null;
            }
        }, 1000);

        pending.timeoutId = setTimeout(() => {
            confirmPendingDelete(taskId);
        }, 5000);
    }

    async function handleDeleteAll() {
        if (!state.tasks || state.tasks.length === 0) return;

        const taskId = "delete-all";
        const tasksSnapshot = [...state.tasks];

        setTasks([]);

        const pending = {
            taskId,
            isDeleteAll: true,
            tasksSnapshot,
            secondsLeft: 5,
            intervalId: null,
            timeoutId: null,
        };

        setPendingDeletes([pending]);

        pending.intervalId = setInterval(() => {
            const p = findPending(taskId);
            if (!p) return;

            p.secondsLeft -= 1;
            const next = Math.max(0, p.secondsLeft);
            updateUndoSeconds(taskId, next);

            if (next <= 0) {
                clearInterval(p.intervalId);
                p.intervalId = null;
            }
        }, 1000);

        pending.timeoutId = setTimeout(() => {
            confirmPendingDelete(taskId);
        }, 5000);
    }

    async function confirmPendingDelete(taskId) {
        const pending = findPending(taskId);
        if (!pending) return;

        if (pending.isDeleteAll) {
            await confirmPendingDeleteAll(pending);
            return;
        }

        clearPendingDeleteTimers(pending);
        removePending(taskId); // сразу убрать кнопку

        try {
            await deleteTask(taskId);
            removeFromTaskOrder(taskId);
            state.stats.deletedAllTime += 1;
            saveStatsToLS(state.stats);
            renderApp();
        } catch {
            const restored = restoreTaskIntoStateTasks(pending);
            setTasks(restored);
        }
    }

    async function confirmPendingDeleteAll(pending) {
        clearPendingDeleteTimers(pending);
        removePending(pending.taskId);

        const snapshot = pending.tasksSnapshot ?? [];
        const ids = snapshot.map((t) => t.id);

        for (const id of ids) {
            await deleteTask(id);
        }

        state.stats.deletedAllTime += ids.length;
        saveStatsToLS(state.stats);

        renderApp();
    }

    function undoPendingDelete(taskId) {
        const pending = findPending(taskId);
        if (!pending) return;

        clearPendingDeleteTimers(pending);
        removePending(taskId);

        if (pending.isDeleteAll) {
            const restored = [...state.tasks, ...(pending.tasksSnapshot ?? [])];
            setTasks(restored);
            return;
        }

        const restored = restoreTaskIntoStateTasks(pending);
        setTasks(restored);
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
        if (!title) {
            openErrorModal("Empty input");
            return;
        }

        if (state.modal.mode === "create") {
            const created = await createTask({ title });
            state.taskOrder = [
                String(created.id),
                ...state.taskOrder.filter(
                    (x) => String(x) !== String(created.id),
                ),
            ];
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

    function openErrorModal(message) {
        state.errorModal.isOpen = true;
        state.errorModal.message = message;
        renderApp();
    }

    function closeErrorModal() {
        state.errorModal.isOpen = false;
        state.errorModal.message = "";
        renderApp();
    }


    function toggleCompleted(id, nextCompl) {
        const nextTasks = state.tasks.map((t) =>
            String(id) === String(t.id) ? { ...t, completed: nextCompl } : t,
        );

        setTasks(nextTasks);
        updateTask(id, { completed: nextCompl }); // без await — UI быстрее
    }

    function applyTheme(theme) {
        state.theme = theme === "dark" ? "dark" : "light";
        document.documentElement.classList.toggle(
            "theme-dark",
            state.theme === "dark",
        );
        saveThemeToLS(state.theme);
    }

    function toggleTheme() {
        applyTheme(state.theme === "dark" ? "light" : "dark");
        renderApp();
    }

    async function initApp() {
        state.tasks = loadTasksFromLS();
        state.stats = loadStatsFromLS();
        state.pendingDeletes = [];
        state.taskOrder = state.tasks.map((t) => String(t.id));
        applyTheme(loadThemeFromLS());
        renderApp();

        try {
            const remote = await getTasks();
            const remoteById = new Map(remote.map((t) => [String(t.id), t]));

            const local = state.tasks;
            const localIds = new Set(local.map((t) => String(t.id)));

            const filtered = local.map((localTask) => {
                const fromRemote = remoteById.get(String(localTask.id));
                return fromRemote ?? localTask;
            });

            for (const task of remote) {
                const id = String(task.id);
                if (!localIds.has(id)) {
                    filtered.push(task);
                    state.taskOrder.push(id);
                }
            }

            setTasks(filtered);
        } catch {}
    }

    return {
        setTasks,
        openCreateModal,
        openEditModal,
        closeModal,
        applyModal,
        closeErrorModal,
        handleDelete,
        undoPendingDelete,
        handleDeleteAll,
        toggleCompleted,
        toggleTheme,
        initApp,
    };
}
