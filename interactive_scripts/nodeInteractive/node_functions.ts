import * as crypto from "crypto"
import { Buffer } from "buffer"

declare var global
declare var buffer

global.sha256 = (buffer: Buffer): Buffer => {
    return crypto.createHash("sha256").update(buffer).digest()
}

// global.sha384 = (buffer: Buffer): Buffer => {
//     return crypto.createHash("sha384").update(buffer).digest()
// }

global.buffer = (input: any): Buffer => {
    if (!input) return new Buffer(0)
    return Buffer.from(input)
}

global.bufferx = (input: any): Buffer => {
    if (!input) return new Buffer(0)
    return Buffer.from(input)
}

buffer = global.buffer