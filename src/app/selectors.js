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


export function selectSortedTasks(tasks, sortMode) {
    if (!tasks || tasks.length === 0) return tasks;

    switch (sortMode) {
        case "title-asc":
            return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
        case "title-desc":
            return [...tasks].sort((a, b) => b.title.localeCompare(a.title));
        case "incomplete-first":
            return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
        case "completed-first":
            return [...tasks].sort((a, b) => Number(b.completed) - Number(a.completed));
        default:
            return tasks;
    }
}
