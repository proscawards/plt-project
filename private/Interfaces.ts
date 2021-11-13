export interface Output{
    input: String,
    token: String
}

export interface IsOutputValid{
    output: Output[],
    isValid: boolean
}

export interface LexerToken{
    token: String, 
    value: String
}

export interface ParserToken{
    stack: String,
    input: String,
    action: String
}

export interface ParserResults{
    parserToken: ParserToken[],
    result: String,
    amount: any
}

export interface ActionToken{
    shift: String,
    reduce: String
}

export interface BNF{
    expression: String,
    value: String,
    action: String
}