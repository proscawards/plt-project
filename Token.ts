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

interface Owl{
    OWL_HOOT: String,
    OWL_BARK: String,
    OWL_WHISTLE: String,
    OWL_BARRED: String,
    OWL_BOREAL: String,
    OWL_ESCREECH: String,
    OWL_FLAMMULATED: String
}

interface Lexer{
    token: String,
    value: String
}

export class Token implements Owl{
    OWL_HOOT = "hoot";
    OWL_BARK = "hu";
    OWL_WHISTLE = "woo";
    OWL_BARRED = "<OWL_WHISTLE><OWL_BARK>";
    OWL_BOREAL = "<OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK><OWL_BARK>"; 
    OWL_ESCREECH = "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_HOOT>";
    OWL_FLAMMULATED = "<OWL_BARK><OWL_WHISTLE><OWL_WHISTLE><OWL_BARK>"

    private exp: String;
    private owl_noises: Lexer[];
    private owl_species: String[];
    

    constructor(){
        this.exp = "<EXP>";
        this.owl_noises = Array();
        this.owl_noises.push({token: "OWL_HOOT", value: this.OWL_HOOT});
        this.owl_noises.push({token: "OWL_BARK", value: this.OWL_BARK});
        this.owl_noises.push({token: "OWL_WHISTLE", value: this.OWL_WHISTLE});
        this.owl_species = Array();
        this.owl_species.push(this.OWL_BARRED, this.OWL_BOREAL, this.OWL_ESCREECH, this.OWL_FLAMMULATED);
    }

    getExp(){return this.exp;}

    getOwlNoiseTok(index: any){return this.owl_noises[index].token;}
    getOwlNoiseVal(index: any){return this.owl_noises[index].value;}

    getOwlSpecies(index: any){return this.owl_species[index];}

}