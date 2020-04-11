import { memory as sharedMem } from "brain_freak/brain_freak_bg";
import { ProgramIterator } from "brain_freak";

const program = ",>,<[->+<]";
// const program = "[...]";
const memSize = 10;
const outputCapacity = 10;
const iterator = ProgramIterator.new(
  program,
  10,
  outputCapacity,
  new Uint8Array([1, 2])
);
// iterator.the_pointer = 10000000000
const memPointer = iterator.get_memory_ptr();
const memory = new Uint8Array(sharedMem.buffer, memPointer, memSize);
const outputPointer = iterator.get_output_ptr();
const memoryEl = document.getElementById("memoryEl");
if (!memoryEl) throw new Error();

/** @type {State[]} */
const states = [{
  command: "",
  memory: Array.from(memory),
  output: [],
  thePointer: 0
}
];
let stateIndex = 0;
let lazyLoading = true;

memoryEl.innerHTML = toDebugString(states[0]);

// for (let i = 0, v; v = iterator.next(); i++) {
//   console.log(`\ncommand ${i + 1}: ${v}`);
//   console.log(memory);
//   memoryEl.innerHTML = toDebugString(memory);
//   // const outputLen = iterator.get_output_len();
//   // const output = new Uint8Array(sharedMem.buffer, outputPointer, outputLen);
//   // console.log(output);
// }

/**
 * @param {any} ev
 */
window.onkeydown = ev => {
  if (ev.key === "ArrowLeft") {
    if (stateIndex === 0) return;
    const state = states[--stateIndex];
    memoryEl.innerHTML = toDebugString(state);
    console.log("command:", state.command);
  }
  else if (ev.key === "ArrowRight") {
    loadRight();
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
      console.log(1, "lazy fail", "same state");
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
  if (!memoryEl) throw new Error();
  if (state) {
    memoryEl.innerHTML = toDebugString(state);
  }
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
    thePointer: iterator.the_pointer
  };
  states.push(state);
  return state;
}

debugButton.onclick = () => {
  console.log(states);
};

/** @param {State} state */
function toDebugString(state) {
  const memDisplay = state.memory.join(", ");
  const spaces = 1 + state.thePointer * 3;
  const thePtrDisplay = " ".repeat(spaces) + "^";
  const display = `[${memDisplay}]\n${thePtrDisplay}`;
  return display;
}

/**
 * @typedef {{
 * command: string;
 * memory: number[];
 * output: number[];
 * thePointer: number
 * }} State
 */
