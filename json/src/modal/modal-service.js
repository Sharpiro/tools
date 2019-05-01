import "./modal-component"

export class ModalService {
    open() {
        const dataModal = document.createElement("data-modal")
        dataModal.closed.on(null, () => {
            document.body.removeChild(dataModal)
        })
        document.body.appendChild(dataModal)
        dataModal.open()
    }
}
