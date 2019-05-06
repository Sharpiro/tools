import { EventEmitter } from 'events';
import { getTemplateContent, getStyleNode } from "../element-functions"
import templateText from './data-modal-component.html';
import componentCssData from './data-modal-component.css';

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

        this.registerEvents()
    }

    open() {
        this.dataModalContainer.style.display = "block";
    }

    close() {
        this.closed.emit(null)
        this.dataModalContainer.style.display = "none";
    }

    registerEvents() {
        window.onmousedown = event => {
            if (event.composedPath()[0].id === "data-modal-container") {
                this.close()
            }
        }
        window.onkeydown = event => {
            if (event.key === "Escape") {
                this.close()
            }
        }

        this.shadowRoot.getElementById("close-button").onclick = () => this.close()
    }
});
