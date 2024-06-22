import { memory as sharedMem } from "brain_freak/brain_freak_bg";
import { ProgramIterator, set_panic_hook } from "brain_freak";

set_panic_hook(); // additional console info on wasm panic
const defaultProgram = ",[>+.<-]";
const defaultInput = [2, 1];
let description = localStorage.getItem("description");
const programJson = localStorage.getItem("program");
let program = programJson ? programJson : defaultProgram;
let cleansedProgram = getCleansedProgram(program);
const inputJson = localStorage.getItem("input");
/** @type {number[]} */
let input = inputJson ? JSON.parse(inputJson) : defaultInput;
const memSize = 10;
const outputCapacity = 10;

let states = /** @type {State[]} */ ([]);
let stateIndex = 0;
let ticks = 0;
let lazyLoading = true;
let outputPointer = 0;
/** @type {Uint8Array} */ let memory;
/** @type {ProgramIterator} */ let iterator;
initialize();
updatePage(states[0]);

/** @type {HTMLInputElement} */
const descriptionEl = (document.getElementById("descriptionEl"));
descriptionEl.value = description ? description : "";
/** @type {HTMLInputElement} */
const inputDataEl = (document.getElementById("inputDataEl"));
inputDataEl.value = input.join(",");
/** @type {HTMLInputElement} */
const programInputEl = (document.getElementById("programInputEl"));
programInputEl.value = program;

function initialize() {
  iterator = ProgramIterator.new(
    cleansedProgram,
    memSize,
    outputCapacity,
    new Uint8Array(input)
  );
  let memPointer = iterator.get_memory_ptr();
  memory = new Uint8Array(sharedMem.buffer, memPointer, memSize);
  let inputPointer = iterator.get_input_ptr();
  outputPointer = iterator.get_output_ptr();

  const inputLen = iterator.get_input_len();
  const initialInput = [...(new Uint8Array(sharedMem.buffer, inputPointer, inputLen))];
  const initialState = {
    command: "",
    memory: Array.from(memory),
    input: initialInput,
    output: [],
    thePointer: 0,
    programCounter: 0,
    ticks: 0
  };
  states = [initialState];
  lazyLoading = true;
  stateIndex = 0;
}

function loadRight() {
  let state;
  if (lazyLoading && stateIndex === states.length - 1) {
    try {
      state = lazyLoadRight();
    } catch (err) {
      alert("An error occurred, see console for details");
      return;
    }
    if (state) {
      stateIndex++;
      // console.log(1, "lazy", state.command);
    } else {
      lazyLoading = false;
      // console.log(1, "lazy done", "kept same state");
    }
  }
  else if (lazyLoading && stateIndex < states.length - 1) {
    ++stateIndex;
    state = states[stateIndex];
    // console.log(2, "pre", state.command);
  }
  else if (stateIndex < states.length - 1) {
    ++stateIndex;
    state = states[stateIndex];
    // console.log(3, "pre", state.command);
  }
  else if (!lazyLoading && stateIndex === states.length - 1) {
    // console.log(4, "done");
  }
  else {
    throw new Error("unexpected path");
  }
  return state;
}

/** @returns {State | undefined} */
function lazyLoadRight() {
  const command = iterator.next();
  if (!command) return undefined;

  const inputPointer = iterator.get_input_ptr();
  const inputLen = iterator.get_input_len();
  const outputLen = iterator.get_output_len();
  const input = [...(new Uint8Array(sharedMem.buffer, inputPointer, inputLen))];
  const output = [...(new Uint8Array(sharedMem.buffer, outputPointer, outputLen))];
  /** @type {State} */
  const state = {
    command,
    memory: Array.from(memory),
    input,
    output,
    thePointer: iterator.the_pointer,
    programCounter: iterator.program_counter,
    ticks: ++ticks
  };
  states.push(state);
  return state;
}

/** @param {{key: string, target: any}} ev */
window.onkeydown = ev => {
  if (ev.target.localName === "input" || ev.target.localName === "textarea") return;

  if (ev.key === "ArrowLeft") {
    if (stateIndex === 0) return;
    const state = states[--stateIndex];
    updatePage(state);
    // console.log("command:", state.command);
  }
  else if (ev.key === "ArrowRight") {
    const state = loadRight();
    if (state) {
      updatePage(state);
    }
  }
  else if (ev.key === "ArrowUp") {
    stateIndex = 0;
    updatePage(states[stateIndex]);
  }
  else if (ev.key === "ArrowDown") {
    while (loadRight()) { }
    updatePage(states[states.length - 1]);
  }
};

updateButton.onclick = () => {
  description = descriptionEl.value;
  input = inputDataEl.value.split(",").map(s => +s);
  program = programInputEl.value;
  cleansedProgram = getCleansedProgram(program);
  ticks = 0;

  localStorage.setItem("description", description);
  localStorage.setItem("program", program);
  localStorage.setItem("input", JSON.stringify(input));

  initialize();
  updatePage(states[0]);
  //@ts-ignore
  updateButton.focus();
};

resetButton.onclick = () => {
  description = "";
  input = defaultInput;
  program = defaultProgram;
  cleansedProgram = getCleansedProgram(program);
  ticks = 0;

  descriptionEl.value = "";
  inputDataEl.value = input.join(",");
  programInputEl.value = program;
  localStorage.clear();
  initialize();
  updatePage(states[0]);
};

importButton.onclick = () => {
  const fullProgramJson = prompt("Input program json");
  if (fullProgramJson) {
    /** @type { FullProgram } */
    const fullProgram = JSON.parse(fullProgramJson);

    description = fullProgram.description;
    input = fullProgram.input;
    program = fullProgram.program;
    cleansedProgram = getCleansedProgram(program);
    ticks = 0;

    descriptionEl.value = description;
    inputDataEl.value = input.join(",");
    programInputEl.value = program;

    localStorage.setItem("description", description);
    localStorage.setItem("program", program);
    localStorage.setItem("input", JSON.stringify(input));

    initialize();
    updatePage(states[0]);
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

  // const blob = new Blob([exportJson], { type: "application/json" }); //type
  // const downloadEl = document.createElement("a");
  // const blobUrl = URL.createObjectURL(blob);
  // downloadEl.download = "export";
  // downloadEl.href = blobUrl;
  // downloadEl.click();
};

debugButton.onclick = () => {
  console.log(states);
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
  const arrDisplay = Array.from(cleansedProgram).join(" ");
  const spaces = state.programCounter * 2;
  const prgCounterDisplay = " ".repeat(spaces) + "^";
  const display = `${arrDisplay}\n${prgCounterDisplay}`;

  const programCodeEl = document.getElementById("programCodeEl");
  if (!programCodeEl) throw new Error();
  programCodeEl.innerHTML = display;
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

/** @param {string} program */
function getCleansedProgram(program) {
  const lines = program.split("\n").filter(l => !(!l[0] || l[0] === ";" || l[0] === ""));
  const modProgram = lines.join("");
  const cleansePattern = /[.,<>+\-[\]]+/g;
  const matches = modProgram.match(cleansePattern);
  const cleansedProgram = matches ? matches.join("") : "";
  return cleansedProgram;
}

/**
 * @typedef {{
 * command: string;
 * memory: number[];
 * input: number[];
 * output: number[];
 * thePointer: number
 * programCounter: number
 * ticks: number
 * }} State
 */

/** @typedef { { description: string, input: number[], program: string } } FullProgram */
