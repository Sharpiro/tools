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
  new Uint8Array([3, 4])
);
const memPointer = iterator.get_memory_ptr();
const memory = new Uint8Array(sharedMem.buffer, memPointer, memSize);
const outputPointer = iterator.get_output_ptr();
const memoryEl = document.getElementById("memoryEl");
if (!memoryEl) throw new Error();
memoryEl.innerHTML = toDebugString(memory);

// for (let i = 0, v; v = iterator.next(); i++) {
//   console.log(`\ncommand ${i + 1}: ${v}`);
//   console.log(memory);
//   memoryEl.innerHTML = toDebugString(memory);
//   // const outputLen = iterator.get_output_len();
//   // const output = new Uint8Array(sharedMem.buffer, outputPointer, outputLen);
//   // console.log(output);
// }

/**
 * @typedef {{ command: string; memory: number[]; output: number[] }} State
 */

/** @type {State[]} */
const states = [{
  command: "",
  memory: Array.from(memory),
  output: []
}
];
let stateIndex = 0;
let lazyLoading = true;
/**
 * @param {any} ev
 */
window.onkeydown = ev => {
  if (ev.key === "ArrowLeft") {
    if (stateIndex > 0) stateIndex--;
    const state = states[stateIndex];
    memoryEl.innerHTML = toDebugString(state.memory);
  } else if (ev.key === "ArrowRight") {
    const state = lazyLoadRight();
    memoryEl.innerHTML = toDebugString(state.memory);
  }
  console.log("stateIndex:", stateIndex);
};

function lazyLoadRight() {
  if (lazyLoading && stateIndex === states.length - 1) {
    const command = iterator.next();
    if (!command) {
      lazyLoading = false;
      return states[stateIndex];
    }

    const outputLen = iterator.get_output_len();
    const output = Array.from(new Uint8Array(sharedMem.buffer, outputPointer, outputLen));
    const state = {
      command,
      memory: Array.from(memory),
      output
    };
    states.push(state);
    stateIndex++;
    console.log("lazy loaded right");
    return state;
  } else {
    console.log("pre-loaded right");
    if (stateIndex < states.length - 1) {
      ++stateIndex;
    }
    return states[stateIndex];
    // nav based upon stored state
  }
}

debugButton.onclick = () => {
  console.log(states);
};

/**
 * @param {number[] | Uint8Array} arr
 */
function toDebugString(arr) {
  const join = arr.join(", ");
  return `[${join}]`;
}
