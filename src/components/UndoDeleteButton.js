import { ICONS, ICONS_RAW } from "../icons";

export function UndoDeleteButton(pendingDelete) {
    if (!pendingDelete) return "";

    const id = String(pendingDelete.taskId);
    const seconds = Math.max(0, Number(pendingDelete.secondsLeft) || 0);
    const elapsed = 5 - seconds;

    return /*html*/ `
        <button
            class="undo-delete"
            type="button"
            data-action="undo-delete"
            data-id="${id}"
        >
            <span class="undo-delete-countdown">
                <span class="undo-delete-ring" style="--undo-elapsed:${elapsed};">
                    ${ICONS_RAW.countDown}
                </span>
                <span class="undo-delete-seconds js-undo-seconds" data-id="${id}">
                    ${seconds}
                </span>
            </span>

            <span class="undo-delete-label">UNDO</span>

            <img class="undo-delete-arrow" src="${ICONS.undoArrow}" alt="" />
        </button>
    `;
}
