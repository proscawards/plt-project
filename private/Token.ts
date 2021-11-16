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