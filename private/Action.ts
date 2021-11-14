import { ActionToken } from './Interfaces';

export class Action implements ActionToken{
    shift = "SHIFT";
    reduce = "REDUCE TO EXP -> ";

    constructor(){}

    getAction(type: any){return type==0 ? this.shift : this.reduce}
    
    getUnknown(){return "UNKNOWN"}
    getKeyword(){return "KEYWORD"}
    getSingle(){return "<EXP>"}
    getDouble(){return "<EXP> <EXP>"}
    getWhistle(){return "hu woo woo hoot <EXP>"}
    getBark(){return "hu hoot <EXP> hoot"}
    getHoot(){return "KEYWORD <EXP>"}
}