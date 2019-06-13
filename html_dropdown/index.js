// let items = ["https://abc123123.abc123123.com:8084/api/abc123123/abc123123/abc123123/abc123123/abc123123/abc123123/abc123123", "About", "Contact"]
// let items = ["A", "About", "Contact"]
// let dropdown

// initialize()

// function initialize() {
//     dropdown = document.getElementById("myDropdown")
//     updateDropdown()
// }

// function updateDropdown() {
//     dropdown.innerHTML = ""
//     for (var item of items) {
//         var span = document.createElement("span")
//         span.onclick = optionClicked
//         span.innerText = item
//         dropdown.appendChild(span)
//     }
// }

// function openDropdown() {
//     dropdown.classList.toggle("show");
// }

// function clearDropdown() {
//     if (dropdown.classList.contains('show')) {
//         dropdown.classList.remove('show');
//     }
// }

// function optionClicked(event) {
//     if (!event.srcElement.innerText) return
//     testInput.value = event.srcElement.innerText
// }

// function onKeyInput() {
//     clearDropdown()
// }

// function addItem() {
//     if (!testInput.value) return

//     items.unshift(testInput.value)
//     items = [...new Set(items)]
//     updateDropdown()
// }

// window.onclick = function (event) {
//     if (!event.target.matches('#testInput')) {
//         clearDropdown()
//     }
// }