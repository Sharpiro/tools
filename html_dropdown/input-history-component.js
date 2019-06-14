customElements.define('input-history', class extends HTMLElement {
    initItems() {
        const itemsBracketAttr = this.getAttribute("[items]")
        let array = this.shadowRoot.ownerDocument[itemsBracketAttr]
        if (!array) this.items = []
    }

    initEvents() {
        const onEnterName = this.getAttribute("onenter")
        if (!onEnterName) return
    }

    get value() {
        return this.shadowRoot.getElementById("inputElement").value
    }

    set value(value) {
        this.shadowRoot.getElementById("inputElement").value = value
    }

    get items() {
        return this._items
    }

    set items(array) {
        if (array.length === undefined) {
            throw new Error("items value is not iterable")
        }
        this._items = new Proxy(array, {
            // apply: function (target, thisArg) {
            //     return thisArg[target].apply(this, argumentList);
            // },
            // deleteProperty: function (_, property) {
            //     console.log("Deleted %s", property);
            //     return true;
            // },
            set: (target, property, value, _) => {
                target[property] = value;
                this.updateDropdown()
                // console.log("Set %s to %o", property, value);
                return true;
            }
        });
        this.updateDropdown()
    }

    get onenter() {
        return this._onenter
    }

    constructor() {
        super()

        this._onenter = new Event("onenter")
        this.uniqueId = Math.floor(Math.random() * 4000000000)
        this.attachShadow({ mode: 'open' });

        const style = `
        :host {
            display: inline-block;
          }
        input{
            width: 100%;
        }
        .dropdown {
            position: relative;
            display: inline-block;
          }
          
          .dropdown-content {
            cursor: default;
            white-space: nowrap;
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
        <input id="inputElement" type="search">
        <div class="dropdown">
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

        this.registerEvents()
        this.initItems()
        this.initEvents()
    }

    updateDropdown() {
        this.dropdown.innerHTML = ""
        for (var item of this._items) {
            var span = document.createElement("span")
            // span.setAttribute("title", item)
            span.onclick = (event) => {
                this.shadowRoot.getElementById("inputElement").value = event.srcElement.innerText
                this.clearDropdown()
            }
            span.innerText = item
            this.dropdown.appendChild(span)
        }
    }

    openDropdown() {
        this.dropdown.classList.toggle("show");
    }

    clearDropdown() {
        if (this.dropdown.classList.contains('show')) {
            this.dropdown.classList.remove('show');
        }
    }

    onKeyInput() {
        this.clearDropdown()
    }

    registerEvents() {
        window.addEventListener("click", (event) => {
            if (event.target.uniqueId !== this.uniqueId) {
                this.clearDropdown()
            }
        })

        this.shadowRoot.getElementById("inputElement").onclick = () => {
            this.openDropdown()
        }
        this.shadowRoot.getElementById("inputElement").onkeydown = (event) => {
            if (event.key === "Enter") {
                this.clearDropdown()
                this.dispatchEvent(this._onenter)
            }
        }
        this.shadowRoot.getElementById("inputElement").oninput = () => {
            this.onKeyInput()
        }
    }
})

