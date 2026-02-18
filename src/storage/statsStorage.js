const STATS_KEY = "todo_stats";

export function loadStatsFromLS() {
    try {
        const raw = localStorage.getItem(STATS_KEY);
        if (!raw) return { addedAllTime: 0, deletedAllTime: 0 };
        const parsed = JSON.parse(raw);
        return {
            addedAllTime: Number(parsed?.addedAllTime ?? 0),
            deletedAllTime: Number(parsed?.deletedAllTime ?? 0),
        };
    } catch {
        return { addedAllTime: 0, deletedAllTime: 0 };
    }
}

export function saveStatsToLS(stats) {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
}
