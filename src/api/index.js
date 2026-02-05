const BASE_URL = "http://localhost:3000";

const request = async (url, options) => {
    const res = await fetch(url, options);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;

    return await res.json();
};

export const getTasks = async () => {
    return await request(`${BASE_URL}/tasks`);
};

export const createTask = async ({ title }) => {
    return await request(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
    });
};

export const updateTask = async (id, patch) => {
    return await request(`${BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
    });
};

export const deleteTask = async ( id ) => {
    await request(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
};
