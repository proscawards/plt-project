import { Lexer } from "./private/Lexer";
import { Parser } from "./private/Parser";
import { IsOutputValid, Output } from "./private/Interfaces";

class Main{

    private input: String;
    private lexer: any;
    private parser: any;
    private tokenLexer: IsOutputValid;

    constructor(input: String){
        this.input = input;
        this.lexer = new Lexer(input);
        this.tokenLexer = {output: Array(), isValid: false};
        console.log("Input: ");
        console.log(this.input);
    }

    runLexer(){
        console.log("\nLexical Analysis: ");
        this.tokenLexer = this.lexer.lexer();
        this.parser = new Parser(this.input, this.tokenLexer.output, this.tokenLexer.isValid);
        this.tokenLexer.output.map(tok => 
            console.log("["+tok.input + ", " + tok.token+"]")
        );
        if (!this.tokenLexer.isValid){console.log("Compiler has stopped reading...")}
    }

    runParser(){
        console.log("\nSyntax Analysis: ");
        console.log("stack\t\tinput\t\taction");
        this.parser.main();
        console.log("\n");
    }
    
}

let input = "hoot hoot woo ";
let main = new Main(input);
main.runLexer();
main.runParser();
