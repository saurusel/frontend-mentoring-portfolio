export function selectVisibleTasks(tasks, filterMode, searchQuery) {
    let result;

    switch (filterMode) {
        case "completed":
            result = tasks.filter((t) => t.completed);
            break;
        case "incomplete":
            result = tasks.filter((t) => !t.completed);
            break;
        default:
            result = tasks;
    }

    const query = (searchQuery ?? "").trim().toLowerCase();
    if (!query) return result;

    return result.filter((t) => t.title.toLowerCase().includes(query));
}
