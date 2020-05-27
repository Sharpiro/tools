import { set_panic_hook } from "brain_freak";
import { LazyLoader } from "./brain_freak";
import { selectElement, selectInput } from "./functions";

set_panic_hook(); // additional console info on wasm panic

let extendedMode = !!JSON.parse(localStorage.getItem("extendedMode") || "false");
const modeCheckbox = selectInput("#modeCheckbox");
modeCheckbox.checked = extendedMode;

const highlightColor = "cornflowerblue";
const defaultProgram = "?,[!>+.<-]#+#";
const defaultInput = [2, 1];
let description = localStorage.getItem("description") || "";
const programJson = localStorage.getItem("program");
let program = programJson ? programJson : defaultProgram;

const programInputEl = selectInput("#programInputEl");
programInputEl.value = program;

const inputJson = localStorage.getItem("input");
let input = inputJson ? /** @type {number[]} */ (JSON.parse(inputJson)) : defaultInput;

let memSize = +(localStorage.getItem("memSize") || "10");
let outputCapacity = +(localStorage.getItem("outputCapacity") || "10");

const memorySizeInput = selectInput("#memorySizeInput");
memorySizeInput.value = memSize.toString();

const outputCapacityInput = selectInput("#outputCapacityInput");
outputCapacityInput.value = outputCapacity.toString();

let lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);

updatePage(lazyLoader.currentState);

const descriptionEl = selectInput("#descriptionEl");
descriptionEl.value = description ? description : "";
const inputDataEl = selectInput("#inputDataEl");
inputDataEl.value = input.join(",");

modeCheckbox.onclick = () => {
  extendedMode = modeCheckbox.checked;
  localStorage.setItem("extendedMode", extendedMode.toString());
  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
  updatePage(lazyLoader.currentState);
};

/** @param {{key: string, target: any, preventDefault: Function}} ev */
window.onkeydown = ev => {
  if (ev.key == "Escape") {
    selectElement("#focusSpan").focus();
    return;
  }
  if (ev.target.localName === "input" || ev.target.localName === "textarea") return;

  if (ev.key === "ArrowLeft") {
    ev.preventDefault();
    if (lazyLoader.stateIndex === 0) return;
    const state = lazyLoader.states[--lazyLoader.stateIndex];
    updatePage(state);
  }
  else if (ev.key === "ArrowRight") {
    ev.preventDefault();
    const state = lazyLoader.loadRight();
    if (state) {
      updatePage(state);
    }
  }
  else if (ev.key === "ArrowUp") {
    ev.preventDefault();
    while (lazyLoader.stateIndex > 0) {
      if (lazyLoader.currentState.command === "!") {
        lazyLoader.stateIndex--;
        break;
      }
      lazyLoader.stateIndex--;
    }
    updatePage(lazyLoader.currentState);
  }
  else if (ev.key === "ArrowDown") {
    ev.preventDefault();
    lazyLoader.loadRight();
    for (let state; state = lazyLoader.loadRight();) {
      if (state.command === "!") {
        lazyLoader.stateIndex--;
        break;
      }
    }
    updatePage(lazyLoader.currentState);
  }
};

updateButton.onclick = () => {
  memSize = +memorySizeInput.value;
  outputCapacity = +outputCapacityInput.value;
  description = descriptionEl.value;
  input = inputDataEl.value.split(",").map(s => +s);
  program = programInputEl.value;

  localStorage.setItem("memSize", memorySizeInput.value);
  localStorage.setItem("outputCapacity", outputCapacityInput.value);
  localStorage.setItem("description", description);
  localStorage.setItem("input", JSON.stringify(input));
  localStorage.setItem("program", program);

  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
  updatePage(lazyLoader.states[0]);
  selectElement("#focusSpan").focus();
};

resetButton.onclick = () => {
  extendedMode = false;
  memSize = 10;
  outputCapacity = 10;
  description = "";
  input = defaultInput;
  program = defaultProgram;

  modeCheckbox.checked = false;
  memorySizeInput.value = "10";
  outputCapacityInput.value = "10";
  descriptionEl.value = "";
  inputDataEl.value = input.join(",");
  programInputEl.value = program;

  localStorage.clear();

  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
  updatePage(lazyLoader.states[0]);
};

