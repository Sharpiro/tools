import templateText from './modal-component.html';
import { EventEmitter } from 'events';

let shadowRoot
let templateElement
customElements.define('data-modal', class extends HTMLElement {

    constructor() {
        super();
        this.closed = new EventEmitter()

        templateElement = this.parseHTML(templateText)
        shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateElement.content.cloneNode(true));
        this.modal = shadowRoot.getElementById('myModal')

        window.onclick = event => {
            if (event.path[0].className === "modal") {
                this.modal.style.display = "none";
            }
        }

        var span = shadowRoot.querySelectorAll(".close")[0];
        span.onclick = () => {
            this.modal.style.display = "none";
            this.visible = false
            this.closed.emit(null)
        }
    }

    open() {
        this.modal.style.display = "block";
        console.log("opening modal...")
    }


    close() {
        console.log("closing modal...")
        this.closed.emit(null)
        this.modal.style.display = "none";
    }

    parseHTML(htmlText) {
        var t = document.createElement('template');
        t.innerHTML = htmlText;
        return t;
    }
});
