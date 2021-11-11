"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
var Token_1 = require("./Token");
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = input;
        this.output = Array();
        this.tokenize = Array();
        this.backup = Array();
        this.error = Array();
        this.regex = /((?<![\w\d])(hoot|woo|hu)(?![\w\d]))*([/ /g])*/gmi;
        this.token = new Token_1.Token();
    }
    Lexer.prototype.lexer = function () {
        //this.tokenize = (this.input.match(this.regex) || []).filter(b => b);
        this.tokenize = this.input.split(" ").filter(function (b) { return b; });
        for (var i = 0; i < this.tokenize.length; i++) {
            if (this.tokenize[i].includes(this.token.getOwlNoiseVal(0))) {
                this.output.push({ input: this.token.getOwlNoiseVal(0), token: this.token.getOwlNoiseTok(0) });
            }
            else if (this.tokenize[i].includes(this.token.getOwlNoiseVal(1))) {
                this.output.push({ input: this.token.getOwlNoiseVal(1), token: this.token.getOwlNoiseTok(1) });
            }
            else if (this.tokenize[i].includes(this.token.getOwlNoiseVal(2))) {
                this.output.push({ input: this.token.getOwlNoiseVal(2), token: this.token.getOwlNoiseTok(2) });
            }
            else {
                this.error.push({ input: this.tokenize[i], token: "UNKNOWN" });
                break;
            }
        }
        if (this.error.length == 0) {
            return { output: this.output, isValid: true };
        }
        else {
            console.log("Error! Unknown token(s) found in the input.");
            return { output: this.error, isValid: false };
        }
    };
    return Lexer;
}());
exports.Lexer = Lexer;
