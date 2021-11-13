import { Lexer } from "./private/Lexer";
import { Parser } from "./private/Parser";
import { IsOutputValid, ParserToken } from "./private/Interfaces";
import { Table } from "console-table-printer";
const chalk = require("chalk");

class Main{

    private input: String;
    private lexer: any;
    private parser: any;
    private tokenLexer: IsOutputValid;
    private tokenParser: ParserToken[];

    constructor(input: String){
        this.input = input;
        this.lexer = new Lexer(input);
        this.tokenLexer = {output: Array(), isValid: false};
        this.tokenParser = Array();
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
        p.addRows(this.tokenParser, {color: 'green'});
        p.printTable();
    }
    
}

let input = "hoot hu hoot woo hoot hu woo";
let main = new Main(input);
main.runLexer();
main.runParser();
