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
import { LexerToken } from './Interfaces';

interface Owl{
    OWL_HOOT: LexerToken,
    OWL_BARK: LexerToken,
    OWL_WHISTLE: LexerToken,
    OWL_BARRED: LexerToken,
    OWL_BOREAL: LexerToken,
    OWL_ESCREECH: LexerToken
    OWL_FLAMMULATED: LexerToken,
}

export class Token implements Owl{
    OWL_HOOT = {token: "OWL_HOOT", value: "hoot"};
    OWL_BARK = {token: "OWL_BARK", value: "hu"};
    OWL_WHISTLE = {token: "OWL_WHISTLE", value: "woo"};
    OWL_BARRED = {token: "OWL_BARRED", value: "<OWL_WHISTLE><OWL_BARK>"};
    OWL_BOREAL = {token: "OWL_BOREAL", value: "<OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK>"};
    OWL_ESCREECH = {token: "OWL_ESCREECH", value: "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_HOOT>"};
    OWL_FLAMMULATED = {token: "OWL_FLAMMULATED", value: "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_BARK>"};

    private exp: String;
    private owl_noises: LexerToken[];
    private owl_species: LexerToken[];
    
    constructor(){
        this.exp = "<EXP>";
        this.owl_noises = Array();
        this.owl_noises.push(this.OWL_HOOT, this.OWL_BARK, this.OWL_WHISTLE);
        this.owl_species = Array();
        this.owl_species.push(this.OWL_BARRED, this.OWL_BOREAL, this.OWL_ESCREECH, this.OWL_FLAMMULATED);
    }

    getExp(){return this.exp;}

    getOwlNoiseTok(index: any){return this.owl_noises[index].token;}
    getOwlNoiseVal(index: any){return this.owl_noises[index].value;}

    getOwlSpeciesTok(index: any){return this.owl_species[index].token;}
    getOwlSpeciesVal(index: any){return this.owl_species[index].value;}

}