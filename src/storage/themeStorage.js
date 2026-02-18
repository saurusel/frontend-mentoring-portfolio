const THEME_KEY = "todo_theme";

export function loadThemeFromLS() {
    try {
        const raw = localStorage.getItem(THEME_KEY);
        return raw === "dark" ? "dark" : "light";
    } catch {
        return "light";
    }
}

export function saveThemeToLS(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme === "dark" ? "dark" : "light");
    } catch {}
}
