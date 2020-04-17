import { memory as sharedMem } from "brain_freak/brain_freak_bg";
import { ProgramIterator } from "brain_freak";

// let program = ",.>,.<[->+<]>.";
// let program = ",.,.,.,.,.,.,.";
let program = ",.,.,.,.,.,.,.";
let input = [1, 2, 3, 4, 5, 6, 7];
const programJson = localStorage.getItem("program");
if (programJson) {
  program = programJson;
}
const inputJson = localStorage.getItem("input");
if (inputJson) {
  input = JSON.parse(inputJson);
}
const memSize = 10;
const outputCapacity = 10;
let iterator = ProgramIterator.new(
  program,
  10,
  outputCapacity,
  new Uint8Array(input)
);
let memPointer = iterator.get_memory_ptr();
let memory = new Uint8Array(sharedMem.buffer, memPointer, memSize);
let inputPointer = iterator.get_input_ptr();
let outputPointer = iterator.get_output_ptr();

const memoryEl = document.getElementById("memoryEl");

/** @type {HTMLInputElement} */
const inputDataEl = (document.getElementById("inputDataEl"));
inputDataEl.value = input.join("");

/** @type {HTMLInputElement} */
const programInputEl = (document.getElementById("programInputEl"));
programInputEl.value = program;

const programCodeEl = document.getElementById("programCodeEl");
if (!programCodeEl) throw new Error();
programCodeEl.innerHTML = program;

const outputEl = document.getElementById("outputEl");
if (!outputEl) throw new Error();

const inputEl = document.getElementById("inputEl");
if (!inputEl) throw new Error();

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
/** @type {State[]} */
let states = [initialState];
let stateIndex = 0;
let lazyLoading = true;

updateMemoryEl(initialState);
updateProgramEl(initialState);
updateInputEl(initialState);
updateOutputEl(initialState);

/**
 * @param {any} ev
 */
window.onkeydown = ev => {
  if (ev.key === "ArrowLeft") {
    if (stateIndex === 0) return;
    const state = states[--stateIndex];
    updateMemoryEl(state);
    updateProgramEl(state);
    updateInputEl(state);
    updateOutputEl(state);
    console.log("command:", state.command);
  }
  else if (ev.key === "ArrowRight") {
    const state = loadRight();
    if (state) {
      updateMemoryEl(state);
      updateProgramEl(state);
      updateInputEl(state);
      updateOutputEl(state);
    }
  }
};

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

  inputPointer = iterator.get_input_ptr();
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

updateButton.onclick = () => {
  console.log("updated");
  program = programInputEl.value;
  if (!programCodeEl) throw new Error();
  programCodeEl.innerHTML = program;
  input = inputDataEl.value.split("").map(s => +s);
  localStorage.setItem("program", program);
  localStorage.setItem("input", JSON.stringify(input));

  iterator = ProgramIterator.new(
    program,
    10,
    outputCapacity,
    new Uint8Array(input)
  );
  memPointer = iterator.get_memory_ptr();
  memory = new Uint8Array(sharedMem.buffer, memPointer, memSize);
  inputPointer = iterator.get_input_ptr();
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
  updateMemoryEl(initialState);
  updateProgramEl(initialState);
  updateInputEl(initialState);
  updateOutputEl(initialState);

  //@ts-ignore
  updateButton.focus();
};

debugButton.onclick = () => {
  console.log(states);
};

/** @param {State} state */
function updateMemoryEl(state) {
  const arrDisplay = state.memory.join(", ");
  const spaces = 1 + state.thePointer * 3;
  const thePtrDisplay = " ".repeat(spaces) + "^";
  const display = `[${arrDisplay}]\n${thePtrDisplay}`;
  if (!memoryEl) throw new Error();
  memoryEl.innerHTML = display;
}

/** @param {State} state */
function updateProgramEl(state) {
  const arrDisplay = Array.from(program).join(" ");
  const spaces = state.programCounter * 2;
  const prgCounterDisplay = " ".repeat(spaces) + "^";
  const display = `${arrDisplay}\n${prgCounterDisplay}`;
  if (!programCodeEl) throw new Error();
  programCodeEl.innerHTML = display;
}

/** @param {State} state */
function updateInputEl(state) {
  const arrDisplay = state.input.join(", ");
  const display = `[${arrDisplay}]`;
  if (!inputEl) throw new Error();
  inputEl.innerHTML = display;
}

/** @param {State} state */
function updateOutputEl(state) {
  const arrDisplay = state.output.join(", ");
  const display = `[${arrDisplay}]`;
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
