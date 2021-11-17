import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { IsOutputValid, ParserResults } from "./Interfaces";
import { Action } from './Action';
import { Table } from "console-table-printer";
const chalk = require("chalk");

export class Runner{

    private input: String;
    private lexer: any;
    private parser: any;
    private tokenLexer: IsOutputValid;
    private tokenParser: ParserResults;
    private action: any;

    constructor(input: String){
        this.input = input;
        this.lexer = new Lexer(input);
        this.tokenLexer = {preRegex: Array(), postRegex: Array(), isValid: false};
        this.tokenParser = {parserToken: Array(), owlActions: {hoot: {action:"",amount:0}, bark: {action:"",amount:0}, whistle: {action:"",amount:0}}, isError: false};
        this.action = new Action();
    }

    runLexer(){
        console.log(chalk.yellow.underline("\nLexical Analysis: "));
        this.tokenLexer = this.lexer.lexer();
        this.parser = new Parser(this.tokenLexer.postRegex.join(" "), this.tokenLexer.isValid);
        console.log("Result:");
        this.tokenLexer.preRegex.map(tok => {
            if (tok.token == this.action.getUnknown()){console.log(chalk.bgRed("["+tok.input + ", " + tok.token+"]")+chalk.red.bold.dim(" <-- ERROR"))}
            else{console.log(chalk.green.dim("["+tok.input + ", " + tok.token+"]"))}
        });
    }

    runParser(){
        console.log(chalk.yellow.underline("\nSyntax Analysis: "));
        this.tokenParser = this.parser.main();
        console.log("Result:");
        if (!this.tokenParser.isError){
            const p = new Table({
                columns: [
                  { name: 'stack', title: 'Stack', alignment: 'left'},
                  { name: 'input', title: 'Input', alignment: 'left'}],
                computedColumns: [
                  { name: 'actions', title: 'Action', alignment: 'left',               
                    function: (row) => {
                        let val: String = row.action;
                        if (val == "SHIFT") {return chalk.red.bold(val);}
                        else{
                            if (val){
                                return chalk.blue.bold(this.action.getAction(1))+chalk.magenta.bold(val);
                            }
                        }
                    }
                    }
                ],
                disabledColumns: ["action"],
              });
            p.addRows(this.tokenParser.parserToken, {color: 'green'});
            p.printTable();
        }
        console.log("🦉 is "+this.preprocessOwlActions()+"\n");
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
        let hoot: String = (this.tokenParser.owlActions.hoot.action).toString() + " " + (this.tokenParser.owlActions.hoot.amount).toString() + (this.tokenParser.owlActions.hoot.amount > 1 ? " times" : " time");
        let whistle: String = (this.tokenParser.owlActions.whistle.action).toString() + " " + (this.tokenParser.owlActions.whistle.amount).toString() + (this.tokenParser.owlActions.whistle.amount > 1 ? " times" : " time");
        let bark: String = (this.tokenParser.owlActions.bark.action).toString() + " " + (this.tokenParser.owlActions.bark.amount).toString() + (this.tokenParser.owlActions.bark.amount > 1 ? " times" : " time");
        let and: string = " and "; let dot: string = "!"; let com: string = ", ";
        if (isError){
            return "talking gibberish!"
        }
        else{
            if (isHooting && isWhistling && isBarking){return hoot+com+whistle+and+bark+dot;}
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
