import { ActionToken } from './Interfaces';

export class Action implements ActionToken{
    shift = "SHIFT";
    reduce = "REDUCE TO -> ";

    constructor(){}

    getAction(type: any){return type==0 ? this.shift : this.reduce}
}