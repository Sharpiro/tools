import { memory as sharedMem } from "brain_freak/brain_freak_bg";
import { ProgramIterator } from "brain_freak";

let program = ",>,<[->+<]";
const memSize = 10;
const outputCapacity = 10;
const iterator = ProgramIterator.new(
  program,
  10,
  outputCapacity,
  new Uint8Array([2, 2])
);
const memPointer = iterator.get_memory_ptr();
const memory = new Uint8Array(sharedMem.buffer, memPointer, memSize);
const outputPointer = iterator.get_output_ptr();

const memoryEl = document.getElementById("memoryEl");

/** @type {HTMLInputElement} */
const programInputEl = (document.getElementById("programInputEl"));
programInputEl.value = program;

const programCodeEl = document.getElementById("programCodeEl");
if (!programCodeEl) throw new Error();
programCodeEl.innerHTML = program;

/** @type {State[]} */
const states = [{
  command: "",
  memory: Array.from(memory),
  output: [],
  thePointer: 0,
  programCounter: 0
}
];
let stateIndex = 0;
let lazyLoading = true;

updateMemoryEl(states[0]);
updateProgramEl(states[0]);

/**
 * @param {any} ev
 */
window.onkeydown = ev => {
  if (ev.key === "ArrowLeft") {
    if (stateIndex === 0) return;
    const state = states[--stateIndex];
    updateMemoryEl(state);
    updateProgramEl(state);
    console.log("command:", state.command);
  }
  else if (ev.key === "ArrowRight") {
    const state = loadRight();
    if (state) {
      updateMemoryEl(state);
      updateProgramEl(state);
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

  const outputLen = iterator.get_output_len();
  const output = [...(new Uint8Array(sharedMem.buffer, outputPointer, outputLen))];
  const state = {
    command,
    memory: Array.from(memory),
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
  programCodeEl.innerHTML = program;
};

debugButton.onclick = () => {
  console.log(states);
};

/** @param {State} state */
function updateMemoryEl(state) {
  const memDisplay = state.memory.join(", ");
  const spaces = 1 + state.thePointer * 3;
  const thePtrDisplay = " ".repeat(spaces) + "^";
  const display = `[${memDisplay}]\n${thePtrDisplay}`;
  if (!memoryEl) throw new Error();
  memoryEl.innerHTML = display;
}

/** @param {State} state */
function updateProgramEl(state) {
  const programDisplay = Array.from(program).join(" ");
  const spaces = state.programCounter * 2;
  const prgCounterDisplay = " ".repeat(spaces) + "^";
  const display = `${programDisplay}\n${prgCounterDisplay}`;
  if (!programCodeEl) throw new Error();
  programCodeEl.innerHTML = display;
}

/**
 * @typedef {{
 * command: string;
 * memory: number[];
 * output: number[];
 * thePointer: number
 * programCounter: number
 * }} State
 */
