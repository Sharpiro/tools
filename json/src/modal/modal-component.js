import { EventEmitter } from 'events';
import { getTemplateContent, getStyleNode } from "../element-functions"
import templateText from './modal-component.html';
import componentCssData from './modal-component.css';

customElements.define('data-modal', class extends HTMLElement {
    get closed() {
        return this._closed
    }

    constructor() {
        super();
        this._closed = new EventEmitter()

        const templateContent = getTemplateContent(templateText)
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(getStyleNode(componentCssData[0][1]))
        shadowRoot.appendChild(templateContent);
        this.dataModalContainer = shadowRoot.getElementById('data-modal-container')

        this.registerEvents(shadowRoot)
    }

    open() {
        this.dataModalContainer.style.display = "block";
    }

    close() {
        this.closed.emit(null)
        this.dataModalContainer.style.display = "none";
    }

    registerEvents(shadowRoot) {
        window.onmousedown = event => {
            if (event.path[0].id === "data-modal-container") {
                this.close()
            }
        }

        shadowRoot.getElementById("close-button").onclick = () => this.close()
    }
});
