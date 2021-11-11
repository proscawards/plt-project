import { Output, ParserToken } from './Interfaces';
import { Token } from './Token';
import { Action } from './Action';
import { timeStamp } from 'console';

export class Parser{

    private input: String;
    private output: Output[];
    private isInputValid: boolean;
    private inputStack: String[];
    private tokenStack: ParserToken[];
    private token: any;
    private action: any;

    constructor(input: String, output: Output[], isInputValid: boolean){
        this.input = input;
        this.output = output;
        this.isInputValid = isInputValid;
        this.inputStack = Array();
        this.tokenStack = Array();
        this.token = new Token();
        this.action = new Action();
    }

    //Main function
    main(){
        this.preprocessInput();
        this.validateToken();
    }

    //Append to stack
    addStack(input: String){this.inputStack.push(input)}

    //Pop stack
    popStack(){this.inputStack.pop()}

    //Break input and put into an array
    preprocessInput(){
        let process: String[];
        process = this.input.toLowerCase().split(" ");
        process.map(p => this.addStack(p))
    }

    //Validate if the inputs are valid tokens
    validateToken(){
        if (this.isInputValid){
            this.preprocessTokenStack();
        }
        else{
            console.log("Error! Unknown token(s) found in the input.")
        }
    }

    //Process token stack
    preprocessTokenStack(){
        for (let i=0; i< this.inputStack.length; i++){
            this.tokenStack.push({stack: "$", input: this.inputStack.join(" "), action: this.action.getAction(0)})
        }

        this.tokenStack.map(tok => {
            console.table(tok.stack+"\t\t"+tok.input+"\t\t"+tok.action)
        })
    }  
    
}

