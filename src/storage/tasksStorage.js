const TASKS_KEY = "todo_tasks";

export function loadTasksFromLS() {
    try {
        const raw = localStorage.getItem(TASKS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveTasksToLS(tasks) {
    try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch {}
}
