customElements.define('test-element', class extends HTMLElement {
    // testProp

    constructor() {
        super()
        this.items = ["A", "About", "Contact"]

        this.attachShadow({ mode: 'open' });
        const style = `
        input{
            width:500px;
        }
        .dropdown {
            position: relative;
            display: inline-block;
          }
          
          .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            overflow: auto;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
          }
          
          .dropdown-content span {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
          }
          
          .dropdown span:hover {background-color: #ddd;}
          
          .show {display: block;}
`

        const html = `
        <div class="dropdown">
            <input id="testInput" onclick="console.log('#shadowRoot')" oninput="onKeyInput()" type="search">
            <div id="myDropdown" class="dropdown-content"></div>
        </div>
`
        const template = document.createElement('template');
        template.innerHTML = html;
        const x = template.content.cloneNode(true);
        this.shadowRoot.appendChild(x);

        const styleElement = document.createElement("style")
        styleElement.innerHTML = style
        this.shadowRoot.appendChild(styleElement)

        this.dropdown = this.shadowRoot.getElementById("myDropdown")
        this.updateDropdown()

        this.registerEvents()
    }

    updateDropdown() {
        this.dropdown.innerHTML = ""
        for (var item of this.items) {
            var span = document.createElement("span")
            span.onclick = this.optionClicked
            span.innerText = item
            this.dropdown.appendChild(span)
        }
    }

    openDropdown() {
        this.dropdown.classList.toggle("show");
    }

    clearDropdown = () => {
        if (this.dropdown.classList.contains('show')) {
            this.dropdown.classList.remove('show');
        }
    }

    optionClicked = (event) => {
        if (!event.srcElement.innerText) return
        this.shadowRoot.getElementById("testInput").value = event.srcElement.innerText
    }

    onKeyInput() {
        this.clearDropdown()
    }

    registerEvents() {
        this.shadowRoot.onclick = (event) => {
            console.log("whatever")
        }
        window.onclick = (event) => {
            console.log(event.target)
            if (!event.target.matches('test-element')) {
                this.clearDropdown()
            }
        }

        this.shadowRoot.getElementById("testInput").onclick = () => {
            this.openDropdown()
        }

        this.shadowRoot.getElementById("testInput").oninput = () => {
            this.onKeyInput()
        }
    }
})
