"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
var Lexer_1 = require("./Lexer");
var Parser_1 = require("./Parser");
var Action_1 = require("./Action");
var console_table_printer_1 = require("console-table-printer");
var chalk = require("chalk");
var Runner = /** @class */ (function () {
    function Runner(input) {
        this.input = input;
        this.lexer = new Lexer_1.Lexer(input);
        this.tokenLexer = { output: Array(), isValid: false };
        this.tokenParser = { parserToken: Array(), owlActions: { hoot: { action: "", amount: 0 }, bark: { action: "", amount: 0 }, whistle: { action: "", amount: 0 } }, isError: false };
        this.action = new Action_1.Action();
    }
    Runner.prototype.runLexer = function () {
        console.log(chalk.yellow.underline("\nLexical Analysis: "));
        this.tokenLexer = this.lexer.lexer();
        this.parser = new Parser_1.Parser(this.input, this.tokenLexer.output, this.tokenLexer.isValid);
        console.log("Result:");
        this.tokenLexer.output.map(function (tok) {
            return console.log("[" + tok.input + ", " + tok.token + "]");
        });
        //if (!this.tokenLexer.isValid){console.log("Compiler has stopped reading...")}
    };
    Runner.prototype.runParser = function () {
        var _this = this;
        console.log(chalk.yellow.underline("\nSyntax Analysis: "));
        this.tokenParser = this.parser.main();
        console.log("Result:");
        if (!this.tokenParser.isError) {
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
                                return chalk.red.bold(val);
                            }
                            else {
                                if (val) {
                                    return chalk.blue.bold(_this.action.getAction(1)) + chalk.magenta.bold(val);
                                }
                            }
                        }
                    }
                ],
                disabledColumns: ["action"],
            });
            p.addRows(this.tokenParser.parserToken, { color: 'green' });
            p.printTable();
        }
        console.log("🦉 is " + this.preprocessOwlActions() + "\n");
    };
    //Preprocess owl's corresponding action and amount
    Runner.prototype.preprocessOwlActions = function () {
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
    Runner.prototype.stringBuilder = function (isHooting, isWhistling, isBarking, isError) {
        var hoot = (this.tokenParser.owlActions.hoot.action).toString() + " " + (this.tokenParser.owlActions.hoot.amount).toString() + (this.tokenParser.owlActions.hoot.amount > 1 ? " times" : " time");
        var whistle = (this.tokenParser.owlActions.whistle.action).toString() + " " + (this.tokenParser.owlActions.whistle.amount).toString() + (this.tokenParser.owlActions.whistle.amount > 1 ? " times" : " time");
        var bark = (this.tokenParser.owlActions.bark.action).toString() + " " + (this.tokenParser.owlActions.bark.amount).toString() + (this.tokenParser.owlActions.bark.amount > 1 ? " times" : " time");
        var and = " and ";
        var dot = "!";
        var com = ", ";
        if (isError) {
            return "talking gibberish!";
        }
        else {
            if (isHooting && isWhistling && isBarking) {
                return hoot + com + whistle + and + bark + dot;
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
    return Runner;
}());
exports.Runner = Runner;
