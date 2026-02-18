import { UndoDeleteButton } from "./UndoDeleteButton";

export function UndoDeleteStack(pendingDeletes) {
    if (!pendingDeletes || pendingDeletes.length === 0) return "";

    return /*html*/ `
        <div class="undo-delete-stack">
            ${pendingDeletes.map((p) => UndoDeleteButton(p)).join("")}
        </div>
    `;
}
