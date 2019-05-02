import * as JSONEditor from "jsoneditor"
import './style.css'
import { ModalService } from "./modal/modal-service"

const modalService = new ModalService()
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

    return INITIAL_JSON
}

document.onkeydown = event => {
    if (!event.ctrlKey) return
    event.preventDefault()

    if (event.shiftKey && event.code === "KeyR") {
        leftEditor.set(INITIAL_JSON)
        rightEditor.set(INITIAL_JSON)
    }
    else if (event.key === "s") {
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
}

document.body.onload = () => document.body.style.display = "block"
rightButton.onclick = () => updateRightEditor()
leftButton.onclick = () => updateLeftEditor()
helpButton.onclick = () => modalService.open()

const INITIAL_JSON = {
    "Array": [1, 2, 3],
    "Boolean": true,
    "Null": null,
    "Number": 123,
    "Object": { "a": "b", "c": "d" },
    "String": "Hello World",
    "Color": "#aabbcc"
}
