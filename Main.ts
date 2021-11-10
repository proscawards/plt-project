import { Lexer } from "./Lexer";

class Main{

    private input: String;
    private lexer: any;
    private tokenLexer: {str: String, token: String}[];

    constructor(input: String){
        this.input = input;
        this.lexer = new Lexer(input);
        this.tokenLexer = Array();
    }

    runLexer(){
        console.log("Lexical Analysis: ");
        this.tokenLexer = this.lexer.lexer();
        this.tokenLexer.map(tok => 
            console.log("["+tok.str + ", " + tok.token+"]")
        );
    }
    
}

let input = "hootjaja hoot woo hu hu hoot yeet";
let main = new Main(input);
main.runLexer();
