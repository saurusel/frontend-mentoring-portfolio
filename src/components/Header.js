import {ICONS} from '../icons'

export const Header = () => {
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

                <div class="select-wrap">
                    <select class="select js-filter">
                        <option value="all">ALL</option>
                        <option value="completed">Complete</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                    <img class="select-icon" src="${ICONS.chevronDown}" alt="" />
                </div>

                <button class="icon-btn js-theme-toggle" type="button">
                    <img class="icon-img" src="${ICONS.sun}" alt="" />
                </button>
            </div>
        </header>
    `;
};
