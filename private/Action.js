"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var Action = /** @class */ (function () {
    function Action() {
        this.shift = "SHIFT";
        this.reduce = "REDUCE TO EXP -> ";
    }
    Action.prototype.getAction = function (type) { return type == 0 ? this.shift : this.reduce; };
    Action.prototype.getKeyword = function () { return "KEYWORD"; };
    Action.prototype.getSingle = function () { return "<EXP>"; };
    Action.prototype.getDouble = function () { return "<EXP> <EXP>"; };
    Action.prototype.getTriple = function () { return "<EXP> <EXP> <EXP>"; };
    Action.prototype.getQuadruple = function () { return "<EXP> <EXP> <EXP> <EXP>"; };
    Action.prototype.getQuintuple = function () { return "<EXP> <EXP> <EXP> <EXP> <EXP>"; };
    return Action;
}());
exports.Action = Action;
