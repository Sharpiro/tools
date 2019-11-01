// cspell:ignore wasm wabt anyfunc

async function main() {
    const loadFileFunc = env == "browser" ? loadFileRemote : loadFileLocal
    const sourceFileNames = ["main.wat", "shared.wat"]
    const wasmBinaries = []
    for (const fileName of sourceFileNames) {
        const watText = await loadFileFunc(fileName)
        const wasmBinary = build(watText, fileName)
        wasmBinaries.push(wasmBinary)
    }

    run(wasmBinaries)
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

function build(inputWat: string, watFileName: string): Uint8Array {
    let wabt: any = env == "browser" ? WabtModule() : require("wabt")()
    const wasmModule = wabt.parseWat(watFileName, inputWat);
    const { buffer: wasmBinary } = wasmModule.toBinary({});
    return wasmBinary
}

async function run(wasmBinaries: ArrayBuffer[]) {
    var importObject = { console: { log: consoleLogString }, js: { memory: memory, table: table } };

    const promises: Promise<WebAssembly.WebAssemblyInstantiatedSource>[] = []
    for (const wasmBinary of wasmBinaries) {
        promises.push(WebAssembly.instantiate(wasmBinary, importObject))
    }

    const instanceSources = await Promise.all(promises)

    let mainExports: MainExports = instanceSources[0].instance.exports;
    let sharedExports: any = instanceSources[1].instance.exports;
    let result = mainExports.callByIndex(0)
    console.log(result);
    result = mainExports.callByIndex(1)
    console.log(result);
    mainExports.writeHi()
    result = sharedExports.doIt()
    console.log(result);
}

function consoleLogString(offset: number, length: number) {
    var bytes = new Uint8Array(memory.buffer, offset, length);
    var data = getString(bytes)
    console.log(data);
}

function getString(buffer: Uint8Array): string {
    return env === "browser" ? new TextDecoder('utf8').decode(buffer) : Buffer.from(buffer).toString();
}

interface MainExports {
    writeHi(): void
    callByIndex(index: number): number
}

interface SharedExports {
    doIt(): number
}

let WabtModule: any
const env = WabtModule ? "browser" : "node"
var memory = new WebAssembly.Memory({ initial: 1 });
var table = new WebAssembly.Table({ initial: 3, element: "anyfunc" })
main()
