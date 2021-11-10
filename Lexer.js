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
        this.tokenize = this.input.match(this.regex) || [];
        this.backup = this.input.split(" ");
        for (var i = 0; i < this.tokenize.length; i++) {
            if (this.tokenize[i].includes(this.token.getOwlNoiseVal(0))) {
                this.output.push({ str: this.tokenize[i].trim(), token: this.token.getOwlNoiseTok(0) });
                break;
            }
            else if (this.tokenize[i].includes(this.token.getOwlNoiseVal(1))) {
                this.output.push({ str: this.tokenize[i].trim(), token: this.token.getOwlNoiseTok(1) });
                break;
            }
            else if (this.tokenize[i].includes(this.token.getOwlNoiseVal(2))) {
                this.output.push({ str: this.tokenize[i].trim(), token: this.token.getOwlNoiseTok(2) });
                break;
            }
            else {
                this.error.push({ str: this.backup[i].trim(), token: "UNKNOWN" });
                break;
            }
        }
        if (this.error.length > 0) {
            console.log("Error! Unknown token(s) found in the input.");
            return this.error;
        }
        else {
            return this.output;
        }
    };
    return Lexer;
}());
exports.Lexer = Lexer;