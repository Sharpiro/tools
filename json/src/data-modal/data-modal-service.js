import "./data-modal-component"

export class DataModalService {
    open() {
        const dataModal = document.createElement("data-modal")
        document.body.appendChild(dataModal)
        const promise = new Promise((res) => {
            dataModal.closed.on(null, () => {
                document.body.removeChild(dataModal)
                res()
            })
        })
        dataModal.open()
        return promise
    }
}
