const repl = require('repl');
const cli = repl.start()
cli.context.foo = require("./node_functions")