"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lexer_1 = require("./private/Lexer");
var Parser_1 = require("./private/Parser");
var Main = /** @class */ (function () {
    function Main(input) {
        this.input = input;
        this.lexer = new Lexer_1.Lexer(input);
        this.tokenLexer = { output: Array(), isValid: false };
        console.log("Input: ");
        console.log(this.input);
    }
    Main.prototype.runLexer = function () {
        console.log("\nLexical Analysis: ");
        this.tokenLexer = this.lexer.lexer();
        this.parser = new Parser_1.Parser(this.input, this.tokenLexer.output, this.tokenLexer.isValid);
        this.tokenLexer.output.map(function (tok) {
            return console.log("[" + tok.input + ", " + tok.token + "]");
        });
        if (!this.tokenLexer.isValid) {
            console.log("Compiler has stopped reading...");
        }
    };
    Main.prototype.runParser = function () {
        console.log("\nSyntax Analysis: ");
        console.log("stack\t\t\t\tinput\t\t\t\taction");
        this.parser.main();
        console.log("\n");
    };
    return Main;
}());
var input = "hoot hu";
var main = new Main(input);
main.runLexer();
main.runParser();
