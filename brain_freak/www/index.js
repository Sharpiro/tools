import { set_panic_hook } from "brain_freak";
import { LazyLoader } from "./brain_freak";

set_panic_hook(); // additional console info on wasm panic

let extendedMode = !!JSON.parse(localStorage.getItem("extendedMode") || "false");
/** @type {HTMLInputElement} */
const modeCheckbox = (document.getElementById("modeCheckbox"));
modeCheckbox.checked = extendedMode;

const defaultProgram = ",[>+.<-]";
const defaultInput = [2, 1];
let description = localStorage.getItem("description") || "";
const programJson = localStorage.getItem("program");
let program = programJson ? programJson : defaultProgram;

/** @type {HTMLInputElement} */
const programInputEl = (document.getElementById("programInputEl"));
programInputEl.value = program;

const inputJson = localStorage.getItem("input");
/** @type {number[]} */
let input = inputJson ? JSON.parse(inputJson) : defaultInput;
const memSize = 10;
const outputCapacity = 10;

let lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);

updatePage(lazyLoader.currentState);

/** @type {HTMLInputElement} */
const descriptionEl = (document.getElementById("descriptionEl"));
descriptionEl.value = description ? description : "";
/** @type {HTMLInputElement} */
const inputDataEl = (document.getElementById("inputDataEl"));
inputDataEl.value = input.join(",");

modeCheckbox.onclick = () => {
  extendedMode = modeCheckbox.checked;
  localStorage.setItem("extendedMode", extendedMode.toString());
  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
  updatePage(lazyLoader.currentState);
  //@ts-ignore
  updateButton.focus();
};

/** @param {{key: string, target: any, preventDefault: Function}} ev */
window.onkeydown = ev => {
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
  description = descriptionEl.value;
  input = inputDataEl.value.split(",").map(s => +s);
  program = programInputEl.value;

  localStorage.setItem("description", description);
  localStorage.setItem("input", JSON.stringify(input));
  localStorage.setItem("program", program);

  lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
  updatePage(lazyLoader.states[0]);
  //@ts-ignore
  updateButton.focus();
};

resetButton.onclick = () => {
  extendedMode = false;
  description = "";
  input = defaultInput;
  program = defaultProgram;

  modeCheckbox.checked = false;
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
    localStorage.setItem("description", fullProgram.description);
    localStorage.setItem("input", JSON.stringify(fullProgram.input));
    localStorage.setItem("program", fullProgram.program);

    modeCheckbox.checked = fullProgram.extendedMode;
    descriptionEl.value = fullProgram.description;
    inputDataEl.value = fullProgram.input.join(",");
    programInputEl.value = fullProgram.program;

    extendedMode = fullProgram.extendedMode;
    description = fullProgram.description;
    input = fullProgram.input;
    program = fullProgram.program;

    lazyLoader = new LazyLoader(program, memSize, outputCapacity, input, extendedMode);
    updatePage(lazyLoader.states[0]);
  }
};

exportButton.onclick = () => {
  /** @type { FullProgram } */
  const exportObj = { extendedMode, description, input, program };
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
  const programCodeEl = document.getElementById("programCodeEl");
  if (!programCodeEl) throw new Error();
  programCodeEl.innerText = "";

  const programDisplay = lazyLoader.program.trim() + " ";
  let lineDiv = document.createElement("div");
  for (let i = 0; i < programDisplay.length; i++) {
    const char = programDisplay[i];
    if (char === "\n") {
      programCodeEl.appendChild(lineDiv);
      lineDiv = document.createElement("div");
      continue;
    }
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    const highlightColor = "cornflowerblue";
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
/** @typedef { {
 *  extendedMode: boolean
 *  description: string,
 *  input: number[],
 *  program: string
*  } } FullProgram */
