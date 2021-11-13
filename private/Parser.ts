/*

Terminal:
KEYWORD -> hoot|hu|woo

Production Rules:
<EXP> -> KEYWORD
<EXP> -> <EXP>
<EXP> -> <EXP> <EXP>
<EXP> -> <EXP> <EXP> <EXP> 
<EXP> -> <EXP> <EXP> <EXP> <EXP> 
<EXP> -> <EXP> <EXP> <EXP> <EXP> <EXP>

An owl can chirp up to five times in a row.
*/

import { ActionVal, Output, ParserToken, StackData } from './Interfaces';
import { Token } from './Token';
import { Action } from './Action';

export class Parser{

    private input: String;
    private output: Output[];
    private isInputValid: boolean;
    private inputStack: String[];
    private stackData: StackData;
    private tokenStack: String[];
    private parserStack: ParserToken[];
    private token: any;
    private action: any;
    private currAction: any;
    private actionVal: ActionVal;

    constructor(input: String, output: Output[], isInputValid: boolean){
        this.input = input;
        this.output = output;
        this.isInputValid = isInputValid;
        this.inputStack = Array();
        this.tokenStack = Array();
        this.parserStack = Array();
        this.token = new Token();
        this.action = new Action();
        this.actionVal = {actionStr:"", actionInt:0};
        this.stackData = {stack:"", action: {actionStr:"", actionInt:0}};
        this.currAction = 0;
    }

    //Main function
    main(){
        this.preprocessInput();
        this.validateToken();
    }

    //Append to stack
    pushStack(input: String){this.inputStack.push(input)}

    //Remove first element from stack
    shiftStack(){this.inputStack.shift()}

    //Break input and put into an array
    preprocessInput(){
        let process: String[];
        process = this.input.toLowerCase().split(" ");
        process.map(p => this.pushStack(p))
    }

    //Validate if the inputs are valid tokens
    validateToken(){
        if (this.isInputValid){
            this.preprocessparserStack();
        }
        else{
            console.log("Error! Unknown token(s) found in the input.")
        }
    }

    //Process token stack
    preprocessparserStack(){
        for (let i=-1; i <= this.inputStack.length; i++){
            this.readStack();
        }

        this.parserStack.map(tok => {
            console.table(tok.stack+"\t\t\t\t"+tok.input+"\t\t\t\t"+tok.action)
        })
        console.log("Completed")
    }  

    /*
    readStack(){
            //First elem is KEYWORD
            if (this.tokenStack[0] == this.token.getOwlNoiseVal(0) || 
                this.tokenStack[0] == this.token.getOwlNoiseVal(1) || 
                this.tokenStack[0] == this.token.getOwlNoiseVal(2)){
                this.currAction = 1;
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(this.currAction)+this.action.getKeyword()});
                this.tokenStack[0] = this.action.getSingle();
            } //First elem is EXP
            else{
                if (this.inputStack.length == 0 && this.tokenStack.length == 1 && this.tokenStack[0] == this.action.getSingle()){
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: "Completed"});
                }
                else if (this.tokenStack[1] == this.token.getOwlNoiseVal(0) || 
                        this.tokenStack[1] == this.token.getOwlNoiseVal(1) || 
                        this.tokenStack[1] == this.token.getOwlNoiseVal(2)){
                            this.currAction = 0;
                            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(this.currAction)});
                            this.tokenStack.push(this.inputStack[0]);
                            this.shiftStack();   
                }
                else{
                    if (this.inputStack.length != 0 && this.tokenStack.length != 0){
                        this.currAction = 0;
                        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(this.currAction)});
                        this.tokenStack.push(this.inputStack[0]);
                        this.shiftStack();   
                    }
                    else{
                        //Initial
                        this.currAction = 0;
                        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(this.currAction)});
                        this.tokenStack.push(this.inputStack[0]);
                        this.shiftStack();   
                    }
                }
            }
        }
        */

        readStack(){
            //On init
            if (this.tokenStack.length == 0 && this.inputStack.length != 0){
                this.parserStack.push({stack: "$", input: this.inputStack.join(" "), action: this.action.getAction(0)});
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getKeyword()});
            }
            //When the stack has only one value
            if (this.tokenStack.length == 1){
                //The value is a KEYWORD
                if (this.tokenStack[0] == this.token.getOwlNoiseVal(0) ||
                    this.tokenStack[0] == this.token.getOwlNoiseVal(1) || 
                    this.tokenStack[0] == this.token.getOwlNoiseVal(2)){
                        if (this.inputStack.length == 0){
                            this.tokenStack[0] = this.action.getSingle();
                            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: ""});
                            this.tokenStack.push(this.inputStack[0]);
                            this.shiftStack();
                        }
                        else{
                            this.tokenStack[0] = this.action.getSingle();
                            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
                            this.tokenStack.push(this.inputStack[0]);
                            this.shiftStack();
                        }
                    }
            }
            //When the stack has two values
            if (this.tokenStack.length == 2){
                if (this.tokenStack[1] == this.token.getOwlNoiseVal(0) ||
                    this.tokenStack[1] == this.token.getOwlNoiseVal(1) || 
                    this.tokenStack[1] == this.token.getOwlNoiseVal(2)){
                        if (this.tokenStack[0] == this.action.getSingle()){
                            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getKeyword()});
                            this.tokenStack[1] = this.action.getSingle();
                            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getDouble()});
                            this.tokenStack.pop();
                            this.shiftStack();
                            //Check if the input stack still have child to be pushed
                            if (this.inputStack.length != 0){
                                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
                            }
                            else{
                                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: ""});
                            }
                        }
                    }
            }
        }
    
}

