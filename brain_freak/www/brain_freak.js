import { memory as sharedMem } from "brain_freak/brain_freak_bg";
import { ProgramIterator } from "brain_freak";

export class LazyLoader {
  get currentState() {
    return this.states[this.stateIndex];
  }

  /**
   * @param {string} program
   * @param {number} memSize
   * @param {number} outputCapacity
   * @param {number[]} input
   */
  constructor(program, memSize, outputCapacity, input) {
    const cleansedProgram = getCleansedProgram(program);
    const inputBuffer = new Uint8Array(input);

    this.program = program;
    this.cleansedProgram = cleansedProgram;
    this.memSize = memSize;
    this.outputCapacity = outputCapacity;
    this.input = input;
    this.iterator = ProgramIterator.new(cleansedProgram, memSize, outputCapacity, inputBuffer);
    this.stateIndex = 0;
    this.lazyLoading = true;
    this.outputPointer = this.iterator.get_output_ptr();
    this.memory = new Uint8Array(sharedMem.buffer, this.iterator.get_memory_ptr(), memSize);
    this.ticks = -1;
    this.states = /** @type {State[]} */ ([{
      command: "",
      memory: Array.from(this.memory),
      input: this.input,
      output: [],
      thePointer: 0,
      programCounter: 0,
      ticks: 0
    }]);
  }

  /** @returns {State | undefined} */
  loadRight() {
    let state;
    // lazy load right
    if (this.lazyLoading && this.stateIndex === this.states.length - 1) {
      try {
        const command = this.iterator.next();
        if (command) {
          state = this.addState(command);
          this.stateIndex++;
          // console.log(1, "lazy", state.command);
        } else {
          this.lazyLoading = false;
          // console.log(1, "lazy done", "kept same state");
        }
      } catch (err) {
        alert("An error occurred, see console for details");
        return;
      }
    }
    else if (this.lazyLoading && this.stateIndex < this.states.length - 1) {
      ++this.stateIndex;
      state = this.states[this.stateIndex];
      // console.log(2, "pre", state.command);
    }
    else if (this.stateIndex < this.states.length - 1) {
      ++this.stateIndex;
      state = this.states[this.stateIndex];
      // console.log(3, "pre", state.command);
    }
    else if (!this.lazyLoading && this.stateIndex === this.states.length - 1) {
      // console.log(4, "done");
    }
    else {
      throw new Error("unexpected path");
    }
    return state;
  }

  /** @param {string} command */
  addState(command) {
    const inputPointer = this.iterator.get_input_ptr();
    const inputLen = this.iterator.get_input_len();
    const input = [...(new Uint8Array(sharedMem.buffer, inputPointer, inputLen))];

    const outputLen = this.iterator.get_output_len();
    const output = [...(new Uint8Array(sharedMem.buffer, this.outputPointer, outputLen))];

    const state = {
      command: command,
      memory: Array.from(this.memory),
      input: input,
      output: output,
      thePointer: this.iterator.the_pointer,
      programCounter: this.iterator.program_counter,
      ticks: ++this.ticks
    };
    this.states.push(state);
    return state;
  }
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
