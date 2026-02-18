import { ICONS, ICONS_RAW } from "../icons";

export const Task = (task) => {
    const isChecked = task.completed ? "checked" : "";

    return /*html*/ `
        <li class="todo-item" data-id="${task.id}">
            <label class="todo-main">
                <input class="checkbox-input" type="checkbox" ${isChecked}/>
                <span class="checkbox-box">
                    <img src="${ICONS.checkMark}" alt="">
                </span>
                    <span class="todo-text">${task.title}</span>
                </span>
            </label>


            <div class="todo-actions">
                <button 
                    class="todo-actions-icon icon-edit"
                    type="button" 
                    data-action="edit"
                >
                    <span class="icon-img">${ICONS_RAW.edit}</span>
                </button>
                <button 
                    class="todo-actions-icon icon-delete"
                    type="button" 
                    data-action="delete"
                >
                    <span class="icon-img">${ICONS_RAW.trash}</span>
                </button>
            </div>
        </li>
    `;
};
