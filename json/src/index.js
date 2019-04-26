import * as JSONEditor from "jsoneditor"
import './style.css';

var json = {
    "Array": [1, 2, 3],
    "Boolean": true,
    "Null": null,
    "Number": 123,
    "Object": { "a": "b", "c": "d" },
    "String": "Hello World"
};

var options = {};
var leftEditor = new JSONEditor(document.getElementById("leftEditor"), options);
leftEditor.set(json);

var rightEditor = new JSONEditor(document.getElementById("rightEditor"), options);
rightEditor.set(json);

// var json = editor.get();
