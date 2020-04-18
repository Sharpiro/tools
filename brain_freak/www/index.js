import { memory as sharedMem } from "brain_freak/brain_freak_bg";
import { ProgramIterator } from "brain_freak";

// const defaultProgram = ",.>,.<[->+<]>.";
// const defaultProgram = ",.,.,.,.,.,.,.";
const defaultProgram = ",.,.,.,.,.,.,.";
const defaultInput = [1, 2, 3, 4, 5, 6, 7];
const programJson = localStorage.getItem("program");
let program = programJson ? programJson : defaultProgram;
const inputJson = localStorage.getItem("input");
/** @type {number[]} */
let input = inputJson ? JSON.parse(inputJson) : defaultInput;
const memSize = 10;
const outputCapacity = 10;

let states = /** @type {State[]} */ ([]);
let stateIndex = 0;
let lazyLoading = true;
let outputPointer = 0;
/** @type {Uint8Array} */ let memory;
/** @type {ProgramIterator} */ let iterator;
initialize();
updatePage(states[0]);

/** @type {HTMLInputElement} */
const inputDataEl = (document.getElementById("inputDataEl"));
inputDataEl.value = input.join("");

/** @type {HTMLInputElement} */
const programInputEl = (document.getElementById("programInputEl"));
programInputEl.value = program;

function initialize() {
  iterator = ProgramIterator.new(
    program,
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
    programCounter: 0
  };
  states = [initialState];
  lazyLoading = true;
  stateIndex = 0;
}

function loadRight() {
  let state;
  if (lazyLoading && stateIndex === states.length - 1) {
    state = lazyLoadRight();
    if (state) {
      stateIndex++;
      console.log(1, "lazy", state.command);
    } else {
      lazyLoading = false;
      console.log(1, "lazy done", "kept same state");
    }
  }
  else if (lazyLoading && stateIndex < states.length - 1) {
    ++stateIndex;
    state = states[stateIndex];
    console.log(2, "pre", state.command);
  }
  else if (stateIndex < states.length - 1) {
    ++stateIndex;
    state = states[stateIndex];
    console.log(3, "pre", state.command);
  }
  else if (!lazyLoading && stateIndex === states.length - 1) {
    console.log(4, "done");
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
    programCounter: iterator.program_counter
  };
  states.push(state);
  return state;
}

/** @param {{key:string}} ev */
window.onkeydown = ev => {
  if (ev.key === "ArrowLeft") {
    if (stateIndex === 0) return;
    const state = states[--stateIndex];
    updatePage(state);
    console.log("command:", state.command);
  }
  else if (ev.key === "ArrowRight") {
    const state = loadRight();
    if (state) {
      updatePage(state);
    }
  }
};

updateButton.onclick = () => {
  program = programInputEl.value;
  input = inputDataEl.value.split("").map(s => +s);
  localStorage.setItem("program", program);
  localStorage.setItem("input", JSON.stringify(input));

  initialize();
  updatePage(states[0]);
  //@ts-ignore
  updateButton.focus();
};

resetButton.onclick = () => {
  input = defaultInput;
  programInputEl.value = program = defaultProgram;
  inputDataEl.value = input.join("");
  localStorage.clear();
  initialize();
  updatePage(states[0]);
};

debugButton.onclick = () => {
  console.log(states);
};

/** @param {State} state */
function updatePage(state) {
  updateMemoryEl(state);
  updateProgramEl(state);
  updateInputEl(state);
  updateOutputEl(state);
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
  const arrDisplay = Array.from(program).join(" ");
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


/**
 * @typedef {{
 * command: string;
 * memory: number[];
 * input: number[];
 * output: number[];
 * thePointer: number
 * programCounter: number
 * }} State
 */
