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
        this.tokenParser = {parserToken: Array(), owlActions: {hoot: {action:"",amount:0}, bark: {action:"",amount:0}, whistle: {action:"",amount:0}}, isError: false};
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
        console.log("Result: 🦉 is "+this.preprocessOwlActions()+"\n");
    }

    //Preprocess owl's corresponding action and amount
    preprocessOwlActions(){
        let isHooting: boolean = false, isWhistling: boolean = false, isBarking: boolean = false;
        if (this.tokenParser.owlActions.hoot.amount > 0){isHooting = true;}
        if (this.tokenParser.owlActions.whistle.amount > 0){isWhistling = true;}
        if (this.tokenParser.owlActions.bark.amount > 0){isBarking = true;}
        return this.stringBuilder(isHooting, isWhistling, isBarking, this.tokenParser.isError);
    }

    //Build owl actions into string for displaying purpose
    stringBuilder(isHooting: boolean, isWhistling: boolean, isBarking: boolean, isError: boolean){
        let hoot: String = (this.tokenParser.owlActions.hoot.action).toString() + " " + (this.tokenParser.owlActions.hoot.amount).toString() + " times";
        let whistle: String = (this.tokenParser.owlActions.whistle.action).toString() + " " + (this.tokenParser.owlActions.whistle.amount).toString() + " times";
        let bark: String = (this.tokenParser.owlActions.bark.action).toString() + " " + (this.tokenParser.owlActions.bark.amount).toString() + " times";
        let and: string = " and "; let dot: string = "!"; let com: string = ", ";
        if (isError){
            return "talking gibberish!"
        }
        else{
            if (isHooting && isWhistling && isBarking){return hoot+com+whistle+dot+and+bark;}
            else if (isHooting && isWhistling && !isBarking){return hoot+and+whistle+dot;}
            else if (isHooting && !isWhistling && isBarking){return hoot+and+bark+dot;}
            else if (isHooting && !isWhistling && !isBarking){return hoot+dot;}
            else if (!isHooting && isWhistling && isBarking){return whistle+and+bark+dot;}
            else if (!isHooting && isWhistling && !isBarking){return whistle+dot;}
            else if (!isHooting && !isWhistling && isBarking){return bark+dot;}
            else{return "talking normally!"}
        }
    }
    
}

let input = "hu hoot hu hoot hu hoot hu hoot hoot hoot hu hoot hu hoot hoot hu hoot hu hoot hoot hoot hu hoot hu hoot";
let main = new Main(input);
main.runLexer();
main.runParser();
