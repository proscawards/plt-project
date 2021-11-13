"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lexer_1 = require("./private/Lexer");
var Parser_1 = require("./private/Parser");
var console_table_printer_1 = require("console-table-printer");
var chalk = require("chalk");
var Main = /** @class */ (function () {
    function Main(input) {
        this.input = input;
        this.lexer = new Lexer_1.Lexer(input);
        this.tokenLexer = { output: Array(), isValid: false };
        this.tokenParser = { parserToken: Array(), result: "", amount: 0 };
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
        this.tokenParser = this.parser.main();
        var p = new console_table_printer_1.Table({
            columns: [
                { name: 'stack', title: 'Stack', alignment: 'left' },
                { name: 'input', title: 'Input', alignment: 'left' }
            ],
            computedColumns: [
                { name: 'actions', title: 'Action', alignment: 'left',
                    function: function (row) {
                        var val = row.action;
                        if (val == "SHIFT") {
                            return chalk.red(val);
                        }
                        return chalk.blue(val);
                    }
                }
            ],
            disabledColumns: ["action"],
        });
        p.addRows(this.tokenParser.parserToken, { color: 'green' });
        p.printTable();
        console.log("Result: 🦉 is " + this.tokenParser.result + this.preprocessAmount() + "\n");
    };
    //Display the amount of owl's action
    Main.prototype.preprocessAmount = function () {
        if (this.tokenParser.amount == 1) {
            return "!";
        }
        else if (this.tokenParser.amount == 2) {
            return " for twice!";
        }
        else if (this.tokenParser.amount == 3) {
            return " for thrice!";
        }
        else if (this.tokenParser.amount > 3) {
            return " for many times!";
        }
    };
    return Main;
}());
var input = "hu hoot woo hoot hu hoot woo hoot hu hoot woo hoot hu hoot woo hoot";
var main = new Main(input);
main.runLexer();
main.runParser();
