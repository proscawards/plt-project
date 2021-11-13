"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
var Token = /** @class */ (function () {
    function Token() {
        this.OWL_HOOT = { token: "<OWL_HOOT>", value: "hoot" };
        this.OWL_BARK = { token: "<OWL_BARK>", value: "hu" };
        this.OWL_WHISTLE = { token: "<OWL_WHISTLE>", value: "woo" };
        this.exp = "<EXP>";
        this.owl_noises = Array();
        this.owl_noises.push(this.OWL_HOOT, this.OWL_BARK, this.OWL_WHISTLE);
    }
    Token.prototype.getExp = function () { return this.exp; };
    Token.prototype.getOwlNoiseTok = function (index) { return this.owl_noises[index].token; };
    Token.prototype.getOwlNoiseVal = function (index) { return this.owl_noises[index].value; };
    return Token;
}());
exports.Token = Token;
