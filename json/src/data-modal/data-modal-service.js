import "./data-modal-component"

export class DataModalService {
    open() {
        const dataModal = document.createElement("data-modal")
        dataModal.closed.on(null, () => {
            document.body.removeChild(dataModal)
        })
        document.body.appendChild(dataModal)
        dataModal.open()
    }
}
