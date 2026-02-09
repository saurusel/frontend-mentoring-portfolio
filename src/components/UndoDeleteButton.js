import { ICONS, ICONS_RAW } from "../icons";

export function UndoDeleteButton(pendingDelete) {
    if (!pendingDelete) return "";

    const seconds = Math.max(0, Number(pendingDelete.secondsLeft) || 0);

    return /*html*/ `
        <button
            class="undo-delete"
            type="button"
            data-action="undo-delete"
        >
            <span class="undo-delete-countdown">
                <span class="undo-delete-ring js-undo-timer">${ICONS_RAW.countDown}</span>
                <span class="undo-delete-seconds js-undo-seconds">${seconds}</span>
            </span>

            <span class="undo-delete-label">UNDO</span>

            <img class="undo-delete-arrow" src="${ICONS.undoArrow}" alt=""
            />
        </button>
    `;
}
