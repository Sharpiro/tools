// ((*) (2) ((+) (3) (4)))
// (x y z)
// (x . (y . (z . NIL)))
// (+ 3 4)
// (+ . (3 . (4 . NIL)))
// (* 2 (+ 3 4))

// (3 + 4) * 2
// const expression = "(* . (2 . ((+ . (3 . (4 . NIL))) . NIL)))"
// const expression = "(m (y 1))"
// const expression = "(1 . (2 . (3 . NIL)))"
// const expression = "(1 . (2 . ((3 . (4 . NIL)) . NIL)))"
const shortExpression = "(1 2 (3 4))"
// const shortExpression = "(1 2 3 4)"
// const expression = "(m . ((y . 1) . NIL))"
// const expression = "((1 . 2) . (3 . 4))"
// const expression = "(((1 . 2) . (3 . 4)) . ((5 . 6) . (7 . 8)))"
// const expression = "(* . (2 . ((+ . (3 . (4 . NIL))))))" // new engine
// const expression = "((2 . NIL) . (2 . NIL))"
// const expression = "(1 . (2 . NIL))"
// const expression = "(1 . NIL)"
// const expression = "(NIL . NIL)"
// const expression = "(1 . 2)"

class TreeNode {
    left?: any
    right?: any
}

let index = 0
let tokens = lexicalAnalysis(shortExpression)
console.log(shortExpression)
const expression = expandList()
console.log(expression)
index = 0
tokens = lexicalAnalysis(expression)
const root = parseExpression();
console.log(root)
if (index < tokens.length) throw new Error("leftover tokens")

function expandList(): string {
    let currentToken = eatToken("(")
    let expanded = currentToken
    let count = 0
    while ((currentToken = peekToken()) != ")") {
        if (currentToken == "(") {
            const subList = expandList()
            let data = `${subList} . `
            let tempPeek = peekToken(1)
            if (tempPeek !== ")") {
                data += "("
            }
            expanded += data
        }
        else {
            let data = `${currentToken} . `
            if (peekToken(1) !== ")") {
                data += "("
            }
            expanded += data
            eatToken()
        }
        count++
    }

    expanded += "NIL"
    for (let i = 0; i < count; i++) {
        expanded += ")"
    }
    return expanded
}

function lexicalAnalysis(expression: string) {
    const tokens = []
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === " ") continue
        if (expression[i] === "N") {
            tokens.push("NIL")
            i += 2
            continue
        }
        tokens.push(expression[i])
    }
    return tokens
}

function parseAtomOrExpression(): TreeNode | string {
    const nextToken = peekToken()
    if (nextToken !== "(") {
        return eatToken()
    }
    return parseExpression()
}

function parseExpression(): TreeNode {
    const node = new TreeNode()
    eatToken("(")
    node.left = parseAtomOrExpression()
    eatToken(".")
    node.right = parseAtomOrExpression()
    eatToken(")")
    return node
}

function eatToken(expectedToken?: string, eatAmount = 1): string {
    if (index >= tokens.length) {
        throw Error("Ran out of tokens to eat")
    }
    let actualToken = tokens[index]
    index += eatAmount
    if (expectedToken === undefined) {
        return actualToken
    }
    if (expectedToken !== actualToken) {
        throw Error(`Expected token ${expectedToken}, but instead got ${actualToken}`)
    }
    return actualToken
}

function peekToken(peekJump = 0): string {
    if (index + peekJump >= tokens.length) {
        throw Error("Ran out of tokens to peek")
    }

    const peek = tokens[index + peekJump]
    return peek
}
