"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var Token_1 = require("./Token");
var Action_1 = require("./Action");
var chalk = require("chalk");
var Parser = /** @class */ (function () {
    function Parser(input, isInputValid) {
        this.input = input;
        this.isInputValid = isInputValid;
        this.inputStack = Array();
        this.tokenStack = Array();
        this.parserStack = Array();
        this.token = new Token_1.Token();
        this.action = new Action_1.Action();
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
        };
        this.isCompleted = false;
        this.currOwlAction = -1; //-1-normal/0-hoot/1-bark/2-whistle
    }
    //Main function
    Parser.prototype.main = function () {
        this.preprocessInput();
        this.validateToken();
        return { parserToken: this.parserStack, owlActions: this.owlActions, isError: this.isError };
    };
    //Append to stack
    Parser.prototype.pushStack = function (input) { this.inputStack.push(input); };
    //Remove first element from stack
    Parser.prototype.shiftStack = function () { this.inputStack.shift(); };
    //Break input and put into an array
    Parser.prototype.preprocessInput = function () {
        var _this = this;
        var process;
        process = this.input.toLowerCase().split(" ").filter(function (b) { return b; });
        process.map(function (p) { return _this.pushStack(p); });
    };
    //Display ... at the end when the input is too long
    Parser.prototype.trimInputOnDisplay = function () {
        var display;
        if (this.inputStack.length > 10) {
            display = this.inputStack.slice(0, 10).join(" ") + "...$";
        }
        else {
            display = this.inputStack.join(" ") + "$";
        }
        return display;
    };
    //Validate if the inputs are valid tokens
    Parser.prototype.validateToken = function () {
        if (this.isInputValid) {
            this.preprocessparserStack();
        }
        else {
            this.isError = true;
            console.log(chalk.red.bold("Error! Unknown token(s) found in the input."));
        }
    };
    //Process token stack
    Parser.prototype.preprocessparserStack = function () {
        while (!this.isCompleted) {
            this.readStack();
        }
    };
    Parser.prototype.readStack = function () {
        //On init
        if (this.tokenStack.length == 0 && this.inputStack.length != 0) {
            this.parserStack.push({ stack: "$", input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.scanUpcomingInput(true, 0) || this.scanUpcomingInput(true, 1) || this.scanUpcomingInput(true, 2)) {
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
            }
            else {
                this.reduceShiftOnInit();
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
        //Owl is going to whistle(?)
        if (this.scanUpcomingInput(true, 2)) {
            this.stackOnShift();
            this.isOwlWhistling(0);
        }
        //Owl is going to bark(?)
        else if (this.scanUpcomingInput(true, 1)) {
            this.stackOnShift();
            this.isOwlBarking(0);
        }
        //Owl is going to hoot(?)
        else if (this.scanUpcomingInput(true, 0)) {
            this.stackOnShift();
            this.isOwlHooting(0);
        }
        //Owl is definitely not going to hoot at this point '-'
        else {
            this.reduceShiftOnSingle();
        }
    };
    Parser.prototype.readMultiple = function () {
        if (this.tokenStack[1] == this.token.getOwlNoiseVal(0) ||
            this.tokenStack[1] == this.token.getOwlNoiseVal(1) ||
            this.tokenStack[1] == this.token.getOwlNoiseVal(2)) {
            if (this.tokenStack[0] == this.action.getSingle()) {
                if (this.scanUpcomingInput(false, 1)) {
                    this.stackOnShift();
                    this.isOwlBarking(1);
                }
                else if (this.scanUpcomingInput(false, 2)) {
                    this.stackOnShift();
                    this.isOwlWhistling(1);
                }
                else if (this.scanUpcomingInput(false, 0)) {
                    this.stackOnShift();
                    this.isOwlHooting(1);
                }
                else {
                    this.reduceShiftOnKeywordDouble();
                }
            }
            else {
                this.reduceShiftOnKeywordDouble();
            }
        }
        else {
            this.reduceShiftOnKeywordDouble();
        }
    };
    //Reduce and shift from KEYWORD to Double <EXP>
    Parser.prototype.reduceShiftOnKeywordDouble = function () {
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getKeyword() });
        this.tokenStack[1] = this.action.getSingle();
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble() });
        this.tokenStack.pop();
        if (this.inputStack.length != 0) {
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
        }
        else {
            if (!this.scanTokenStack()) {
                this.stackOnComplete();
            }
        }
    };
    //Execute basic shift & reduce based on the current owl's action
    Parser.prototype.doBasicShift = function () {
        if (this.inputStack.length != 0) {
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
            if (this.currOwlAction == 2) {
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
            else {
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
                this.tokenStack.push(this.inputStack[0]);
                this.shiftStack();
            }
        }
    };
    //Reduce and shift on Single <EXP>
    Parser.prototype.reduceShiftOnSingle = function () {
        this.tokenStack[0] = this.action.getSingle();
        this.tokenStack.push(this.inputStack[0]);
        this.shiftStack();
        if (this.inputStack.length == 0) {
            if (!this.scanTokenStack()) {
                this.stackOnComplete();
            }
        }
    };
    //Reduce shift on init when inputs are invalid owl's action
    Parser.prototype.reduceShiftOnInit = function () {
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getKeyword() });
        this.tokenStack[0] = this.action.getSingle();
        if (this.inputStack.length == 0) {
            this.stackOnComplete();
        }
        else {
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
            this.tokenStack.push(this.inputStack[0]);
            this.shiftStack();
        }
    };
    //Execute basic shift on both owl's action and non-action
    Parser.prototype.stackOnShift = function () {
        this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
        this.tokenStack.push(this.inputStack[0]);
        this.shiftStack();
        if (this.inputStack.length != 0) {
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
        }
    };
    //Execute on complete
    Parser.prototype.stackOnComplete = function () {
        if (!this.isCompleted) {
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: "" });
            this.isCompleted = true;
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
            this.owlActions.bark.amount++;
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getBark() });
            if (this.tokenStack[0] == this.action.getSingle()) {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getDouble());
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble() });
                this.tokenStack.pop();
                this.tokenStack.push(this.action.getSingle());
            }
            else {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getSingle());
            }
            !this.scanTokenStack() && this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
        }
    };
    //Check at last if owl is really whistling
    //<OWL_BARK> => hu woo woo hoot <EXP>
    Parser.prototype.isOwlWhistling = function (pos) {
        this.doBasicShift();
        if (this.tokenStack[pos] == this.token.getOwlNoiseVal(1) &&
            this.tokenStack[pos + 1] == this.token.getOwlNoiseVal(2) &&
            this.tokenStack[pos + 2] == this.token.getOwlNoiseVal(2) &&
            this.tokenStack[pos + 3] == this.token.getOwlNoiseVal(0) &&
            (this.tokenStack[pos + 4] == this.token.getOwlNoiseVal(0) ||
                this.tokenStack[pos + 4] == this.token.getOwlNoiseVal(1) ||
                this.tokenStack[pos + 4] == this.token.getOwlNoiseVal(2))) {
            this.owlActions.whistle.amount++;
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getWhistle() });
            if (this.tokenStack[0] == this.action.getSingle()) {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getDouble());
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble() });
                this.tokenStack.pop();
                this.tokenStack.push(this.action.getSingle());
            }
            else {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getSingle());
            }
            !this.scanTokenStack() && this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
        }
    };
    //Check at last if owl is really hooting
    //<OWL_HOOT> => hoot hoot hu <EXP>
    Parser.prototype.isOwlHooting = function (pos) {
        this.doBasicShift();
        if (this.tokenStack[pos] == this.token.getOwlNoiseVal(0) &&
            this.tokenStack[pos + 1] == this.token.getOwlNoiseVal(0) &&
            this.tokenStack[pos + 2] == this.token.getOwlNoiseVal(1) &&
            (this.tokenStack[pos + 3] == this.token.getOwlNoiseVal(0) ||
                this.tokenStack[pos + 3] == this.token.getOwlNoiseVal(1) ||
                this.tokenStack[pos + 3] == this.token.getOwlNoiseVal(2))) {
            this.owlActions.hoot.amount++;
            this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getHoot() });
            if (this.tokenStack[0] == this.action.getSingle()) {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getDouble());
                this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getDouble() });
                this.tokenStack.pop();
                this.tokenStack.push(this.action.getSingle());
            }
            else {
                this.tokenStack = [];
                this.tokenStack.push(this.action.getSingle());
            }
            !this.scanTokenStack() && this.inputStack.length == 0 ? this.stackOnComplete() : this.parserStack.push({ stack: "$" + this.tokenStack.join(" "), input: this.trimInputOnDisplay(), action: this.action.getAction(0) });
        }
    };
    //Check if there's any keyword exist in the stack
    Parser.prototype.scanTokenStack = function () {
        var needles = [this.token.getOwlNoiseVal(0), this.token.getOwlNoiseVal(1), this.token.getOwlNoiseVal(2)];
        var haystack = this.tokenStack;
        return needles.some(function (i) { return haystack.some(function (j) { return j === i; }); });
    };
    //Iterate through upcoming inputStack if it's a possible owl action
    //Type: 0-Hoot, 1-Bark, 2-Whistle
    Parser.prototype.scanUpcomingInput = function (isSingle, type) {
        if (!this.isCompleted) {
            if (this.inputStack.length == 0) {
                //Exit directly as there's no input left
                this.currOwlAction = -1;
                return false;
            }
            else if (isSingle) {
                if (this.tokenStack[0] == this.token.getOwlNoiseVal(1)) {
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                        (this.inputStack[1] == this.token.getOwlNoiseVal(0) ||
                            this.inputStack[1] == this.token.getOwlNoiseVal(1) ||
                            this.inputStack[1] == this.token.getOwlNoiseVal(2)) &&
                        this.inputStack[2] == this.token.getOwlNoiseVal(0) &&
                        type == 1) {
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
                        type == 2) {
                        //Valid whistling action
                        this.currOwlAction = type;
                        return true;
                    }
                    else {
                        this.currOwlAction = -1;
                        return false;
                    }
                }
                else if (this.tokenStack[0] == this.token.getOwlNoiseVal(0)) {
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                        this.inputStack[1] == this.token.getOwlNoiseVal(1) &&
                        (this.inputStack[2] == this.token.getOwlNoiseVal(0) ||
                            this.inputStack[2] == this.token.getOwlNoiseVal(1) ||
                            this.inputStack[2] == this.token.getOwlNoiseVal(2)) &&
                        type == 0) {
                        //Valid hooting action
                        this.currOwlAction = type;
                        return true;
                    }
                    else {
                        this.currOwlAction = -1;
                        return false;
                    }
                }
                else {
                    //Invalid actions..continue normally
                    this.currOwlAction = -1;
                    return false;
                }
            }
            else {
                if (this.tokenStack[1] == this.token.getOwlNoiseVal(1)) {
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                        (this.inputStack[1] == this.token.getOwlNoiseVal(0) ||
                            this.inputStack[1] == this.token.getOwlNoiseVal(1) ||
                            this.inputStack[1] == this.token.getOwlNoiseVal(2)) &&
                        this.inputStack[2] == this.token.getOwlNoiseVal(0) &&
                        type == 1) {
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
                        type == 2) {
                        //Valid whistling action
                        this.currOwlAction = type;
                        return true;
                    }
                    else {
                        this.currOwlAction = -1;
                        return false;
                    }
                }
                else if (this.tokenStack[1] == this.token.getOwlNoiseVal(0)) {
                    if (this.inputStack[0] == this.token.getOwlNoiseVal(0) &&
                        this.inputStack[1] == this.token.getOwlNoiseVal(1) &&
                        (this.inputStack[2] == this.token.getOwlNoiseVal(0) ||
                            this.inputStack[2] == this.token.getOwlNoiseVal(1) ||
                            this.inputStack[2] == this.token.getOwlNoiseVal(2)) &&
                        type == 0) {
                        //Valid hooting action
                        this.currOwlAction = type;
                        return true;
                    }
                    else {
                        this.currOwlAction = -1;
                        return false;
                    }
                }
                else {
                    //Invalid actions..continue normally
                    this.currOwlAction = -1;
                    return false;
                }
            }
        }
    };
    return Parser;
}());
exports.Parser = Parser;
