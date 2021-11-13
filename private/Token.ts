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
}

export class Token implements Owl{
    OWL_HOOT = {token: "<OWL_HOOT>", value: "hoot"};
    OWL_BARK = {token: "<OWL_BARK>", value: "hu"};
    OWL_WHISTLE = {token: "<OWL_WHISTLE>", value: "woo"};

    private exp: String;
    private owl_noises: LexerToken[];
    
    constructor(){
        this.exp = "<EXP>";
        this.owl_noises = Array();
        this.owl_noises.push(this.OWL_HOOT, this.OWL_BARK, this.OWL_WHISTLE);
    }

    getExp(){return this.exp;}

    getOwlNoiseTok(index: any){return this.owl_noises[index].token;}
    getOwlNoiseVal(index: any){return this.owl_noises[index].value;}

}