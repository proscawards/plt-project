"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var Action = /** @class */ (function () {
    function Action() {
        this.shift = "SHIFT";
        this.reduce = "REDUCE TO -> ";
    }
    Action.prototype.getAction = function (type) { return type == 0 ? this.shift : this.reduce; };
    return Action;
}());
exports.Action = Action;
