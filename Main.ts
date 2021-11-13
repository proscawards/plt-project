import { Lexer } from "./private/Lexer";
import { Parser } from "./private/Parser";
import { IsOutputValid, ParserResults } from "./private/Interfaces";
import { Table } from "console-table-printer";
const chalk = require("chalk");

class Main{

    private input: String;
    private lexer: any;
    private parser: any;
    private tokenLexer: IsOutputValid;
    private tokenParser: ParserResults;

    constructor(input: String){
        this.input = input;
        this.lexer = new Lexer(input);
        this.tokenLexer = {output: Array(), isValid: false};
        this.tokenParser = {parserToken: Array(), result: "", amount: 0};
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
        this.tokenParser = this.parser.main();
        const p = new Table({
            columns: [
              { name: 'stack', title: 'Stack', alignment: 'left'},
              { name: 'input', title: 'Input', alignment: 'left'}],
            computedColumns: [
              { name: 'actions', title: 'Action', alignment: 'left',               
                function: (row) => {
                    let val: String = row.action;
                    if (val == "SHIFT") {return chalk.red(val);}
                    return chalk.blue(val);
                }
                }
            ],
            disabledColumns: ["action"],
          });
        p.addRows(this.tokenParser.parserToken, {color: 'green'});
        p.printTable();
        console.log("Result: 🦉 is "+this.tokenParser.result+this.preprocessAmount()+"\n");
    }

    //Display the amount of owl's action
    preprocessAmount(){
        if (this.tokenParser.amount == 1){return "!"}
        else if (this.tokenParser.amount == 2){return " for twice!"}
        else if (this.tokenParser.amount == 3){return " for thrice!"}
        else if (this.tokenParser.amount > 3){return " for many times!"}
        
    }
    
}

let input = "hu hoot woo hoot hu hoot woo hoot hu hoot woo hoot hu hoot woo hoot";
let main = new Main(input);
main.runLexer();
main.runParser();
