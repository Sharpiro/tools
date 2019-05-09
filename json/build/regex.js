const fs = require("fs")

const data = fs.readFileSync("dist/index.html", "utf8")
const expression = /\n\/\*![\S\s]*?\*\/\n*/g
const newData = data.replace(expression, "")
fs.writeFileSync("dist/index.html", newData)
