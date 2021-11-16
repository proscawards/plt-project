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

import { BNF, Output, ParserToken, OwlActions} from './Interfaces';
import { Token } from './Token';
import { Action } from './Action';
import bnf from "./BNF.json";
const chalk = require("chalk");

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
    private isCompleted: boolean;
    private currOwlAction: any; 

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
        this.isCompleted = false;
        this.currOwlAction = -1; //-1-normal/0-hoot/1-bark/2-whistle
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
        process = this.input.toLowerCase().split(" ").filter(b => b);
        process.map(p => this.pushStack(p))
    }

    //Display ... at the end when the input is too long
    trimInputOnDisplay(){
        let display: String;
        if (this.inputStack.length > 10){
            display = this.inputStack.slice(0, 10).join(" ")+"...";
        }
        else{display = this.inputStack.join(" ");}
        return display;
    }

    //Validate if the inputs are valid tokens
    validateToken(){
        if (this.isInputValid){
            this.preprocessparserStack();
        }
        else{
            this.isError = true;
            console.log(chalk.red.bold("Error! Unknown token(s) found in the input."))
        }
    }

    //Process token stack
    preprocessparserStack(){
        while(this.inputStack.length != 0){
            this.readStack();
        }
    }  

    readStack(){
        //On init
        if (this.tokenStack.length == 0 && this.inputStack.length != 0){
            this.parserStack.push({stack: "$", input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.scanUpcomingInput(true, 0) || this.scanUpcomingInput(true, 1) || this.scanUpcomingInput(true, 2)){
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
            }
            else{
                this.reduceShiftOnInit();
            }
        }
        //When the stack has only one value
        if (this.tokenStack.length == 1){this.readSingle();}
        //When the stack has more than two values
        else{this.readMultiple();}
    }

    readSingle(){
        //Owl is going to whistle(?)
        if (this.scanUpcomingInput(true, 2)){
            this.stackOnShift();                    
            this.isOwlWhistling(0);
        }
        //Owl is going to bark(?)
        else if (this.scanUpcomingInput(true, 1)){
            this.stackOnShift();
            this.isOwlBarking(0);
        }
        //Owl is going to hoot(?)
        else if (this.scanUpcomingInput(true, 0)){
            this.stackOnShift();
            this.isOwlHooting(0);
        }
        //Owl is definitely not going to hoot at this point '-'
        else{
            this.reduceShiftOnSingle();
        }
    }

    readMultiple(){
        if (this.tokenStack[1] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[1] == this.token.getOwlNoiseVal(1) || 
            this.tokenStack[1] == this.token.getOwlNoiseVal(2)){
            if (this.tokenStack[0] == this.action.getSingle()){
                if (this.scanUpcomingInput(false, 1)){
                    this.stackOnShift();
                    this.isOwlBarking(1);
                }
                else if (this.scanUpcomingInput(false, 2)){
                    this.stackOnShift();
                    this.isOwlWhistling(1);
                }
                else if (this.scanUpcomingInput(false, 0)){
                    this.stackOnShift();
                    this.isOwlHooting(1);
                }
                else{
                    this.reduceShiftOnKeywordDouble();
                }
            }
            else{
                this.reduceShiftOnKeywordDouble();
            }
        }
        else{
            this.reduceShiftOnKeywordDouble();
        }
    }

    //Reduce and shift from KEYWORD to Double <EXP>
    reduceShiftOnKeywordDouble(){ 
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getKeyword()});
        this.tokenStack[1] = this.action.getSingle();
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble()});
        this.tokenStack.pop();
        this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
    }

    //Execute basic shift & reduce based on the current owl's action
    doBasicShift(){
        if (this.inputStack.length != 0){
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.currOwlAction == 2){
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
            else{
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
        }
    }

    //Reduce and shift on Single <EXP>
    reduceShiftOnSingle(){
        this.tokenStack[0] = this.action.getSingle();
        this.tokenStack.push(this.inputStack[0]);
        this.shiftStack();
        if (this.inputStack.length == 0){
            this.stackOnComplete();
        }
    }

    //Reduce shift on init when inputs are invalid owl's action
    reduceShiftOnInit(){
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getKeyword()});
        this.tokenStack[0] = this.action.getSingle();
        if (this.inputStack.length == 0){
            this.stackOnComplete();
        }
        else{
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
        }
    }

    //Execute basic shift on both owl's action and non-action
    stackOnShift(){
        this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
        this.tokenStack.push(this.inputStack[0]);
        this.shiftStack();
        if (this.inputStack.length != 0){
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
        }
    }

    //Execute on complete
    stackOnComplete(){
        if (!this.isCompleted){
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: ""});
            this.isCompleted = true;
        }
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
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getBark()});
                if (this.tokenStack[0] == this.action.getSingle()){
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getDouble());   
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble()});
                    this.tokenStack.pop();
                    this.tokenStack.push(this.action.getSingle());  
                }
                else{
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getSingle());
                }
                !this.scanTokenStack() && this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
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
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getWhistle()});
                if (this.tokenStack[0] == this.action.getSingle()){
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getDouble());   
                    this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble()});
                    this.tokenStack.pop();
                    this.tokenStack.push(this.action.getSingle());  
                }
                else{
                    this.tokenStack = [];   
                    this.tokenStack.push(this.action.getSingle());
                }
                !this.scanTokenStack() && this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
            }
    }

    //Check at last if owl is really hooting
    //<OWL_HOOT> => hoot hoot hu <EXP>
    isOwlHooting(pos: any){
        this.doBasicShift();
        if (this.tokenStack[pos] == this.token.getOwlNoiseVal(0) &&
            this.tokenStack[pos+1] == this.token.getOwlNoiseVal(0) &&
            this.tokenStack[pos+2] == this.token.getOwlNoiseVal(1) &&
            (this.tokenStack[pos+3] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[pos+3] == this.token.getOwlNoiseVal(1) || 
            this.tokenStack[pos+3] == this.token.getOwlNoiseVal(2))){
            this.owlActions.hoot.amount++;
            this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getHoot()});
            if (this.tokenStack[0] == this.action.getSingle()){
                this.tokenStack = [];   
                this.tokenStack.push(this.action.getDouble());   
                this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble()});
                this.tokenStack.pop();
                this.tokenStack.push(this.action.getSingle());  
            }
            else{
                this.tokenStack = [];   
                this.tokenStack.push(this.action.getSingle());
            }
            !this.scanTokenStack() && this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({stack: "$"+this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0)});
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

    //Iterate through upcoming inputStack if it's a possible owl action
    //Type: 0-Hoot, 1-Bark, 2-Whistle
    scanUpcomingInput(isSingle: boolean, type: any){
        if (!this.isCompleted){
            if (this.inputStack.length == 0){
                //Exit directly as there's no input left
                this.currOwlAction = -1;
                return false;
            }
            else if (isSingle){
                if (this.tokenStack[0] == this.token.getOwlNoiseVal(1)){
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                        (this.inputStack[1] == this.token.getOwlNoiseVal(0) ||
                        this.inputStack[1] == this.token.getOwlNoiseVal(1) || 
                        this.inputStack[1] == this.token.getOwlNoiseVal(2)) && 
                        this.inputStack[2] == this.token.getOwlNoiseVal(0) &&
                        type == 1){
                        //Valid barking action
                        this.currOwlAction = type;
                        return true;
                    }
                    else if (this.inputStack[0] == this.token.getOwlNoiseVal(2) &&
                        this.inputStack[1] == this.token.getOwlNoiseVal(2) &&
                        this.inputStack[2] == this.token.getOwlNoiseVal(0) &&
                        (this.inputStack[3] == this.token.getOwlNoiseVal(0) ||
                        this.inputStack[3] == this.token.getOwlNoiseVal(1) || 
                        this.inputStack[3] == this.token.getOwlNoiseVal(2)) &&
                        type == 2){
                        //Valid whistling action
                        this.currOwlAction = type;
                        return true;
                    }
                    else{
                        this.currOwlAction = -1;
                        return false;
                    }
                }
                else if (this.tokenStack[0] == this.token.getOwlNoiseVal(0)){
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                    this.inputStack[1] == this.token.getOwlNoiseVal(1) &&
                    (this.inputStack[2] == this.token.getOwlNoiseVal(0) ||
                    this.inputStack[2] == this.token.getOwlNoiseVal(1) || 
                    this.inputStack[2] == this.token.getOwlNoiseVal(2)) &&
                    type == 0){
                        //Valid hooting action
                        this.currOwlAction = type;
                        return true;
                    }
                    else{
                        this.currOwlAction = -1;
                        return false;
                    }
    
                }
                else{
                    //Invalid actions..continue normally
                    this.currOwlAction = -1;
                    return false;
                }
            }
            else{
                if (this.tokenStack[1] == this.token.getOwlNoiseVal(1)){
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                        (this.inputStack[1] == this.token.getOwlNoiseVal(0) ||
                        this.inputStack[1] == this.token.getOwlNoiseVal(1) || 
                        this.inputStack[1] == this.token.getOwlNoiseVal(2)) && 
                        this.inputStack[2] == this.token.getOwlNoiseVal(0) &&
                        type == 1){
                        //Valid barking action
                        this.currOwlAction = type;
                        return true;
                    }
                    else if (this.inputStack[0] == this.token.getOwlNoiseVal(2) &&
                        this.inputStack[1] == this.token.getOwlNoiseVal(2) &&
                        this.inputStack[2] == this.token.getOwlNoiseVal(0) &&
                        (this.inputStack[3] == this.token.getOwlNoiseVal(0) ||
                        this.inputStack[3] == this.token.getOwlNoiseVal(1) || 
                        this.inputStack[3] == this.token.getOwlNoiseVal(2)) && 
                        type == 2){
                        //Valid whistling action
                        this.currOwlAction = type;
                        return true;
                    }
                    else{
                        this.currOwlAction = -1;
                        return false;
                    }
                }
                else if (this.tokenStack[1] == this.token.getOwlNoiseVal(0)){
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                    this.inputStack[1] == this.token.getOwlNoiseVal(1) &&
                    (this.inputStack[2] == this.token.getOwlNoiseVal(0) ||
                    this.inputStack[2] == this.token.getOwlNoiseVal(1) || 
                    this.inputStack[2] == this.token.getOwlNoiseVal(2)) &&
                    type == 0){
                        //Valid hooting action
                        this.currOwlAction = type;
                        return true;
                    }
                    else{
                        this.currOwlAction = -1;
                        return false;
                    }
    
                }
                else{
                    //Invalid actions..continue normally
                    this.currOwlAction = -1;
                    return false;
                }
            }
        }
    }
}

