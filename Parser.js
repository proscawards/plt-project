"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var Parser = /** @class */ (function () {
    //private inputStack: String[];
    function Parser(input) {
        console.log("halo");
        this.input = input;
    }
    //Break input and put into an array
    Parser.prototype.preprocessInput = function () {
        var process;
        process = this.input.toLowerCase().split(" ");
        console.log(process);
    };
    return Parser;
}());
exports.Parser = Parser;
var parser = new Parser("hoot hoot");
parser.preprocessInput();
