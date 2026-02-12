import { debounce } from "../utils/debounce";

export function createEventRegistrar({
    appElement,
    state,
    renderApp,
    actions,
}) {
    return function registerEventListeners() {
        const applySearchDebounced = debounce((value) => {
            state.searchQuery = value;
            renderApp();
        }, 300);

        appElement.addEventListener("input", (e) => {
            const input = e.target.closest(".js-search");
            if (!input) return;
            applySearchDebounced(input.value);
        });

        appElement.addEventListener("change", async (e) => {
            const checkbox = e.target.closest(".checkbox-input");
            if (!checkbox) return;

            const id = checkbox.closest(".todo-item").dataset.id;
            if (!id) return;

            actions.toggleCompleted(id, Boolean(checkbox.checked));
        });

        appElement.addEventListener("click", async (e) => {
            const actionEl = e.target.closest("[data-action]");
            if (!actionEl) return;

            const action = actionEl.dataset.action;

            if (action === "undo-delete") {
                const pendingId = actionEl.dataset.id;
                if (!pendingId) return;
                actions.undoPendingDelete(pendingId);
                return;
            }

            if (action === "delete-all") {
                actions.handleDeleteAll();
                return;
            }

            if (action === "theme-toggle") {
                actions.toggleTheme();
                return;
            }

            if (action === "filter-toggle") {
                const wrap = actionEl.closest(".js-filter-select");
                if (!wrap) return;

                wrap.classList.toggle("is-open");
                return;
            }

            if (action === "filter-set") {
                const value = actionEl.dataset.value;
                if (!value) return;
                state.filterMode = value;

                const wrap = actionEl.closest(".js-filter-select");
                if (wrap) wrap.classList.remove("is-open");
                setTimeout(() => {
                    renderApp();
                }, 110);
                return;
            }

            if (action === "add") {
                actions.openCreateModal();
                return;
            }

            if (action === "modal-close") {
                actions.closeModal();
                return;
            }

            if (action === "error-close") {
                actions.closeErrorModal();
                return;
            }

            if (action === "modal-apply") {
                actions.applyModal();
                return;
            }

            const item = actionEl.closest(".todo-item");
            const id = item?.dataset.id;
            if (!id) return;

            if (action === "edit") {
                actions.openEditModal(id);
                return;
            }

            if (action === "delete") {
                actions.handleDelete(id);
                return;
            }
        });

        document.addEventListener("keydown", async (e) => {
            if (e.key === "Escape" && state.errorModal.isOpen) {
                actions.closeErrorModal();
                return;
            }

            if (!state.modal.isOpen) {
                if (e.key == "+") {
                    actions.openCreateModal();
                    return;
                }
            }

            if (e.key === "Escape") {
                actions.closeModal();
                return;
            }

            if (e.key == "Enter" && state.modal.isOpen) {
                const input = document.querySelector(".modal-input");
                if (document.activeElement === input) {
                    await actions.applyModal();
                    return;
                }
            }
        });
    };
}
