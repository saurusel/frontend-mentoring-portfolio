import { ICONS } from "../icons";

export const Task = (task) => {
    const isChecked = task.completed ? "checked" : "";

    return /*html*/ `
        <li class="todo-item" data-id="${task.id}">
            <label class="todo-main">
                <input class="checkbox-input" type="checkbox" ${isChecked} />
                    <span class="checkbox-box">
                        <img src="${ICONS.checkMark}" alt="">
                    </span>
                    <span class="todo-text">${task.title}</span>
                </span>
            </label>

            <div class="todo-actions">
                <button class="icon-ghost" type="button" data-action="edit">
                    <img class="icon-img" src="${ICONS.edit}" alt="">
                </button>
                <button class="icon-ghost" type="button" data-action="edit">
                    <img class="icon-img" src="${ICONS.trash}" alt="">
                </button>
            </div>
        </li>
    `;
};
