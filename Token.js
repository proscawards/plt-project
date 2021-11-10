"use strict";
/*
Start Symbol:
<EXP>
Terminal Symbol:
[HOOT]
Production Rules:
<owl_chirp> -> HOOT
<owl_speak> -> <owl_chirp>*
<owl_sing> -> <owl_chirp>*
<owl_sad> -> <owl_chirp>*
<owl_fly> -> <owl_chirp>+
<owl_stare> -> <owl_chirp>*
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
var Token = /** @class */ (function () {
    function Token() {
        this.OWL_HOOT = "hoot";
        this.OWL_BARK = "hu";
        this.OWL_WHISTLE = "woo";
        this.OWL_BARRED = "<OWL_WHISTLE><OWL_BARK>";
        this.OWL_BOREAL = "<OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK>";
        this.OWL_ESCREECH = "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_HOOT>";
        this.OWL_FLAMMULATED = "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_BARK>";
        this.exp = "<EXP>";
        this.owl_noises = Array();
        this.owl_noises.push({ token: "OWL_HOOT", value: this.OWL_HOOT });
        this.owl_noises.push({ token: "OWL_BARK", value: this.OWL_BARK });
        this.owl_noises.push({ token: "OWL_WHISTLE", value: this.OWL_WHISTLE });
        this.owl_species = Array();
        this.owl_species.push(this.OWL_BARRED, this.OWL_BOREAL, this.OWL_ESCREECH, this.OWL_FLAMMULATED);
    }
    Token.prototype.getExp = function () { return this.exp; };
    Token.prototype.getOwlNoiseTok = function (index) { return this.owl_noises[index].token; };
    Token.prototype.getOwlNoiseVal = function (index) { return this.owl_noises[index].value; };
    Token.prototype.getOwlSpecies = function (index) { return this.owl_species[index]; };
    return Token;
}());
exports.Token = Token;
