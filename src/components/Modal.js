export const Modal = ({isOpen, title, value}) => {
    if (!isOpen) return "";

    return /*html*/`
        <div class="modal">
            <div class="modal-overlay" data-action="modal-close"> </div>
            
            <div class="modal-window"> 
                <h1 class="modal-title">${title}</h1>

                <input 
                    class="modal-input"
                    type="text"
                    placeholder="Input your note..."
                    value="${value}"
                >

                <div class="modal-actions">
                    <button class="modal-btn modal-btn--ghost" type="button" data-action="modal-close">
                        CANCEL
                    </button>

                    <button class="modal-btn modal-btn--primary" type="button" data-action="modal-apply">
                        APPLY
                    </button>
                </div>
            </div>
        </div>
    `;
};
