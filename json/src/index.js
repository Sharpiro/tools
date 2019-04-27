import * as JSONEditor from "jsoneditor"
import './style.css'

const localStorageKey = "jsonData"

const initialJson = GetInitialJson()
const leftEditorOptions = { mode: 'code' }
const leftEditor = new JSONEditor(document.getElementById("leftEditor"), leftEditorOptions)
leftEditor.set(initialJson)

const rightEditorOptions = { mode: 'tree' }
const rightEditor = new JSONEditor(document.getElementById("rightEditor"), rightEditorOptions)
rightEditor.set(initialJson)

function updateRightEditor() {
    const leftJson = leftEditor.get()
    const jsonString = JSON.stringify(leftJson)
    localStorage.setItem(localStorageKey, jsonString)
    rightEditor.set(leftJson)
}

function updateLeftEditor() {
    const rightJson = rightEditor.get()
    const jsonString = JSON.stringify(rightJson)
    localStorage.setItem(localStorageKey, jsonString)
    leftEditor.set(rightJson)
}

function GetInitialJson() {
    try {
        const jsonString = localStorage.getItem(localStorageKey)
        if (jsonString && jsonString.length > 2) {
            const json = JSON.parse(jsonString)
            return json
        }
    }
    catch (err) {
        console.error("error occurred initializing json")
        console.log(err)
    }

    return {
        "Array": [1, 2, 3],
        "Boolean": true,
        "Null": null,
        "Number": 123,
        "Object": { "a": "b", "c": "d" },
        "String": "Hello World",
        "Color": "#aabbcc"
    }
}

document.onkeydown = event => {
    if (!event.ctrlKey || event.key != "s") return

    event.preventDefault()
    for (const element of event.path) {
        if (element.id == "rightEditor") {
            updateLeftEditor()
            return
        }
        if (element.id == "leftEditor") {
            updateRightEditor()
            return
        }
    }
}

rightButton.onclick = () => updateRightEditor()
leftButton.onclick = () => updateLeftEditor()