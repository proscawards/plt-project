import { ActionToken } from './Interfaces';
import { Token } from './Token';

export class Action implements ActionToken{
    shift = "SHIFT";
    reduce = "REDUCE TO EXP -> ";
    private token: any;

    constructor(){
        this.token = new Token();
    }

    getAction(type: any){return type==0 ? this.shift : this.reduce}

    getKeyword(){return "KEYWORD"}
    getSingle(){return "<EXP>"}
    getDouble(){return "<EXP> <EXP>"}
    getTriple(){return "<EXP> <EXP> <EXP>"}
    getQuadruple(){return "<EXP> <EXP> <EXP> <EXP>"}
    getQuintuple(){return "<EXP> <EXP> <EXP> <EXP> <EXP>"}

}