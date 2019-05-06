import { EventEmitter } from 'events';
import { getTemplateContent, getStyleNode } from "../element-functions"
import templateText from './confirm-modal-component.html';
import componentCssData from './confirm-modal-component.css';

customElements.define('confirm-modal', class extends HTMLElement {

    get closed() {
        return this._closed
    }

    get message() {
        return this.state.message
    }

    set message(data) {
        this.state.message = data
    }

    constructor() {
        super();
        this._closed = new EventEmitter()
        this.result = false

        this.state = new Proxy({}, {
            set: (target, property, value) => {
                target[property] = value;
                const elements = this.shadowRoot.querySelectorAll(`[data-binding="${property}"]`)
                for (const element of elements) {
                    element.innerHTML = value
                }
                return true;
            }
        });

        const templateContent = getTemplateContent(templateText)
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(getStyleNode(componentCssData[0][1]))
        this.shadowRoot.appendChild(templateContent);
        this.confirmModalContainer = this.shadowRoot.getElementById('confirm-modal-container')

        this.registerEvents()
    }

    open() {
        this.confirmModalContainer.style.display = "block";
    }

    close() {
        this._closed.emit(null, this.result)
        this.confirmModalContainer.style.display = "none";
    }

    registerEvents() {
        this.shadowRoot.getElementById("okButton").onclick = event => {
            this.result = true
            this.close()
        }

        this.shadowRoot.getElementById("cancelButton").onclick = event => {
            this.close()
        }

        window.onmousedown = event => {
            if (event.composedPath()[0].id === "confirm-modal-container") {
                this.close()
            }
        }
        window.onkeydown = event => {
            if (event.key === "Escape") {
                this.close()
            }
        }
    }
});
