import { Token } from './Token';
import { Output } from './Interfaces';
import { Action } from './Action';

export class Lexer{

    private input: String;
    private output: Output[];
    private tokenize: String[];
    private error: Output[];
    private regex: any;
    private token: any;
    private action: any;

    constructor(input: String){
        this.input = input;
        this.output = Array();
        this.tokenize = Array();
        this.error = Array();
        this.regex = /((?<![\w\d])(hoot|woo|hu)(?![\w\d]))*([/ /g])*/gmi;
        this.token = new Token();
        this.action = new Action();
    }

    lexer(){
        //this.tokenize = (this.input.match(this.regex) || []).filter(b => b);
        this.tokenize = this.input.split(" ").filter(b => b);
        for (let i=0; i < this.tokenize.length; i++){
            if (this.tokenize[i].includes(this.token.getOwlNoiseVal(0))){
                this.output.push({input: this.token.getOwlNoiseVal(0), token: this.action.getKeyword()});
            }
            else if (this.tokenize[i].includes(this.token.getOwlNoiseVal(1))){
                this.output.push({input: this.token.getOwlNoiseVal(1), token: this.action.getKeyword()});
            }
            else if (this.tokenize[i].includes(this.token.getOwlNoiseVal(2))){
                this.output.push({input: this.token.getOwlNoiseVal(2), token: this.action.getKeyword()});
            }
            else{
                this.error.push({input: this.tokenize[i], token: this.action.getUnknown()});
                break;
            }
        }
        if (this.error.length == 0){
            return {output: this.output, isValid: true };
        }
        else{
            console.log("Error! Unknown token(s) found in the input.");
            return {output: this.error, isValid: false };
        }
    }

}