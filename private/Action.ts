import { ActionToken } from './Interfaces';

export class Action implements ActionToken{
    shift = "SHIFT";
    reduce = "REDUCE TO EXP -> ";

    constructor(){}

    getAction(type: any){return type==0 ? this.shift : this.reduce}
    
    getUnknown(){return "UNKNOWN"}
    getKeyword(){return "<KEYWORD>"}
    getSingle(){return "<EXP>"}
    getDouble(){return "<EXP> <EXP>"}
    getWhistle(){return "<OWL_WHISTLE>"}//hu woo woo hoot <KEYWORD>
    getBark(){return "<OWL_BARK>"}//hu hoot <KEYWORD> hoot
    getHoot(){return "<OWL_HOOT>"}//hoot hoot hu <KEYWORD>
}