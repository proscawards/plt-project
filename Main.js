"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lexer_1 = require("./Lexer");
var Main = /** @class */ (function () {
    function Main(input) {
        this.input = input;
        this.lexer = new Lexer_1.Lexer(input);
        this.tokenLexer = Array();
    }
    Main.prototype.runLexer = function () {
        console.log("Lexical Analysis: ");
        this.tokenLexer = this.lexer.lexer();
        this.tokenLexer.map(function (tok) {
            return console.log("[" + tok.str + ", " + tok.token + "]");
        });
    };
    return Main;
}());
var input = "hootjaja hoot woo hu hu hoot yeet";
var main = new Main(input);
main.runLexer();
