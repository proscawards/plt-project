"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var Token_1 = require("./Token");
var Action_1 = require("./Action");
var BNF_json_1 = __importDefault(require("./BNF.json"));
var Parser = /** @class */ (function () {
    function Parser(input, output, isInputValid) {
        this.BNF = BNF_json_1.default;
        this.input = input;
        this.output = output;
        this.isInputValid = isInputValid;
        this.inputStack = Array();
        this.tokenStack = Array();
        this.parserStack = Array();
        this.token = new Token_1.Token();
        this.action = new Action_1.Action();
        this.result = "talking gibberish.";
        this.isBarking = false;
        this.isHooting = false;
        this.isWhistling = false;
        this.totalBark = 0;
        this.totalHoot = 0;
        this.totalWhistle = 0;
    }
    //Main function
    Parser.prototype.main = function () {
        this.preprocessInput();
        this.validateToken();
        return { parserToken: this.parserStack, result: this.result, amount: this.totalBark };
    };
    //Append to stack
    Parser.prototype.pushStack = function (input) { this.inputStack.push(input); };
    //Remove first element from stack
    Parser.prototype.shiftStack = function () { this.inputStack.shift(); };
    //Break input and put into an array
    Parser.prototype.preprocessInput = function () {
        var _this = this;
        var process;
        process = this.input.toLowerCase().split(" ");
        process.map(function (p) { return _this.pushStack(p); });
    };
    //Validate if the inputs are valid tokens
    Parser.prototype.validateToken = function () {
        if (this.isInputValid) {
            this.preprocessparserStack();
        }
        else {
            console.log("Error! Unknown token(s) found in the input.");
        }
    };
    //Process token stack
    Parser.prototype.preprocessparserStack = function () {
        while (this.inputStack.length != 0 && !this.scanTokenStack()) {
            this.readStack();
        }
    };
    Parser.prototype.readStack = function () {
        //On init
        if (this.tokenStack.length == 0 && this.inputStack.length != 0) {
            this.parserStack.push({ stack: "$", input: this.inputStack.join(" "), action: this.action.getAction(0) });
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.tokenStack[0] == this.token.getOwlNoiseVal(0) || this.tokenStack[0] == this.token.getOwlNoiseVal(1)) {
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
            }
            else {
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1) + this.action.getKeyword() });
            }
        }
        //When the stack has only one value
        if (this.tokenStack.length == 1) {
            this.readSingle();
        }
        //When the stack has more than two values
        else {
            this.readMultiple();
        }
    };
    Parser.prototype.readSingle = function () {
        //The value is a KEYWORD
        if (this.tokenStack[0] == this.token.getOwlNoiseVal(2)) {
            if (this.inputStack.length == 0) {
                this.tokenStack[0] = this.action.getSingle();
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: "" });
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
            else {
                this.tokenStack[0] = this.action.getSingle();
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
        }
        else {
            //Check if owl is barking...
            if (this.tokenStack[0] == this.token.getOwlNoiseVal(1)) {
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
                this.isOwlBarking(0);
            }
            else if (this.tokenStack[0] == this.action.getSingle()) {
                if (this.inputStack.length != 0) {
                    this.tokenStack.push(this.inputStack[0]);
                    this.shiftStack();
                    this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
                }
                else {
                    this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: "" });
                }
            }
        }
    };
    Parser.prototype.readMultiple = function () {
        if (this.tokenStack[1] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[1] == this.token.getOwlNoiseVal(1) ||
            this.tokenStack[1] == this.token.getOwlNoiseVal(2)) {
            if (this.tokenStack[0] == this.action.getSingle()) {
                if (this.tokenStack[1] == this.token.getOwlNoiseVal(1)) {
                    if (this.tokenStack[2] == this.token.getOwlNoiseVal(0)) {
                        this.tokenStack.push(this.inputStack[0]);
                        this.shiftStack();
                        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
                        this.isOwlBarking(1);
                    }
                    else {
                        this.tokenStack.push(this.inputStack[0]);
                        this.shiftStack();
                        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
                    }
                }
                else {
                    this.doThreeSteps(false);
                    this.tokenStack.push(this.inputStack[0]);
                    this.shiftStack();
                    //Check if the input stack still have child to be pushed
                    if (this.inputStack.length == 0) {
                        if (!this.scanTokenStack()) {
                            this.doThreeSteps(true);
                            this.tokenStack.push(this.inputStack[0]);
                            this.shiftStack();
                        }
                        else {
                            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: "" });
                        }
                    }
                }
            }
            else {
                //Check if owl is barking...
            }
        }
    };
    //From keyword to double to SHIFT
    Parser.prototype.doThreeSteps = function (isComplete) {
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1) + this.action.getKeyword() });
        this.tokenStack[1] = this.action.getSingle();
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1) + this.action.getDouble() });
        this.tokenStack.pop();
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: isComplete ? "" : this.action.getAction(0) });
    };
    Parser.prototype.doBasicShift = function () {
        if (this.inputStack.length != 0) {
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.tokenStack.length <= 4) {
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
        }
    };
    //Check at last if owl is really barking
    //<OWL_BARK> => hu hoot <EXP> hoot
    Parser.prototype.isOwlBarking = function (pos) {
        this.doBasicShift();
        if (this.tokenStack[pos] == this.token.getOwlNoiseVal(1) &&
            this.tokenStack[pos + 1] == this.token.getOwlNoiseVal(0) &&
            (this.tokenStack[pos + 2] == this.token.getOwlNoiseVal(0) ||
                this.tokenStack[pos + 2] == this.token.getOwlNoiseVal(1) ||
                this.tokenStack[pos + 2] == this.token.getOwlNoiseVal(2)) &&
            this.tokenStack[pos + 3] == this.token.getOwlNoiseVal(0)) {
            this.result = "barking";
            this.isBarking = true;
            this.totalBark++;
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1) + this.action.getBark() });
            if (this.tokenStack[0] == this.action.getSingle()) {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getDouble());
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(1) + this.action.getDouble() });
                this.tokenStack.pop();
                this.tokenStack.push(this.action.getSingle());
            }
            else {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getSingle());
            }
            this.rerunUntilComplete();
        }
    };
    //Check if there's any keyword exist in the stack
    Parser.prototype.scanTokenStack = function () {
        var needles = [this.token.getOwlNoiseVal(0), this.token.getOwlNoiseVal(1), this.token.getOwlNoiseVal(2)];
        var haystack = this.tokenStack;
        var doesTokenExist = false;
        needles.every(function (i) { return doesTokenExist = haystack.includes(i); });
        return doesTokenExist;
    };
    //Check state and rerun until input stack is empty
    Parser.prototype.rerunUntilComplete = function () {
        if (this.inputStack.length != 0) {
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: this.action.getAction(0) });
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            while (this.inputStack.length == 0) {
                this.doThreeSteps(false);
            }
        }
        else {
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.inputStack.join(" "), action: "" });
        }
    };
    return Parser;
}());
exports.Parser = Parser;
