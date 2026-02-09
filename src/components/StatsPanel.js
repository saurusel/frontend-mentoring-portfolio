export function StatsPanel(tasks = []) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;

    return /*html*/ `
        <section class="stats-panel">
            <div class="stats-row">
                <span class="stats-label">Current tasks count:</span>
                <span class="stats-value">${total}</span>
            </div>

            <div class="stats-row">
                <span class="stats-label">Active tasks count:</span>
                <span class="stats-value">${active}</span>
            </div>

            <div class="stats-row">
                <span class="stats-label">Completed tasks count:</span>
                <span class="stats-value">${completed}</span>
            </div>
        </section>
    `;
}
