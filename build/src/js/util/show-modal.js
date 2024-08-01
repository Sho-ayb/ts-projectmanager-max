export function showModal(message) {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const modalPara = document.querySelector('.modal__description');
    const closeModal = document.querySelector('.btn-close-modal');
    if (message) {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        modalPara.textContent = message;
    }
    function hideModal() {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
    //   setup event listener on the close modal btn
    closeModal.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
}
//# sourceMappingURL=show-modal.js.map