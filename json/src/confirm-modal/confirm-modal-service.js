import "./confirm-modal-component"

export class ConfirmModalService {
    confirm() {
        const confirmModal = document.createElement("confirm-modal")
        document.body.appendChild(confirmModal)
        confirmModal.message = "Are you sure you want to reset all data?"
        const promise = new Promise((res) => {
            confirmModal.closed.on(null, result => {
                document.body.removeChild(confirmModal)
                res(result)
            })
        })
        confirmModal.open()
        return promise
    }
}
