export const ErrorModal = ({ isOpen, message }) => {
    if (!isOpen) return "";

    return /*html*/ `
        <div class="modal">
            <div class="modal-overlay" data-action="error-close"></div>

            <div class="modal-window">
                <h1 class="modal-title">ERROR</h1>
                <div class="modal-message">${message}</div>

                <div class="modal-actions modal-actions-center">
                    <button class="modal-btn modal-btn--primary" type="button" data-action="error-close">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;
};