importButton.onclick = () => {
  const fullProgramJson = prompt("Input program json");
  if (fullProgramJson) {
    /** @type { FullProgram } */
    const fullProgram = JSON.parse(fullProgramJson);

    localStorage.setItem("extendedMode", fullProgram.extendedMode.toString());
    localStorage.setItem("memSize", fullProgram.memSize.toString());
    localStorage.setItem("outputCapacity", fullProgram.outputCapacity.toString());
    localStorage.setItem("description", fullProgram.description);
    localStorage.setItem("input", JSON.stringify(fullProgram.input));
    localStorage.setItem("program", fullProgram.program);

    modeCheckbox.checked = fullProgram.extendedMode;
    memorySizeInput.value = fullProgram.memSize.toString();
    outputCapacityInput.value = fullProgram.outputCapacity.toString();
    descriptionEl.value = fullProgram.description;
    inputDataEl.value = fullProgram.input.join(",");
    programInputEl.value = fullProgram.program;

    extendedMode = fullProgram.extendedMode;
    memSize = fullProgram.memSize;
    outputCapacity = fullProgram.outputCapacity;
    description = fullProgram.description;
    input = fullProgram.input;
    program = fullProgram.program;

    lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
    updatePage(lazyLoader.states[0]);
  }
};

exportButton.onclick = () => {
  /** @type { FullProgram } */
  const exportObj = { extendedMode, description, input, program, memSize, outputCapacity };
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

dumpButton.onclick = () => {
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

  const ticksEl = selectElement("#ticksEl");
  if (!ticksEl) throw new Error();
  ticksEl.innerHTML = state.ticks.toString();
}

/** @param {State} state */
function updateMemoryEl(state) {
  let lineDiv = document.createElement("div");
  for (let i = 0; i < state.memory.length; i++) {
    const charSpan = document.createElement("span");
    charSpan.innerText = `${state.memory[i].toString()}`;
    if (i === state.thePointer) {
      charSpan.style.backgroundColor = highlightColor;
    }
    lineDiv.appendChild(charSpan);
    lineDiv.append(" ");
  }

  const memoryEl = selectElement("#memoryEl");
  memoryEl.innerText = "";
  memoryEl.appendChild(lineDiv);
}

/** @param {State} state */
function updateProgramEl(state) {
  const programCodeEl = selectElement("#programCodeEl");
  if (!programCodeEl) throw new Error();
  programCodeEl.innerText = "";

  const programDisplay = lazyLoader.program.trim() + " ";
  let lineDiv = document.createElement("div");
  for (let i = 0; i < programDisplay.length; i++) {
    const char = programDisplay[i];
    if (char === "\n") {
      if (!lineDiv.innerText.length){
        lineDiv.append(" ");
      }
      programCodeEl.appendChild(lineDiv);
      lineDiv = document.createElement("div");
      continue;
    }
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    if (i === state.programCounter) {
      charSpan.style.backgroundColor = highlightColor;
    }
    else if (state.programCounter >= programDisplay.length && i === programDisplay.length - 1) {
      charSpan.style.backgroundColor = highlightColor;
    }
    lineDiv.appendChild(charSpan);
  }
  programCodeEl.appendChild(lineDiv);
}

/** @param {State} state */
function updateInputEl(state) {
  const arrDisplay = state.input.join(", ");
  const display = `[${arrDisplay}]`;

  const inputEl = selectElement("#inputEl");
  if (!inputEl) throw new Error();
  inputEl.innerHTML = display;
}

/** @param {State} state */
function updateOutputEl(state) {
  const arrDisplay = state.output.join(", ");
  const display = `[${arrDisplay}]`;

  const outputEl = selectElement("#outputEl");
  if (!outputEl) throw new Error();
  outputEl.innerHTML = display;
}

/** @typedef {import("./brain_freak").State} State */
/** @typedef { {
 *  extendedMode: boolean
 *  memSize: number
 *  outputCapacity: number
 *  description: string,
 *  input: number[],
 *  program: string
*  } } FullProgram */
