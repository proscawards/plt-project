"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
var Token_1 = require("./Token");
var Action_1 = require("./Action");
var chalk = require("chalk");
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = input;
        this.output = Array();
        this.preRegex = Array();
        this.postRegex = Array();
        this.error = Array();
        this.regex = /((?<![\w\d])(hoot|woo|hu)(?![\w\d]))*([/ /g])*/gmi;
        this.token = new Token_1.Token();
        this.action = new Action_1.Action();
    }
    Lexer.prototype.lexer = function () {
        var _this = this;
        this.preRegex = this.input.split(" ").filter(function (b) { return b; });
        this.postRegex = (this.input.match(this.regex) || []).filter(function (b) { return b; });
        for (var i = 0; i < this.preRegex.length; i++) {
            if (this.preRegex[i] == this.token.getOwlNoiseVal(0)) {
                this.output.push({ input: this.token.getOwlNoiseVal(0), token: this.action.getKeyword() });
                this.error.push({ input: this.token.getOwlNoiseVal(0), token: this.action.getKeyword() });
            }
            else if (this.preRegex[i] == this.token.getOwlNoiseVal(1)) {
                this.output.push({ input: this.token.getOwlNoiseVal(1), token: this.action.getKeyword() });
                this.error.push({ input: this.token.getOwlNoiseVal(1), token: this.action.getKeyword() });
            }
            else if (this.preRegex[i] == this.token.getOwlNoiseVal(2)) {
                this.output.push({ input: this.token.getOwlNoiseVal(2), token: this.action.getKeyword() });
                this.error.push({ input: this.token.getOwlNoiseVal(2), token: this.action.getKeyword() });
            }
            else {
                this.error.push({ input: this.preRegex[i], token: this.action.getUnknown() });
            }
        }
        if (this.error.some(function (e) { return e.token === _this.action.getUnknown(); })) {
            console.log(chalk.red.bold("Error! Unknown token(s) found in the input."));
            return { preRegex: this.error, postRegex: this.postRegex, isValid: false };
        }
        else {
            return { preRegex: this.output, postRegex: this.postRegex, isValid: true };
        }
    };
    return Lexer;
}());
exports.Lexer = Lexer;
