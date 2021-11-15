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
        this.tokenParser = { parserToken: Array(), owlActions: { hoot: { action: "", amount: 0 }, bark: { action: "", amount: 0 }, whistle: { action: "", amount: 0 } }, isError: false };
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
        console.log("Result: 🦉 is " + this.preprocessOwlActions() + "\n");
    };
    //Preprocess owl's corresponding action and amount
    Main.prototype.preprocessOwlActions = function () {
        var isHooting = false, isWhistling = false, isBarking = false;
        if (this.tokenParser.owlActions.hoot.amount > 0) {
            isHooting = true;
        }
        if (this.tokenParser.owlActions.whistle.amount > 0) {
            isWhistling = true;
        }
        if (this.tokenParser.owlActions.bark.amount > 0) {
            isBarking = true;
        }
        return this.stringBuilder(isHooting, isWhistling, isBarking, this.tokenParser.isError);
    };
    //Build owl actions into string for displaying purpose
    Main.prototype.stringBuilder = function (isHooting, isWhistling, isBarking, isError) {
        var hoot = (this.tokenParser.owlActions.hoot.action).toString() + " " + (this.tokenParser.owlActions.hoot.amount).toString() + " times";
        var whistle = (this.tokenParser.owlActions.whistle.action).toString() + " " + (this.tokenParser.owlActions.whistle.amount).toString() + " times";
        var bark = (this.tokenParser.owlActions.bark.action).toString() + " " + (this.tokenParser.owlActions.bark.amount).toString() + " times";
        var and = " and ";
        var dot = "!";
        var com = ", ";
        if (isError) {
            return "talking gibberish!";
        }
        else {
            if (isHooting && isWhistling && isBarking) {
                return hoot + com + whistle + dot + and + bark;
            }
            else if (isHooting && isWhistling && !isBarking) {
                return hoot + and + whistle + dot;
            }
            else if (isHooting && !isWhistling && isBarking) {
                return hoot + and + bark + dot;
            }
            else if (isHooting && !isWhistling && !isBarking) {
                return hoot + dot;
            }
            else if (!isHooting && isWhistling && isBarking) {
                return whistle + and + bark + dot;
            }
            else if (!isHooting && isWhistling && !isBarking) {
                return whistle + dot;
            }
            else if (!isHooting && !isWhistling && isBarking) {
                return bark + dot;
            }
            else {
                return "talking normally!";
            }
        }
    };
    return Main;
}());
var input = "hu hoot hu hoot hu hoot hu hoot hoot hoot hu hoot hu hoot hoot hu hoot hu hoot hoot hoot hu hoot hu hoot";
var main = new Main(input);
main.runLexer();
main.runParser();
