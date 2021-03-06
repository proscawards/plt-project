"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var Action = /** @class */ (function () {
    function Action() {
        this.shift = "SHIFT";
        this.reduce = "REDUCE TO EXP -> ";
    }
    Action.prototype.getAction = function (type) { return type == 0 ? this.shift : this.reduce; };
    Action.prototype.getUnknown = function () { return "UNKNOWN"; };
    Action.prototype.getKeyword = function () { return "<KEYWORD>"; };
    Action.prototype.getSingle = function () { return "<EXP>"; };
    Action.prototype.getDouble = function () { return "<EXP> <EXP>"; };
    Action.prototype.getWhistle = function () { return "<OWL_WHISTLE>"; }; //hu woo woo hoot <KEYWORD>
    Action.prototype.getBark = function () { return "<OWL_BARK>"; }; //hu hoot <KEYWORD> hoot
    Action.prototype.getHoot = function () { return "<OWL_HOOT>"; }; //hoot hoot hu <KEYWORD>
    return Action;
}());
exports.Action = Action;
