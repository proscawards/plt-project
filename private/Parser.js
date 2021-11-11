"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var Token_1 = require("./Token");
var Action_1 = require("./Action");
var Parser = /** @class */ (function () {
    function Parser(input, output, isInputValid) {
        this.input = input;
        this.output = output;
        this.isInputValid = isInputValid;
        this.inputStack = Array();
        this.tokenStack = Array();
        this.token = new Token_1.Token();
        this.action = new Action_1.Action();
    }
    //Main function
    Parser.prototype.main = function () {
        this.preprocessInput();
        this.validateToken();
    };
    //Append to stack
    Parser.prototype.addStack = function (input) { this.inputStack.push(input); };
    //Pop stack
    Parser.prototype.popStack = function () { this.inputStack.pop(); };
    //Break input and put into an array
    Parser.prototype.preprocessInput = function () {
        var _this = this;
        var process;
        process = this.input.toLowerCase().split(" ");
        process.map(function (p) { return _this.addStack(p); });
    };
    //Validate if the inputs are valid tokens
    Parser.prototype.validateToken = function () {
        if (this.isInputValid) {
            this.preprocessTokenStack();
        }
        else {
            console.log("Error! Unknown token(s) found in the input.");
        }
    };
    //Process token stack
    Parser.prototype.preprocessTokenStack = function () {
        for (var i = 0; i < this.inputStack.length; i++) {
            this.tokenStack.push({ stack: "$", input: this.inputStack.join(" "), action: this.action.getAction(0) });
        }
        this.tokenStack.map(function (tok) {
            console.table(tok.stack + "\t\t" + tok.input + "\t\t" + tok.action);
        });
    };
    return Parser;
}());
exports.Parser = Parser;
