// cspell:ignore wasm wabt

async function main() {
    const watFileName = "main.wat"
    const loadFileFunc = env == "browser" ? loadFileRemote : loadFileLocal
    const watText = await loadFileFunc(watFileName)
    const wasmBinary = build(watText, watFileName)
    run(wasmBinary)
}

function loadFileLocal(fileName: string): Promise<string> {
    var fs = require("fs");
    return new Promise((res, rej) => {
        fs.readFile(fileName, { encoding: "utf8" }, (err: any, data: string) => {
            if (err) {
                throw new Error(err)
            }
            res(data)
        })
    })
}

async function loadFileRemote(fileName: string): Promise<string> {
    const response = await fetch(fileName);
    const bytes = await response.text();
    return bytes
}

function build(inputWat: string, watFileName: string) {
    let wabt: any = env == "browser" ? WabtModule() : require("wabt")()
    const wasmModule = wabt.parseWat(watFileName, inputWat);
    const { buffer: wasmBinary } = wasmModule.toBinary({});
    return wasmBinary
}

async function run(wasmBinary: ArrayBuffer) {
    var importObject = { console: { log: consoleLogString }, js: { mem: memory } };
    const { instance } = await WebAssembly.instantiate(wasmBinary, importObject);
    let exports: Exports = instance.exports;
    let result = exports.callByIndex(0)
    console.log(result);
    result = exports.callByIndex(1)
    console.log(result);
    exports.writeHi()
}

function consoleLogString(offset: number, length: number) {
    var bytes = new Uint8Array(memory.buffer, offset, length);
    var data = getString(bytes)
    console.log(data);
}

function getString(buffer: Uint8Array): string {
    return env === "browser" ? new TextDecoder('utf8').decode(buffer) : Buffer.from(buffer).toString();
}

interface Exports {
    getAnswerPlus1: (x: number, y: number) => number
    getData: () => number
    temp: () => number
    writeHi(): void
    callByIndex(index: number): number
    helloWorld(): number
}

let WabtModule: any
const env = WabtModule ? "browser" : "node"
var memory = new WebAssembly.Memory({ initial: 1 });
main()
