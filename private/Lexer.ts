import { Token } from './Token';
import { Output } from './Interfaces';
import { Action } from './Action';
const chalk = require("chalk");

export class Lexer{

    private input: String;
    private output: Output[];
    private preRegex: String[];
    private postRegex: String[];
    private error: Output[];
    private regex: any;
    private token: any;
    private action: any;

    constructor(input: String){
        this.input = input;
        this.output = Array();
        this.preRegex = Array();
        this.postRegex = Array();
        this.error = Array();
        this.regex = /((?<![\w\d])(hoot|woo|hu)(?![\w\d]))*([/ /g])*/gmi;
        this.token = new Token();
        this.action = new Action();
    }

    lexer(){
        this.preRegex = this.input.split(" ").filter(b => b);
        this.postRegex = (this.input.match(this.regex) || []).filter(b => b);
        for (let i=0; i < this.preRegex.length; i++){
            if (this.preRegex[i] == this.token.getOwlNoiseVal(0)){
                this.output.push({input: this.token.getOwlNoiseVal(0), token: this.action.getKeyword()});
                this.error.push({input: this.token.getOwlNoiseVal(0), token: this.action.getKeyword()});
            }
            else if (this.preRegex[i] == this.token.getOwlNoiseVal(1)){
                this.output.push({input: this.token.getOwlNoiseVal(1), token: this.action.getKeyword()});
                this.error.push({input: this.token.getOwlNoiseVal(1), token: this.action.getKeyword()});
            }
            else if (this.preRegex[i] == this.token.getOwlNoiseVal(2)){
                this.output.push({input: this.token.getOwlNoiseVal(2), token: this.action.getKeyword()});
                this.error.push({input: this.token.getOwlNoiseVal(2), token: this.action.getKeyword()});
            }
            else{
                this.error.push({input: this.preRegex[i], token: this.action.getUnknown()});
            }
        }
        if (this.error.some(e => e.token === this.action.getUnknown())){
            console.log(chalk.red.bold("Error! Unknown token(s) found in the input."));
            return {preRegex: this.error, postRegex: this.postRegex, isValid: false };
        }
        else{
            return {preRegex: this.output, postRegex: this.postRegex, isValid: true };
        }
    }

}