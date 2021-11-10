import { Token } from './Token';

export class Parser{

    private input: String;
    //private inputStack: String[];

    constructor(input: String){
        console.log("halo");
        this.input = input;
    }

    //Break input and put into an array
    preprocessInput(){
        let process: String[];
        process = this.input.toLowerCase().split(" ");
        console.log(process);
        
    }

    
}

let parser = new Parser("hoot hoot");
parser.preprocessInput();

