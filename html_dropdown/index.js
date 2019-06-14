const testEl = document.getElementById("testEl")
const testEl2 = document.getElementById("testEl2")
const testEl3 = document.getElementById("testEl3")
testEl.items = [1, 2, 3]
testEl.addEventListener("onenter", onEnter)
testEl2.items = [4, 5, 6]
testEl3.items = [7, 8, 9]

function addItem() {
    if (!testEl.value) return false

    testEl.items.unshift(testEl.value)
    testEl.items = [...new Set(testEl.items)]
    console.log(testEl.value)
    return false
}

function onEnter(event) {
    console.log("do something!")
}