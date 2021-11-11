"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
var Token = /** @class */ (function () {
    function Token() {
        this.OWL_HOOT = { token: "OWL_HOOT", value: "hoot" };
        this.OWL_BARK = { token: "OWL_BARK", value: "hu" };
        this.OWL_WHISTLE = { token: "OWL_WHISTLE", value: "woo" };
        this.OWL_BARRED = { token: "OWL_BARRED", value: "<OWL_WHISTLE><OWL_BARK>" };
        this.OWL_BOREAL = { token: "OWL_BOREAL", value: "<OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK>" };
        this.OWL_ESCREECH = { token: "OWL_ESCREECH", value: "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_HOOT>" };
        this.OWL_FLAMMULATED = { token: "OWL_FLAMMULATED", value: "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_BARK>" };
        this.exp = "<EXP>";
        this.owl_noises = Array();
        this.owl_noises.push(this.OWL_HOOT, this.OWL_BARK, this.OWL_WHISTLE);
        this.owl_species = Array();
        this.owl_species.push(this.OWL_BARRED, this.OWL_BOREAL, this.OWL_ESCREECH, this.OWL_FLAMMULATED);
    }
    Token.prototype.getExp = function () { return this.exp; };
    Token.prototype.getOwlNoiseTok = function (index) { return this.owl_noises[index].token; };
    Token.prototype.getOwlNoiseVal = function (index) { return this.owl_noises[index].value; };
    Token.prototype.getOwlSpeciesTok = function (index) { return this.owl_species[index].token; };
    Token.prototype.getOwlSpeciesVal = function (index) { return this.owl_species[index].value; };
    return Token;
}());
exports.Token = Token;
