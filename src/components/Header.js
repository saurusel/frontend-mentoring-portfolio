import { ICONS } from "../icons";

const FILTERS = [
    { value: "all", label: "all" },
    { value: "completed", label: "completed" },
    { value: "incomplete", label: "incomplete" },
];

function renderOption(f) {
    return /*html*/ `
        <li>
            <button
                class="select-option"
                type="button"
                data-action="filter-set"
                data-value="${f.value}"
            >
                ${f.label}
            </button>
        </li>
    `;
}

export const Header = ({ filterMode = "all" } = {}) => {
    const current = FILTERS.find((f) => f.value === filterMode) || FILTERS[0];

    return /*html*/ `
        <header class="app-header">
            <h1 class="app-title">todo list</h1>

            <div class="toolbar">
                <div class="input-wrap">
                    <input 
                        type="text"
                        class="input js-search"
                        placeholder="Search note..."
                        autocomplete="off"
                    />
                    <button class="input-icon-btn" type="button">
                        <img class="icon-img" src="${ICONS.search}" alt="" />
                    </button>
                </div>

                <div class="select-wrap js-filter-select">
                    <button 
                        class="select-btn"
                        type="button"
                        data-action="filter-toggle"
                    >
                        <span class="select-value">${current.label}</span>
                        <img class="select-icon" src="${ICONS.chevronDown}" alt="" />
                    </button>

                    <ul class="select-menu">
                        ${FILTERS.map(renderOption).join("")}
                    </ul>
                </div>

                <button class="icon-btn js-theme-toggle" type="button">
                    <img class="icon-img" src="${ICONS.sun}" alt="" />
                </button>
            </div>
        </header>
    `;
};
