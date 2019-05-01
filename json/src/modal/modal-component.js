import templateText from './modal-component.html';
import { EventEmitter } from 'events';

customElements.define('data-modal', class extends HTMLElement {
    get closed() {
        return this._closed
    }

    constructor() {
        super();
        this._closed = new EventEmitter()

        const templateContent = this.getTemplateContent(templateText)
        const shadowRoot = this.attachShadow({ mode: 'open' });
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

    getTemplateContent(htmlText) {
        var template = document.createElement('template');
        template.innerHTML = htmlText;
        return template.content.cloneNode(true);
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
