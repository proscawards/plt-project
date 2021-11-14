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

import { BNF, Output, ParserToken, OwlActions } from './Interfaces';
import { Token } from './Token';
import { Action } from './Action';
import bnf from "./BNF.json";

export class Parser{

    private input: String;
    private output: Output[];
    private isInputValid: boolean;
    private inputStack: String[];
    private tokenStack: String[];
    private parserStack: ParserToken[];
    private token: any;
    private action: any;
    private BNF: BNF[] = bnf;
    private isError: boolean;
    private owlActions: OwlActions;

    constructor(input: String, output: Output[], isInputValid: boolean){
        this.input = input;
        this.output = output;
        this.isInputValid = isInputValid;
        this.inputStack = Array();
        this.tokenStack = Array();
        this.parserStack = Array();
        this.token = new Token();
        this.action = new Action();
        this.isError = false;
        this.owlActions = {
            hoot: {
                action: "hooting for",
                amount: 0
            },
            whistle: {
                action: "whistling for",
                amount: 0
            },
            bark: {
                action: "barking for",
                amount: 0
            },
        }
    }

    //Main function
    main(){
        this.preprocessInput();
        this.validateToken();
        return {parserToken: this.parserStack, owlActions: this.owlActions, isError: this.isError};
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
            this.isError = true;
            console.log("Error! Unknown token(s) found in the input.")
        }
    }

    //Process token stack
    preprocessparserStack(){
        while(this.inputStack.length != 0 && !this.scanTokenStack()){
            this.readStack();
        }
    }  

    readStack(){
        //On init
        if (this.tokenStack.length == 0 && this.inputStack.length != 0){
            this.parserStack.push({stack: "$", input: this.inputStack.join(" "), action: this.action.getAction(0)});
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.tokenStack[0] == this.token.getOwlNoiseVal(0) || this.tokenStack[0] == this.token.getOwlNoiseVal(1)){
                if (this.inputStack.length != 0 && (this.inputStack[0] == this.token.getOwlNoiseVal(2) || this.inputStack[0] == this.token.getOwlNoiseVal(0))){
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
                }
                else{
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getKeyword()});
                }
            }
            else{
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getKeyword()});
            }
        }
        //When the stack has only one value
        if (this.tokenStack.length == 1){this.readSingle();}
        //When the stack has more than two values
        else{this.readMultiple();}
    }

    readSingle(){
        //The value is a KEYWORD
        if (this.tokenStack[0] == this.token.getOwlNoiseVal(2)){
            if (this.inputStack.length == 0){
                this.tokenStack[0] = this.action.getSingle();
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: ""});
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
            else{
                this.reduceShiftOnSingle();
            }
        }
        else{
            //Check if owl is barking or whistling
            if (this.tokenStack[0] == this.token.getOwlNoiseVal(1)){
                //Owl is going to whistle(?)
                if (this.inputStack.length != 0 && (this.inputStack[0] == this.token.getOwlNoiseVal(2))){
                    this.stackOnShift();
                    this.isOwlWhistling(0);
                }
                //Owl is going to bark(?)
                else if (this.inputStack.length != 0 && (this.inputStack[0] == this.token.getOwlNoiseVal(0))){
                    this.stackOnShift(this.inputStack.length > 2, this.action.getDouble());
                    this.isOwlBarking(0);
                    this.reduceShiftOnOngoingAction(this.inputStack.length == 0);
                }
                //Owl is definitely not going to whistle or bark at this point '-'
                else{
                    this.reduceShiftOnSingle();
                }
            }
            //Check if owl is hooting...
            else if (this.tokenStack[0] == this.token.getOwlNoiseVal(0)){
                //Owl is going to hoot(?)
                if (this.inputStack.length != 0 && (this.inputStack[0] == this.token.getOwlNoiseVal(0))){
                    this.stackOnShift();
                    if (this.inputStack.length != 0){
                        this.isOwlWhistling(0);
                    }
                }
                //Owl is definitely not going to hoot at this point '-'
                else{
                    this.reduceShiftOnSingle();
                }
            }
            else if (this.tokenStack[0] == this.action.getSingle()){
                if (this.inputStack.length != 0){
                    this.stackOnShift();
                }
                else{
                    this.stackOnComplete();
                }
            }
        }
    }

    readMultiple(){
        if (this.tokenStack[1] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[1] == this.token.getOwlNoiseVal(1) || 
            this.tokenStack[1] == this.token.getOwlNoiseVal(2)){
            if (this.tokenStack[0] == this.action.getSingle()){
                if (this.tokenStack[1] == this.token.getOwlNoiseVal(1)){
                    if (this.inputStack.length != 0 && (this.inputStack[0] == this.token.getOwlNoiseVal(0))){
                        this.stackOnShift();
                        this.isOwlBarking(1);
                    }
                    else if (this.inputStack.length != 0 && (this.inputStack[0] == this.token.getOwlNoiseVal(2))){
                        this.stackOnShift();
                        this.isOwlWhistling(1);
                    }
                    else{
                        this.stackOnShift();
                    }
                }
                else{
                    this.reduceShiftOnKeywordDouble(false);
                    this.tokenStack.push(this.inputStack[0]);
                    this.shiftStack();
                    //Check if the input stack still have child to be pushed
                    if (this.inputStack.length == 0){
                        if (!this.scanTokenStack()){
                            this.reduceShiftOnKeywordDouble(true); 
                            this.tokenStack.push(this.inputStack[0]);
                            this.shiftStack();            
                        }
                        else{
                            this.stackOnComplete();
                        }
                    }
                }
            }
            else{
                if ((this.tokenStack[0] == this.token.getOwlNoiseVal(0) ||
                    this.tokenStack[0] == this.token.getOwlNoiseVal(1) || 
                    this.tokenStack[0] == this.token.getOwlNoiseVal(2)) &&
                    (this.tokenStack[1] == this.token.getOwlNoiseVal(0) ||
                    this.tokenStack[1] == this.token.getOwlNoiseVal(1) || 
                    this.tokenStack[1] == this.token.getOwlNoiseVal(2))){
                    this.reduceShiftOnKeywordDouble(true);
                }
                else{
                    this.reduceShiftOnKeywordDouble(false);
                }
            }
        }
    }

    //Reduce and shift from KEYWORD to Double <EXP>
    reduceShiftOnKeywordDouble(isComplete: boolean){
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getKeyword()});
        this.tokenStack[1] = this.action.getSingle();
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getDouble()});
        this.tokenStack.pop();
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: isComplete ? "" : this.action.getAction(0)});
    }

    //Reduce and shift on ongoing action where the stack is building up to hoot/whistle/bark but failed
    reduceShiftOnOngoingAction(isComplete: boolean){
        this.tokenStack = [];
        this.tokenStack[0] = this.action.getDouble();
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getSingle()});
        this.tokenStack.pop();
        this.tokenStack[0] = this.action.getSingle();
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: isComplete ? "" : this.action.getAction(0)});
    }

    doBasicShift(){
        if (this.inputStack.length != 0){
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.tokenStack.length <= 4){
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
        }
    }

    //Reduce and shift on Single <EXP>
    reduceShiftOnSingle(){
        this.tokenStack[0] = this.action.getSingle();
        if (this.inputStack.length == 0){
            this.stackOnComplete();
        }
        else{
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
        }
    }

    stackOnShift(hasElemLeft?: boolean, actionName?: String){
        this.tokenStack.push(this.inputStack[0]);
        this.shiftStack();
        if (!hasElemLeft){
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+actionName});
        }
        else{
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
        }
    }

    stackOnComplete(){
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: ""});
    }

    //Check at last if owl is really barking
    //<OWL_BARK> => hu hoot <EXP> hoot
    isOwlBarking(pos: any){
        this.doBasicShift();
        if (this.tokenStack[pos] == this.token.getOwlNoiseVal(1) &&
            this.tokenStack[pos+1] == this.token.getOwlNoiseVal(0) &&
            (this.tokenStack[pos+2] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[pos+2] == this.token.getOwlNoiseVal(1) || 
            this.tokenStack[pos+2] == this.token.getOwlNoiseVal(2)) && 
            this.tokenStack[pos+3] == this.token.getOwlNoiseVal(0)){
                this.owlActions.bark.amount++;
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getBark()});
                if (this.tokenStack[0] == this.action.getSingle()){
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getDouble());   
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getDouble()});
                    this.tokenStack.pop();
                    this.tokenStack.push(this.action.getSingle());  
                }
                else{
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getSingle());
                }
                this.rerunUntilComplete();
            }
    }

    //Check at last if owl is really whistling
    //<OWL_BARK> => hu woo woo hoot <EXP>
    isOwlWhistling(pos: any){
        this.doBasicShift();
        if (this.tokenStack[pos] == this.token.getOwlNoiseVal(1) &&
            this.tokenStack[pos+1] == this.token.getOwlNoiseVal(2) &&
            this.tokenStack[pos+2] == this.token.getOwlNoiseVal(2) &&
            this.tokenStack[pos+3] == this.token.getOwlNoiseVal(0) &&
            (this.tokenStack[pos+4] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[pos+4] == this.token.getOwlNoiseVal(1) || 
            this.tokenStack[pos+4] == this.token.getOwlNoiseVal(2))){
                this.owlActions.whistle.amount++;
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getWhistle()});
                if (this.tokenStack[0] == this.action.getSingle()){
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getDouble());   
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1)+this.action.getDouble()});
                    this.tokenStack.pop();
                    this.tokenStack.push(this.action.getSingle());  
                }
                else{
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getSingle());
                }
                this.rerunUntilComplete();
            }
    }

    //Check if there's any keyword exist in the stack
    scanTokenStack(){
        let needles: String[] = [this.token.getOwlNoiseVal(0),this.token.getOwlNoiseVal(1), this.token.getOwlNoiseVal(2)];
        let haystack: String[] = this.tokenStack;
        let doesTokenExist: boolean = false;
        needles.every(i => doesTokenExist = haystack.includes(i));
        return doesTokenExist;
    }

    //Check state and rerun until input stack is empty
    rerunUntilComplete(){
        if (this.inputStack.length != 0){
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0)});
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            while (this.inputStack.length == 0){
                this.reduceShiftOnKeywordDouble(false);
            }
        }
        else{
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.inputStack.join(" "), action: ""});
        }
    }
    
}

