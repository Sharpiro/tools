import { set_panic_hook } from "brain_freak";
import { LazyLoader } from "./brain_freak";

set_panic_hook(); // additional console info on wasm panic

const defaultProgram = ",[>+.<-]";
const defaultInput = [2, 1];
let description = localStorage.getItem("description");
const programJson = localStorage.getItem("program");
let program = programJson ? programJson : defaultProgram;
const inputJson = localStorage.getItem("input");
/** @type {number[]} */
let input = inputJson ? JSON.parse(inputJson) : defaultInput;
const memSize = 10;
const outputCapacity = 10;

let lazyLoader = new LazyLoader(program, memSize, outputCapacity, input);

updatePage(lazyLoader.currentState);

/** @type {HTMLInputElement} */
const descriptionEl = (document.getElementById("descriptionEl"));
descriptionEl.value = description ? description : "";
/** @type {HTMLInputElement} */
const inputDataEl = (document.getElementById("inputDataEl"));
inputDataEl.value = input.join(",");
/** @type {HTMLInputElement} */
const programInputEl = (document.getElementById("programInputEl"));
programInputEl.value = program;


/** @param {{key: string, target: any}} ev */
window.onkeydown = ev => {
  if (ev.target.localName === "input" || ev.target.localName === "textarea") return;

  if (ev.key === "ArrowLeft") {
    if (lazyLoader.stateIndex === 0) return;
    const state = lazyLoader.states[--lazyLoader.stateIndex];
    updatePage(state);
  }
  else if (ev.key === "ArrowRight") {
    const state = lazyLoader.loadRight();
    if (state) {
      updatePage(state);
    }
  }
  else if (ev.key === "ArrowUp") {
    lazyLoader.stateIndex = 0;
    updatePage(lazyLoader.states[lazyLoader.stateIndex]);
  }
  else if (ev.key === "ArrowDown") {
    while (lazyLoader.loadRight()) { }
    updatePage(lazyLoader.states[lazyLoader.states.length - 1]);
  }
};

updateButton.onclick = () => {
  description = descriptionEl.value;
  input = inputDataEl.value.split(",").map(s => +s);
  program = programInputEl.value;
  console.log(program);
  lazyLoader.ticks = 0;
  
  localStorage.setItem("description", description);
  localStorage.setItem("program", program);
  localStorage.setItem("input", JSON.stringify(input));

  program = program.trim() + "\n\n";

  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input);
  updatePage(lazyLoader.states[0]);
  //@ts-ignore
  updateButton.focus();
};

resetButton.onclick = () => {
  description = "";
  input = defaultInput;
  program = defaultProgram;

  descriptionEl.value = "";
  inputDataEl.value = input.join(",");
  programInputEl.value = program;
  localStorage.clear();
  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input);
  updatePage(lazyLoader.states[0]);
};

importButton.onclick = () => {
  const fullProgramJson = prompt("Input program json");
  if (fullProgramJson) {
    /** @type { FullProgram } */
    const fullProgram = JSON.parse(fullProgramJson);

    description = fullProgram.description;
    input = fullProgram.input;
    program = fullProgram.program.trim() + "\n\n";

    localStorage.setItem("description", description);
    localStorage.setItem("program", program);
    localStorage.setItem("input", JSON.stringify(input));

    program = program.trim() + "\n\n";

    descriptionEl.value = description;
    inputDataEl.value = input.join(",");
    programInputEl.value = program;

    lazyLoader = new LazyLoader(program, memSize, outputCapacity, input);
    updatePage(lazyLoader.states[0]);
  }
};

exportButton.onclick = () => {
  const exportObj = { description, input, program };
  const exportJson = JSON.stringify(exportObj);

  const inputEl = document.createElement("input");
  inputEl.value = exportJson;
  inputEl.style.left = "-10000px";
  inputEl.style.position = "absolute";
  document.body.appendChild(inputEl);
  inputEl.select();
  document.execCommand("copy");
  document.body.removeChild(inputEl);
};

debugButton.onclick = () => {
  console.log(lazyLoader.states);
};

/** @param {{key: string, shiftKey: boolean}} ev */
programInputEl.onkeydown = ev => {
  if (!ev.shiftKey && ev.key === "Enter") {
    updateButton.onclick();
    return false;
  }
};

/** @param {State} state */
function updatePage(state) {
  updateMemoryEl(state);
  updateProgramEl(state);
  updateInputEl(state);
  updateOutputEl(state);

  const ticksEl = document.getElementById("ticksEl");
  if (!ticksEl) throw new Error();
  ticksEl.innerHTML = state.ticks.toString();
}

/** @param {State} state */
function updateMemoryEl(state) {
  const arrDisplay = state.memory.join(", ");
  const spaces = 1 + state.thePointer * 3;
  const thePtrDisplay = " ".repeat(spaces) + "^";
  const display = `[${arrDisplay}]\n${thePtrDisplay}`;

  const memoryEl = document.getElementById("memoryEl");
  if (!memoryEl) throw new Error();
  memoryEl.innerHTML = display;
}

/** @param {State} state */
function updateProgramEl(state) {
  let trimmedProgram = lazyLoader.program;
  // if (!lazyLoader.program.endsWith("\n")) {
  //   trimmedProgram = lazyLoader.program + "\n";
  // }
  let startOfLine = revIndexOf(trimmedProgram, "\n", state.programCounter) + 1;
  startOfLine = startOfLine >= 0 ? startOfLine : 0;
  let endOfLine = trimmedProgram.indexOf("\n", state.programCounter);
  endOfLine = endOfLine >= 0 ? endOfLine : trimmedProgram.length - 1;
  let lineOffset = state.programCounter - startOfLine;
  lineOffset = lineOffset >= 0 ? lineOffset : 0;
  console.log("programCounter", state.programCounter);
  console.log("startOfLine", startOfLine);
  console.log("lineOffset", lineOffset);
  console.log("endOfLine", endOfLine);

  const start = trimmedProgram.slice(0, endOfLine + 1);
  const debugLine = `${" ".repeat(lineOffset)}^\n`;
  const end = trimmedProgram.slice(endOfLine + 1);
  // console.log(start);
  // console.log("--------------");
  // console.log(debugLine);
  // console.log("--------------");
  // console.log(end);
  console.log("\n\n-------total-------");
  const display = startOfLine <= endOfLine ? `${start}${debugLine}${end}` : `${lazyLoader.program}^`;

  const programCodeEl = document.getElementById("programCodeEl");
  if (!programCodeEl) throw new Error();
  programCodeEl.innerHTML = display;
}

/**
 * @param {string} data
 * @param {string} searchString
 * @param {number} startIndex
 */
function revIndexOf(data, searchString, startIndex) {
  for (let i = startIndex; i >= 0; i--) {
    if (data[i] === searchString) {
      return i;
    }
  }
  return -1;
}

/** @param {State} state */
function updateInputEl(state) {
  const arrDisplay = state.input.join(", ");
  const display = `[${arrDisplay}]`;

  const inputEl = document.getElementById("inputEl");
  if (!inputEl) throw new Error();
  inputEl.innerHTML = display;
}

/** @param {State} state */
function updateOutputEl(state) {
  const arrDisplay = state.output.join(", ");
  const display = `[${arrDisplay}]`;

  const outputEl = document.getElementById("outputEl");
  if (!outputEl) throw new Error();
  outputEl.innerHTML = display;
}

/** @typedef {import("./brain_freak").State} State */
/** @typedef { { description: string, input: number[], program: string } } FullProgram */
