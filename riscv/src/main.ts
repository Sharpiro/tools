import { CLangCompiler } from "./cLangCompiler";

const cppSource = "int x = 2 + 3;"

const cCompiler = new CLangCompiler(cppSource)
cCompiler.compile()

// // expected: [0, 2, 3, 5, 0 ...]
// const source =
//     `addi x1, x0, 2
// addi x2, x0, 3
// add x3, x1, x2`
// const riscVCompiler = new RiscVCompiler(source)
// const commands = riscVCompiler.compile()
// const runner = new Runner(commands)
// runner.run()



// run(commands)
// console.log(commands)
// console.log(runner.registers.registers.slice(0, 5))

// function run(commands: CommandSyntax[]) {

// }

// function add() {
//     const targetRegister: number
//     const sourceRegister1: number
//     const sourceRegister2: number
//     registers[targetRegister] = registers[sourceRegister1] + registers[sourceRegister2]
// }
